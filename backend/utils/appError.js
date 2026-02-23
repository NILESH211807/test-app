class AppError extends Error {
  constructor(message, code = "BAD_REQUEST") {
    super(message);
    this.extensions = { code };
  }
}

module.exports = AppError;
