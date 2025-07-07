const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

// userRoutes
const userRoutes = require('./routes/userRoutes')
app.use('/api/users', userRoutes)

// gptRoutes
const gptRoutes = require('./routes/gptRoutes')
app.use('/api/gpt', gptRoutes)

module.exports = app
