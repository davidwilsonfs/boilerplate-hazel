/**
 * Route: POST /note
 */
const util = require("./utils/util");
const repository = require("./repository");
const http_status = require("http-status-codes");
const { validateItem } = require("./utils/validate");
const { errorHandler } = require("./exceptions");

exports.handler = async event => {
  try {
    const data = JSON.parse(event.body);
    await validateItem(data);
    const item = await repository.createNote(data);

    return {
      statusCode: http_status.CREATED,
      headers: util.getResponseHeaders(),
      body: JSON.stringify(item)
    };
  } catch (err) {
    return errorHandler(err);
  }
};
