const mongoose = require('mongoose')
const SurfSpot = require('../models/SurfSpots')
const spots = require('../data/surfSpots.json')

require('dotenv').config()

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    const formattedSpots = spots.map(s => ({
      id: s.spot.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name: s.spot,
      location: {
        region: s.location,
        lat: s.lat,
        lng: s.lon,
      },
      buoy: {
        stationId: s.stationId,
        stationName: s.stationName,
      },
      distanceFromShoreMiles: s.distanceFromShoreMiles
    }))

    await SurfSpot.deleteMany({})
    await SurfSpot.insertMany(formattedSpots)

    console.log('🌊 Surf spots seeded successfully!')
  } catch (err) {
    console.error('Error seeding surf spots:', err)
  } finally {
    mongoose.connection.close()
  }
}

seed()
