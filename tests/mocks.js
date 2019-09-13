const dummyjson = require("dummy-json");
const uuidv4 = require("uuid/v4");
const moment = require("moment");

const mockNote = () =>
  JSON.parse(
    dummyjson.parse(`{
    "text": "{{lorem 5}}",
    "user_name": "{{firstName}}",
    "birthyear": {{date '1900' '2019' 'YYYY'}},
    "email": "{{email}}",
    "password": "A{{int 1 9}}{{int 1 9}}{{int 1 9}}{{int 1 9}}{{int 1 9}}a{{int 1 9}}{{int 1 9}}"
  }`)
  );

const mockNoteComplete = () =>
  JSON.parse(
    dummyjson.parse(`{
    "text": "{{lorem 5}}",
    "user_name": "{{firstName}}",
    "birthyear": {{date '1900' '2019' 'YYYY'}},
    "email": "{{email}}",
    "note_id": "${uuidv4()}",
    "timestamp": ${moment().unix()},
    "expires": ${moment()
      .add(90, "days")
      .unix()},
    "password": "A{{int 1 9}}{{int 1 9}}{{int 1 9}}{{int 1 9}}{{int 1 9}}a{{int 1 9}}{{int 1 9}}"
  }`)
  );

module.exports = { mockNote, mockNoteComplete };
