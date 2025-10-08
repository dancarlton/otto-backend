const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'otto-backend' })
})

module.exports = router
