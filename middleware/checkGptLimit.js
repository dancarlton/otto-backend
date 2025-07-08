// middleware/checkGptLimit.js
const ForbiddenError = require('../errors/ForbiddenError')

module.exports = (req, res, next) => {
  const user = req.user

  const now = new Date()
  const lastUsed = new Date(user.gptUsage?.lastUsed || 0)

  const isSameDay =
    now.getDate() === lastUsed.getDate() &&
    now.getMonth() === lastUsed.getMonth() &&
    now.getFullYear() === lastUsed.getFullYear()

  // If it's a new day, reset count
  if (!isSameDay) {
    user.gptUsage = { count: 0, lastUsed: now }
  }

  // Check limit
  if (user.gptUsage.count >= 5) {
    throw new ForbiddenError('You’ve reached your daily Otto usage limit. Check back tomorrow!')
  }

  // Update usage and move to next middleware
  user.gptUsage.count += 1
  user.gptUsage.lastUsed = now

  user
    .save()
    .then(() => next())
    .catch(next)
}
