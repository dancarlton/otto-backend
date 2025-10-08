const mongoose = require('mongoose')
const app = require('./app')
require('dotenv').config()

const PORT = process.env.PORT || 3001

// global connection cache
let isConnected = false

async function connectToDatabase() {
  if (isConnected) return
  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false, // prevent buffering
    })
    isConnected = db.connections[0].readyState === 1
    console.log('✅ MongoDB connected (Vercel)')
  } catch (err) {
    console.error('❌ Mongo connection failed:', err.message)
  }
}

if (process.env.NODE_ENV !== 'production') {
  // local dev
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log('✅ MongoDB connected (Local)')
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
    })
    .catch((err) => console.error('❌ MongoDB connection error:', err))
} else {
  // serverless env (Vercel)
  app.use(async (req, res, next) => {
    await connectToDatabase()
    next()
  })

  module.exports = app
}
