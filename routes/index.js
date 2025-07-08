const express = require('express')
const router = express.Router()

const userRoutes = require('./userRoutes')
const gptRoutes = require('./gptRoutes')
const surfSpotRoutes = require('./surfSpotRoutes')
const buoyRoutes = require('./buoyRoutes')

// mount each route under its path
router.use('/users', userRoutes)
router.use('/gpt', gptRoutes)
router.use('/spots', surfSpotRoutes)
router.use('/buoy', buoyRoutes)

module.exports = router
