const mongoose = require('mongoose')
const app = require('./app')
require('dotenv').config()

const PORT = process.env.PORT || 3001

let isConnected = false

// Define function outside of the if-block ✅
async function connectToDatabase() {
  if (isConnected) return
  try {
    const db = await mongoose.connect(process.env.MONGO_URI)
    isConnected = !!db.connections[0].readyState
    console.log('✅ Connected to MongoDB (Vercel)')
  } catch (err) {
    console.error('❌ MongoDB connection error:', err)
  }
}

if (process.env.NODE_ENV !== 'production') {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log('✅ Connected to MongoDB (local)')
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
    })
    .catch((err) => console.error('❌ MongoDB connection error:', err))
} else {
  // Production (Vercel)
  app.use(async (req, res, next) => {
    await connectToDatabase()
    next()
  })

  module.exports = app
}
