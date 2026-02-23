const AppError = require("../utils/appError");
const userModel = require("../models/user.model");

module.exports.getUserProfile = async (user) => {
  if (!user || !user?.email) {
    throw new AppError(
      "Unauthorized access. Please login again.",
      "UNAUTHORIZED",
    );
  }

  try {
    const userData = await userModel.findOne({ email: user.email });

    console.log(userData);
    console.log("user", user);

    if (!userData) {
      throw new AppError(
        "Unauthorized access. Please login again.",
        "UNAUTHORIZED",
      );
    }

    let response = {
      id: userData._id.toString(),
      name: userData.name,
      email: userData.email,
      profile: userData?.profile,
      isActive: userData.isActive,
      role: userData.role,
      isVerified: userData.isVerified,
      createdAt: userData.createdAt,
    };

    if (userData.role === "admin" || userData.role === "super-admin") {
      response = {
        ...response,
        permission: userData.permissions,
      };
    }

    return response;
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError(
      err?.message || "Something went wrong",
      "INTERNAL_SERVER_ERROR",
    );
  }
};
