const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    preferences: {
      shredderLevel: { type: String },
      waveHeight: [{ type: String }],
      gear: {
        boards: [{ type: String }],
        wetsuits: [{ type: String }],
        fins: [{ type: String }],
      },
      travelDistance: [{ type: String }],
      notifications: { type: String },
    },
    gptUsage: {
      count: { type: Number, default: 0 },
      lastUsed: { type: Date, default: null },
    },
  },

  { timestamps: true }
)

module.exports = mongoose.model('User', userSchema)
