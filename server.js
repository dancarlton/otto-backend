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
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 20000,
      bufferCommands: false,
    })

    isConnected = db.connections[0].readyState === 1
    console.log('✅ MongoDB connected (Vercel)')
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message)
    throw err
  }
}

if (process.env.NODE_ENV !== 'production') {
  // Local dev
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log('✅ MongoDB connected (local)')
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
    })
    .catch((err) => console.error('❌ MongoDB connection error:', err))
} else {
  // Production (Vercel)
  module.exports = async (req, res) => {
    try {
      if (!isConnected) await connectToDatabase()
      return app(req, res) // ✅ only handle request once DB is ready
    } catch (err) {
      console.error('🔥 Fatal connection error:', err)
      res.status(500).json({ error: 'Database connection failed' })
    }
  }
}
