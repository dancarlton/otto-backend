const mongoose = require('mongoose')
const app = require('./app')
require('dotenv').config()

const PORT = process.env.PORT || 3001

// Only listen locally, not on Vercel
if (process.env.NODE_ENV !== 'production') {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log('✅ Connected to MongoDB (local)')
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
    })
    .catch((err) => console.error('❌ MongoDB connection error:', err))
} else {
  // On Vercel, just export the app — connection will be handled per request
  if (!mongoose.connection.readyState) {
    mongoose
      .connect(process.env.MONGO_URI)
      .then(() => console.log('✅ Connected to MongoDB (Vercel)'))
      .catch((err) => console.error('❌ MongoDB connection error:', err))
  }

  module.exports = app
}
