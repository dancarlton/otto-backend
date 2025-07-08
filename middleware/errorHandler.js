// const SUCCESS = 200
// const BAD_REQUEST = 400
// const UNAUTHORIZED = 401
// const FORBIDDEN = 403
// const NOT_FOUND = 404
// const CONFLICT = 409
// const INTERNAL_SERVER_ERROR = 500

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message =
    statusCode === 500 ? 'An error occured on the server' : err.message

  res.status(statusCode).send({ message })
}

module.exports = errorHandler
