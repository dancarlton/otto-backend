const express = require('express')
const router = express.Router()
const {
  getAllSpots,
  getSpotById,
  getSpotByName,
  getEnrichedSurfSpots,
} = require('../controllers/surfSpotController')

router.get('/', getAllSpots)
router.get('/id/:id', getSpotById)
router.get('/name/:name', getSpotByName)
router.get('/enriched', getEnrichedSurfSpots)

module.exports = router
