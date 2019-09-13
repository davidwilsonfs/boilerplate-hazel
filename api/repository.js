const AWS = require("aws-sdk");
const uuidv4 = require("uuid/v4");

const http_status = require("http-status-codes");
const { globalErrorHandler } = require("./exceptions");
const moment = require("moment");

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;

const createNote = async data => {
  const item = Object.assign({}, data);
  try {
    item.note_id = uuidv4();
    item.timestamp = moment().unix();
    item.expires = moment()
      .add(90, "days")
      .unix();

    await dynamodb
      .put({
        TableName: tableName,
        Item: item
      })
      .promise();

    return item;
  } catch (error) {
    globalErrorHandler(error, http_status.INTERNAL_SERVER_ERROR);
  }
};

const getNotes = async limit => {
  try {
    let params = {
      TableName: tableName,
      Limit: limit,
      ScanIndexForward: false
    };

    console.log(params);
    let data = await dynamodb.scan(params).promise();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    globalErrorHandler(error, http_status.INTERNAL_SERVER_ERROR);
  }
};

const getNoteById = async note_id => {
  try {
    let params = {
      TableName: tableName,
      KeyConditionExpression: "note_id = :note_id",
      ExpressionAttributeValues: {
        ":note_id": note_id
      },
      Limit: 1
    };

    console.log(params);
    let data = await dynamodb.query(params).promise();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    globalErrorHandler(error, http_status.INTERNAL_SERVER_ERROR);
  }
};

const updateNoteById = async (data, note_id) => {
  const item = Object.assign({}, data);
  try {
    item.expires = moment()
      .add(90, "days")
      .unix();

    const params = {
      TableName: tableName,
      Key: {
        note_id: note_id
      },
      UpdateExpression: Object.entries(item)
        .map(([key, _]) => key)
        .reduce((prev, next) => `${prev} #${next} = :${next},`, "set")
        .slice(0, -1),
      ExpressionAttributeNames: Object.entries(item).reduce(
        (prev, next) => Object.assign(prev, { [`#${next[0]}`]: next[0] }),
        {}
      ),
      ExpressionAttributeValues: Object.entries(item).reduce(
        (prev, next) => Object.assign(prev, { [`:${next[0]}`]: next[1] }),
        {}
      ),
      ReturnValues: "UPDATED_NEW"
    };

    console.log(params);

    let data = await dynamodb.update(params).promise();

    console.log(data);

    return item;
  } catch (error) {
    globalErrorHandler(error, http_status.INTERNAL_SERVER_ERROR);
  }
};

const removeNoteById = async note_id => {
  try {
    let params = {
      TableName: tableName,
      Key: {
        note_id
      }
    };

    const data = await dynamodb.delete(params).promise();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    globalErrorHandler(error, http_status.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNoteById,
  removeNoteById
};
