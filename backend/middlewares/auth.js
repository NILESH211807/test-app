const AppError = require("../utils/appError");
const { verifyToken } = require("../utils/jtwToken");

module.exports.isAuth = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    throw new AppError("Unauthorized access. please login", "UNAUTHORIZED");
  }

  try {
    const decoded = await verifyToken(token);

    if (!decoded) {
      throw new AppError("Unauthorized access. please login", "UNAUTHORIZED");
    }

    req.user = decoded;
    next();
  } catch (err) {
    throw new AppError(
      "Unauthorized access. Please login again.",
      "UNAUTHORIZED",
    );
  }
};
