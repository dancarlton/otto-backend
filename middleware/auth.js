const jwt = require("jsonwebtoken")
const { JWT_SECRET } = require("../utils/config")

const extractBearerToken = (header) => header.replace("Bearer ", "")

module.exports = (req, res, next) => {
  const { authorization } = req.headers

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or malformed authorization header" })
  }

  const token = extractBearerToken(authorization)

  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload 
    return next()
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" })
  }
}
