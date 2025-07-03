const express = require('express')
const router = express.Router()
const { register, updateUser } = require('../controllers/userController')
const auth = require( '../middleware/auth' )

router.post('/register', register)
router.patch('/update', auth, updateUser)

module.exports = router
