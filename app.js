const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

// Routes will go here, like:
const userRoutes = require('./routes/userRoutes')
app.use('/api/users', userRoutes)

module.exports = app
