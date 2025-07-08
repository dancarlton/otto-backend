const express = require('express')
const router = express.Router()
const { getNearestBuoy, getBuoyData } = require( '../controllers/buoyController' )
const { validateNearestBuoy } = require( '../middleware/validation' )

router.get('/nearest', validateNearestBuoy, getNearestBuoy)
router.get('/:stationId', getBuoyData)

module.exports = router
