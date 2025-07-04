const express = require('express')
const router = express.Router()
const { register, updateUser, login, getUser } = require('../controllers/userController')
const auth = require( '../middleware/auth' )

router.post('/login',login)
router.post('/register', register)
router.get('/me', auth, getUser)
router.patch('/update', auth, updateUser)

module.exports = router
