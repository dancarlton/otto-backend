const User = require('../models/Users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Custom Errors
const BadRequestError = require('../errors/BadRequestError')
const UnauthorizedError = require('../errors/UnauthorizedError')
const NotFoundError = require('../errors/NotFoundError')
const ConflictError = require('../errors/ConflictError')

// POST /users/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      throw new BadRequestError('Email and password are required')
    }

    const user = await User.findOne({ email })
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedError('Invalid email or password')
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    })

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        preferences: user.preferences || {},
      },
    })
  } catch (err) {
    next(err)
  }
}

// POST /users/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) throw new ConflictError('User already exists')

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({ name, email, password: hashedPassword })

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    })

    res.status(201).json({
      user: { _id: newUser._id, name: newUser.name, email: newUser.email },
      token,
    })
  } catch (err) {
    next(err)
  }
}

// GET /users/me
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      throw new NotFoundError('User not found')
    }

    res.status(200).json(user)
  } catch (err) {
    next(err)
  }
}

// PATCH /users/update
exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { name, email, password, preferences } = req.body

    const updatedFields = {}
    if (name) updatedFields.name = name
    if (email) updatedFields.email = email
    if (password) updatedFields.password = password

    if (preferences) {
      const cleaned = { ...preferences }

      if (cleaned.shredderLevel) {
        cleaned.shredderLevel = Array.isArray(cleaned.shredderLevel)
          ? cleaned.shredderLevel[0]
          : cleaned.shredderLevel
      }

      if (cleaned.notifications) {
        const raw = Array.isArray(cleaned.notifications)
          ? cleaned.notifications[0]
          : cleaned.notifications
        cleaned.notifications = raw === 'Yes' || raw === 'Maybe so'
      }

      updatedFields.preferences = cleaned
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedFields },
      { new: true }
    )

    res.status(200).json({ message: 'User updated', user: updatedUser })
  } catch (err) {
    next(err)
  }
}
