const { haversineDistance } = require('./geo')
const SurfSpot = require('../models/SurfSpots')

async function findNearestBuoy(lat, lng) {
  // get all spots
  const spots = await SurfSpot.find({})

  // set closest buoy tracker
  let nearest = null
  let minDistance = Infinity

  // loop through each spot
  for (let spot of spots) {
    const buoy = spot.buoy
    if (!buoy || !spot.location) continue

    // calculate distance from user to spot
    const distance = haversineDistance(
      lat,
      lng,
      spot.location.lat,
      spot.location.lng
    )

    // if closer than previous, save as nearest
    if (distance < minDistance) {
      minDistance = distance
      nearest = buoy
    }
  }

  // return closest buoy
  return nearest
}

module.exports = findNearestBuoy
