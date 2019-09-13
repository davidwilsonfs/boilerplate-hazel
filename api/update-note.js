/**
 * Route: PATCH /note
 */
const util = require("./utils/util");
const repository = require("./repository");
const http_status = require("http-status-codes");
const _ = require("underscore");
const {
  validateNoteIdParams,
  validateItemUpdate
} = require("./utils/validate");
const { errorHandler, globalErrorHandler } = require("./exceptions");

exports.handler = async event => {
  try {
    const { pathParameters } = event;

    await validateNoteIdParams(pathParameters);

    const note_id = decodeURIComponent(pathParameters.note_id);

    let data = await repository.getNoteById(note_id);

    if (_.isEmpty(data.Items)) {
      globalErrorHandler(
        { name: "NotFoundError", message: "Note not found by note_id passed" },
        http_status.NOT_FOUND,
        false
      );
    }

    data = JSON.parse(event.body);

    await validateItemUpdate(data);

    const item = await repository.updateNoteById(data, note_id);

    return {
      statusCode: http_status.OK,
      headers: util.getResponseHeaders(),
      body: JSON.stringify(item)
    };
  } catch (err) {
    return errorHandler(err);
  }
};
