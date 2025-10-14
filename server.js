const mongoose = require('mongoose')
const app = require('./app')
require('dotenv').config()

const PORT = process.env.PORT || 3001

// MongoDB connection
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 20000,
      bufferCommands: false,
    })
    console.log('✅ MongoDB connected')
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message)
    process.exit(1) // Exit if DB fails
  }
}

// Start server
connectToDatabase().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`)
  })
})
