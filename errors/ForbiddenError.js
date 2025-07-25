// const BAD_REQUEST = 400
// const UNAUTHORIZED = 401
// const FORBIDDEN = 403
// const NOT_FOUND = 404
// const CONFLICT = 409
// const INTERNAL_SERVER_ERROR = 500

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = ForbiddenError;
