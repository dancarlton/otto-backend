const express = require('express')
const { getNearestBuoy } = require( '../controllers/buoyController' )
const router = express.Router()

router.get('/nearest', getNearestBuoy)

module.exports = router
