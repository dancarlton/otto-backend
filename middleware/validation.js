// middleware/validation.js
const { celebrate, Joi } = require('celebrate');

// Validate user register
const validateUserRegister = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'The minimum length of the "name" field is 2',
        'string.max': 'The maximum length of the "name" field is 30',
        'string.empty': 'The "name" field must be filled in',
      }),
    email: Joi.string().required().email().messages({
      'string.empty': 'The "email" field must be filled in',
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'The "password" field must be filled in',
      'any.required': 'Password is required',
    }),
  }),
});

// Validate user login
const validateUserLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      'string.empty': 'The "email" field must be filled in',
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'The "password" field must be filled in',
      'any.required': 'Password is required',
    }),
  }),
});

// Validate nearest buoy query
const validateNearestBuoy = celebrate({
  query: Joi.object().keys({
    lat: Joi.number().required().min(-90).max(90),
    lng: Joi.number().required().min(-180).max(180),
  }),
});

module.exports = {
  validateUserRegister,
  validateUserLogin,
  validateNearestBuoy,
};
