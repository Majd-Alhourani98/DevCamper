const catchAsync = handler => (req, res, next) =>
  handler(req, res, next).catch(next);

module.exports = catchAsync;
