const User = require('../models/Users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) return res.status(400).json({ message: 'User already exists' })

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({ email, password: hashedPassword })

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.status(201).json({ user: { id: newUser._id, email: newUser.email }, token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}
