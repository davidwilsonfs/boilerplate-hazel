const { getResponseHeaders } = require("../utils/util");
const http_status = require("http-status-codes");

function Handler() {
  this.error = error => console.log(error);
  this.isTrustedError = error => error.isOperational;
}

const errorHandler = err => {
  const handler = new Handler();
  handler.error(err);
  const isTrustedError = handler.isTrustedError(err);

  return {
    statusCode: isTrustedError
      ? http_status.INTERNAL_SERVER_ERROR
      : err.statusCode,
    headers: getResponseHeaders(),
    body: JSON.stringify({
      error: err.name ? err.name : "Exception",
      message:
        err.message ||
        (err || http_status.getStatusText(http_status.INTERNAL_SERVER_ERROR))
    })
  };
};

module.exports = { errorHandler };
