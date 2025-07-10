
const { getActiveStations } = require('./parseActiveStations')
const { haversineDistance } = require('./geo')
const axios = require('axios')

async function buoyFeedExists(stationId) {
  const url = `https://www.ndbc.noaa.gov/data/latest_obs/${stationId}.rss`
  console.log(`Checking RSS feed for ${stationId}`)
  try {
    const res = await axios.head(url)
    return res.status === 200
  } catch (err) {
    console.warn(`Feed not found for ${stationId}`)
    return false
  }
}

async function findNearestBuoy(lat, lng) {
  const stations = getActiveStations() // use buoy stations, not surf spots

  let nearest = null
  let minDistance = Infinity

  // loop through all buoy stations to find the closest one
  for (let station of stations) {
    const distance = haversineDistance(lat, lng, station.lat, station.lng)
    if (distance > 100) continue  // skips distant locations

    const hasFeed = await buoyFeedExists(station.id)

    if (hasFeed && distance < minDistance) {
      minDistance = distance
      nearest = station
    }
  }

  // return the nearest buoy station (id, lat, lon, name)
  return nearest
}

module.exports = findNearestBuoy
