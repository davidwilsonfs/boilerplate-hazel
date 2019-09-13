const Joi = require("@hapi/joi");
const http_status = require("http-status-codes");
const { globalErrorHandler } = require("../exceptions");

const schemaItem = Joi.object({
  user_name: Joi.string().required(),
  text: Joi.string().required(),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9]{8,30}$/)
    .required(),
  birthyear: Joi.number()
    .integer()
    .min(1900)
    .max(2019),
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .required()
}).required();

const schemaItemUpdate = Joi.object({
  user_name: Joi.string(),
  text: Joi.string(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{8,30}$/),
  birthyear: Joi.number()
    .integer()
    .min(1900)
    .max(2019),
  email: Joi.string().email({ minDomainSegments: 2 })
}).required();

const schemaNoteIdParams = Joi.object({ note_id: Joi.string().required() });

const validateItem = async item => {
  const { error, value } = Joi.validate(item, schemaItem);

  if (error) {
    globalErrorHandler(error, http_status.BAD_REQUEST, false);
  }
  return value;
};

const validateItemUpdate = async item => {
  const { error, value } = Joi.validate(item, schemaItemUpdate);

  if (error) {
    globalErrorHandler(error, http_status.BAD_REQUEST, false);
  }
  return value;
};

const validateNoteIdParams = async item => {
  const { error, value } = Joi.validate(item, schemaNoteIdParams);

  if (error) {
    globalErrorHandler(error, http_status.BAD_REQUEST, false);
  }
  return value;
};

const validateQuery = async query => {
  let value = 10;

  if (query && query.limit) {
    if (!parseInt(query.limit)) {
      globalErrorHandler(
        { name: "ValidateError", message: "Limit must be a number" },
        http_status.BAD_REQUEST,
        false
      );
    } else {
      value = parseInt(query.limit);
    }
  }
  return value;
};

module.exports = {
  validateItem,
  validateItemUpdate,
  validateNoteIdParams,
  validateQuery
};
