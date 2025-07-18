const ForbiddenError = require('../errors/ForbiddenError');
const User = require('../models/Users');

module.exports = async (req, res, next) => {
  try {
    const dbUser = await User.findById(req.user._id);

    if (!dbUser) {
      throw new ForbiddenError('User not found');
    }

    const now = new Date();
    const lastUsed = new Date(dbUser.gptUsage?.lastUsed || 0);

    const isSameDay = now.getDate() === lastUsed.getDate()
      && now.getMonth() === lastUsed.getMonth()
      && now.getFullYear() === lastUsed.getFullYear();

    if (!isSameDay) {
      dbUser.gptUsage = { count: 0, lastUsed: now };
    }

    if (dbUser.gptUsage.count >= 5) {
      throw new ForbiddenError(
        'You’ve reached your daily Otto usage limit. Check back tomorrow!',
      );
    }

    dbUser.gptUsage.count += 1;
    dbUser.gptUsage.lastUsed = now;

    await dbUser.save();

    // Optional: re-attach updated user to request
    req.user = dbUser;

    next();
  } catch (err) {
    next(err);
  }
};
