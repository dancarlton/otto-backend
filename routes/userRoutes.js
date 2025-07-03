const express = require('express')
const router = express.Router()
const { register, updateUser, login } = require('../controllers/userController')
const auth = require( '../middleware/auth' )

router.post('/login',login)
router.post('/register', register)
router.patch('/update', auth, updateUser)

module.exports = router
