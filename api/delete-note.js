/**
 * Route: DELETE /note/t/{timestamp}
 */

const util = require("./utils/util");
const repository = require("./repository");
const _ = require("underscore");
const http_status = require("http-status-codes");
const { validateNoteIdParams } = require("./utils/validate");
const { errorHandler, globalErrorHandler } = require("./exceptions");

exports.handler = async event => {
  try {
    const { pathParameters } = event;
    console.log(pathParameters);

    await validateNoteIdParams(pathParameters);

    let note_id = decodeURIComponent(pathParameters.note_id);

    let data = await repository.getNoteById(note_id);
    console.log("togetthhahssss");
    console.log(data.Items);
    if (_.isEmpty(data.Items)) {
      globalErrorHandler(
        { name: "NotFoundError", message: "Note not found by note_id passed" },
        http_status.NOT_FOUND,
        false
      );
    }

    await repository.removeNoteById(note_id);

    return {
      statusCode: http_status.OK,
      headers: util.getResponseHeaders(),
      body: JSON.stringify({
        message: `Remove note (${note_id}) with success.`
      })
    };
  } catch (err) {
    console.log("Error", err);
    return errorHandler(err);
  }
};
