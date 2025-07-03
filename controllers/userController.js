const User = require('../models/Users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// POST /users/register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' })

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({ name, email, password: hashedPassword })

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    })

    res
      .status(201)
      .json({ user: { id: newUser._id, email: newUser.email }, token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

//patch /users/update
exports.updateUser = async (req, res) => {
  try {
    const userId = req.user.id
    const { name, email, password, preferences } = req.body
    const updatedFields = {}
    if (name) updatedFields.name = name
    if (email) updatedFields.email = email
    if (password) updatedFields.password = password
    if (preferences) {
      const cleanedPreferences = { ...preferences }

      if (cleanedPreferences.shredderLevel) {
        const value = cleanedPreferences.shredderLevel
        cleanedPreferences.shredderLevel = Array.isArray(value)
          ? value[0]
          : value
      }

      if (cleanedPreferences.notifications) {
        let value = cleanedPreferences.notifications
        const normalized = Array.isArray(value) ? value[0] : value

        if (normalized === 'Maybe so' || normalized === 'Yes') {
          value = true
        } else {
          value = false
        }

        cleanedPreferences.notifications = value
      }

      updatedFields.preferences = cleanedPreferences
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedFields },
      { new: true }
    )

    console.log('Updated user:', updatedUser)

    res.status(200).json({ message: 'User updated', user: updatedUser })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}
