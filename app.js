const express = require('express')
const cors = require('cors')
const helmet = require('helmet')

require('dotenv').config()

const app = express()

app.set('trust proxy', 1)

// middleware
app.use(cors())
app.use(express.json())
app.use(helmet())

// health is for waking up Render server
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'otto-backend' })
})

// routes
const routes = require('./routes')

app.use('/api', routes)

// error handler (should come after all routes)
const errorHandler = require('./middleware/errorHandler')

app.use(errorHandler)

// load active buoy stations on startup
const { loadActiveStations } = require('./utils/findNearbyRSSStations')

loadActiveStations()
  .then(() => console.log('✅ Buoy station list loaded'))
  .catch((err) => console.error('❌ Failed to load buoy stations:', err))

module.exports = app
