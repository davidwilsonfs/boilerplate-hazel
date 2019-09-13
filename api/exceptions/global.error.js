const AppError = require("./app.error");

const globalErrorHandler = (error, errorCode, isOperacional = true) => {
  throw new AppError(error, errorCode, isOperacional);
};

module.exports = { globalErrorHandler };
