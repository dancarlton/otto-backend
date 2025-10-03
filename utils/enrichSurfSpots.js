const fetchNDBCRss = require('./parseNDBC')
const findNearestBuoy = require('./findNearestBuoy')
const fetchUnsplashImage = require('./fetchUnsplashImage')

async function enrichSurfSpot(spot) {
  let buoyData = null

  // Try existing buoy stationId
  if (spot.buoy?.stationId) {
    buoyData = await fetchNDBCRss(spot.buoy.stationId)
  }

  // Find nearest buoy if none or invalid
  if (!buoyData) {
    const nearest = await findNearestBuoy(spot.location.lat, spot.location.lng)

    if (nearest) {
      console.log(
        `[updated] ${spot.name} → buoy.stationId set to ${nearest.stationId} (${nearest.name || 'unknown'})`,
      )

      // Ensure spot.buoy exists
      if (!spot.buoy) {
        spot.buoy = {}
      }

      // Update with nearest buoy info
      spot.buoy.stationId = nearest.stationId
      spot.buoy.stationName = nearest.name
      spot.buoy.lat = nearest.lat
      spot.buoy.lng = nearest.lng

      await spot.save()

      // Try fetching data again
      buoyData = await fetchNDBCRss(nearest.stationId)
    }
  }

  // Add Unsplash image if missing
  if (!spot.imageUrl) {
    const imageUrl = await fetchUnsplashImage(spot.name)
    if (imageUrl) {
      spot.imageUrl = imageUrl
      await spot.save()
    }
  }

  return { ...spot.toObject(), buoyData }
}

module.exports = enrichSurfSpot
