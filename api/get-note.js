/**
 * Route: GET /note/n/{note_id}
 */
const util = require("./utils/util");
const _ = require("underscore");
const repository = require("./repository");
const http_status = require("http-status-codes");
const { validateNoteIdParams } = require("./utils/validate");
const { errorHandler, globalErrorHandler } = require("./exceptions");

exports.handler = async event => {
  try {
    const { pathParameters } = event;

    await validateNoteIdParams(pathParameters);

    let note_id = decodeURIComponent(pathParameters.note_id);

    let data = await repository.getNoteById(note_id);

    console.log(data);
    if (!_.isEmpty(data.Items)) {
      return {
        statusCode: http_status.OK,
        headers: util.getResponseHeaders(),
        body: JSON.stringify(data.Items[0])
      };
    } else {
      globalErrorHandler(
        { name: "NotFoundError", message: "Note not found by note_id passed" },
        http_status.NOT_FOUND,
        false
      );
    }
  } catch (err) {
    return errorHandler(err);
  }
};
