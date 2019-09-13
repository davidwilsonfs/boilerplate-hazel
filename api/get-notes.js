/**
 * Route: GET /notes
 */
const util = require("./utils/util");
const _ = require("underscore");
const repository = require("./repository");
const http_status = require("http-status-codes");
const { validateQuery } = require("./utils/validate");
const { errorHandler } = require("./exceptions");

exports.handler = async event => {
  try {
    let { queryStringParameters } = event;

    let limit = validateQuery(queryStringParameters);
    console.log(limit);
    const data = await repository.getNotes(limit);
    console.log(data);
    return {
      statusCode: http_status.OK,
      headers: util.getResponseHeaders(),
      body: JSON.stringify(data)
    };
  } catch (err) {
    return errorHandler(err);
  }
};
