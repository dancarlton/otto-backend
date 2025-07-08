const express = require('express')
const router = express.Router()

const userRoutes = require('./userRoutes')
const gptRoutes = require('./gptRoutes')
const surfSpotRoutes = require('./surfSpotRoutes')
const buoyRoutes = require('./buoyRoutes')
const auth = require( '../middleware/auth' )

// mount each route under its path
router.use('/users', userRoutes)
router.use('/gpt', auth, gptRoutes)
router.use('/spots', auth, surfSpotRoutes)
router.use('/buoy', auth, buoyRoutes)

module.exports = router
