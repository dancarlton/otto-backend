// middleware/validation.js
const { celebrate, Joi } = require('celebrate')

// Validate user register
const validateUserRegister = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
})

// Validate user login
const validateUserLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
})

// Validate nearest buoy query
const validateNearestBuoy = celebrate({
  query: Joi.object().keys({
    lat: Joi.number().required().min(-90).max(90),
    lng: Joi.number().required().min(-180).max(180),
  }),
})

// You can add more as needed...

module.exports = {
  validateUserRegister,
  validateUserLogin,
  validateNearestBuoy,
}
