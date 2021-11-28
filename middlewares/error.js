const Joi = require('joi');
const { StatusCodes } = require('http-status-codes');
const errorTypes = require('../utils/errorTypes');

const error = (err, _req, res, _next) => {
  if (Joi.isError(err)) {
    const errorMessage = errorTypes.joiProductValidation(err);
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ err: errorMessage });
  }

  if (err.code === 'invalid_data') {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ err });
  }

  if (err.code === 'stock_problem') {
    return res.status(StatusCodes.NOT_FOUND).json({ err });
  }

  if (err.code === 'not_found') {
    return res.status(StatusCodes.NOT_FOUND).json({ err });
  }

  console.log(err);
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err: {
    code: 'internal_error',
    message: 'Internal server error',
  } });
};

module.exports = { error };
