// const SUCCESS = 200
// const BAD_REQUEST = 400
// const UNAUTHORIZED = 401
// const FORBIDDEN = 403
// const NOT_FOUND = 404
// const CONFLICT = 409
// const INTERNAL_SERVER_ERROR = 500

class NotFoundError extends Error {
  constructor(message) {
    super(message)
    this.statusCode = 404
  }
}

module.exports = NotFoundError
