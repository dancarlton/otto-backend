// const BAD_REQUEST = 400
// const UNAUTHORIZED = 401
// const FORBIDDEN = 403
// const NOT_FOUND = 404
// const CONFLICT = 409
// const INTERNAL_SERVER_ERROR = 500

const errorHandler = (err, req, res, next) => {
  console.error('🔥 Error:', err.name, '-', err.message)

  // joi validation error from Celebrate
  if (err.joi) {
    return res.status(400).send({
      message: err.joi.details.map((detail) => detail.message).join(', '),
    })
  }

  const statusCode = err.statusCode || 500
  const message =
    statusCode === 500 ? 'An error occured on the server' : err.message

  res.status(statusCode).send({ message })
}

module.exports = errorHandler
