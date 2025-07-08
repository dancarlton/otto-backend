const express = require('express')
const router = express.Router()
const {
  register,
  updateUser,
  login,
  getUser,
} = require('../controllers/userController')
const auth = require('../middleware/auth')
const { validateUserLogin, validateUserRegister } = require( '../middleware/validation' )

router.post('/login', validateUserLogin, login)
router.post('/register', validateUserRegister, register)
router.get('/me', auth, getUser)
router.patch('/update', auth, updateUser)

module.exports = router
