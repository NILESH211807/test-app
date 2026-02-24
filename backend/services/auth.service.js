const User = require("../models/user.model");
const AppError = require("../utils/appError");
const { setCookie } = require("../utils/cookie");
const { generateToken } = require("../utils/jtwToken");
const validate = require("../utils/validate");
const { signupSchema, loginSchema } = require("../validations/user.validator");
const ProductModel = require("../models/product.model");
const Authorization = require("../models/authorization.model");
const { encrypt } = require("../utils/encryption");
// const {
//   userRegistrationCounter,
//   loginCounter,
// } = require("../telemetry/metricsRegistry");

// signup
module.exports.signupUser = async (data, res) => {
  const { name, email, password, role } = validate(signupSchema, data);

  const roles = ["user", "admin"];

  if (roles.includes(role) === false) {
    throw new AppError("Invalid role", "BAD_USER_INPUT");
  }

  // const encryptedEmail = encrypt(email);

  try {
    const existingUser = await User.findOne({ email });

    // console.log(existingUser);

    if (existingUser) {
      throw new AppError("User already exists", "BAD_USER_INPUT");
    }

    const user = await User.create({
      name,
      email,
      password,
      isActive: role === "admin" ? false : true,
      role: role,
    });

    // if (user.role === "user") {
    //   userRegistrationCounter.add(1, {
    //     method: "email",
    //   });
    // }

    if (
      user.role === "admin" ||
      (user.role === "super-admin" && user.isActive === false)
    ) {
      return {
        success: true,
        message: "Signup successful",
      };
    }

    const token = await generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    setCookie(res, token);

    return {
      success: true,
      message: "Signup successful",
    };
  } catch (err) {
    // console.log("err", err);
    throw new AppError(
      err?.message || "Something went wrong",
      err?.statusCode || "INTERNAL_SERVER_ERROR",
    );
  }
};

// login
module.exports.loginUser = async (data, res) => {
  const { email, password, role } = validate(loginSchema, data);

  const roles = ["user", "admin", "super-admin"];

  if (roles.includes(role) === false) {
    throw new AppError("Invalid role", "BAD_USER_INPUT");
  }

  // const encryptedEmail = await encrypt(email);

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError("User not found", "BAD_USER_INPUT");
  }

  if (!user.isActive) {
    throw new AppError("User is not active", "BAD_USER_INPUT");
  }

  const checkPassword = await user.comparePassword(password);

  if (!checkPassword) {
    throw new AppError("Invalid credentials", "BAD_USER_INPUT");
  }
  const CLIENT_ID = process.env.CLIENT_ID;
  const REDIRECT_URI = process.env.REDIRECT_URI;
  let product = null;

  if (CLIENT_ID) {
    product = await ProductModel.findOne({ clientId: CLIENT_ID });
  }

  let isPermissionAllowed = false;

  if (user.role === "user" && product) {
    // const product = await Authorization.findOne({ userId: user._id });
    const authorization = await Authorization.findOne({
      userId: user._id,
      productId: product._id,
    });
    if (authorization) {
      isPermissionAllowed = true;
    }
  }

  // if (user.role === "user") {
  //   loginCounter.add(1);
  // }

  const token = await generateToken({
    id: user._id,
    email: user.email,
    role: user.role,
  });

  setCookie(res, token);

  return {
    success: true,
    message: "Login successful",
    isPermissionAllowed,
  };
};

// logout
module.exports.logoutUser = async (res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  res.clearCookie("token", cookieOptions);

  return {
    success: true,
    message: "Logout successful",
  };
};
