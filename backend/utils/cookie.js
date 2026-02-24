const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

module.exports.setCookie = (res, token) => {
  res.cookie("token", token, cookieOptions);
};

module.exports.clearCookie = (res) => {
  res.clearCookie("token", cookieOptions);
};
