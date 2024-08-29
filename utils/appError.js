class appError extends Error {
  constructor(message, statusCode) {
    console.log(message);
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = appError;
