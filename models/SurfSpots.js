const mongoose = require('mongoose')

const surfSpotSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    imageUrl: {type: String},
    location: {
      region: { type: String }, // city/state/
      lat: { type: Number },
      lng: { type: Number },
    },
    buoy: {
      stationId: { type: String },
      stationName: { type: String },
    },
    distanceFromShoreMiles: { type: Number },
  },
  { timestamps: true }
)

module.exports = mongoose.model('SurfSpot', surfSpotSchema)
