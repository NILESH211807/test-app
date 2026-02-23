const jwt = require("jsonwebtoken");

module.exports.generateToken = async (user) => {
  const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
  const token = jwt.sign(
    {
      id: user.id.toString(),
      email: user.email,
      role: user.role,
    },
    JWT_SECRET_KEY,
    {
      expiresIn: "1d",
    },
  );

  return token;
};

module.exports.verifyToken = async (token) => {
  const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    return decoded;
  } catch (err) {
    return null;
  }
};
