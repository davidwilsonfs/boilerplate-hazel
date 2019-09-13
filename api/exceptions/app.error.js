const util = require("util");
const http_status = require("http-status-codes");

/**
 * @description Error Handler App
 * @param {message, status. isOperational}
 */
function AppError(error, statusCode, isOperational) {
  Error.captureStackTrace(this, this.constructor);
  this.name = error.name || this.constructor.name;
  this.message =
    error.message ||
    (error || http_status.getStatusText(http_status.INTERNAL_SERVER_ERROR));
  this.statusCode = statusCode || http_status.INTERNAL_SERVER_ERROR;
  this.isOperational = isOperational;
}

util.inherits(AppError, Error);

module.exports = AppError;
