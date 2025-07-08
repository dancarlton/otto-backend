const express = require('express')
const router = express.Router()
const {
  getAllSpots,
  getSpotById,
  getSpotByName,
} = require('../controllers/surfSpotController')

router.get('/', getAllSpots)
router.get('/id/:id', getSpotById)
router.get('/name/:name', getSpotByName)

module.exports = router
