// try to enrich a surf spot with buoy data and image
// 1. try fetching buoy data using existing stationId
// 2. if missing or invalid, find nearest active buoy and assign it to spot
// 3. if imageUrl is missing, fetch an image and save it
// 4. return spot object + buoy data

const fetchNDBCRss = require('./parseNDBC')
const findNearestBuoy = require('./findNearestBuoy')
const fetchUnsplashImage = require('./fetchUnsplashImage')

async function enrichSurfSpot(spot) {
  let buoyData = null

  // try existing buoy data
  if (spot.buoy?.stationId) {
    buoyData = await fetchNDBCRss(spot.buoy.stationId)
  }

  // find nearest buoy if data is missing
  if (!buoyData) {
    const nearest = await findNearestBuoy(spot.location.lat, spot.location.lng)

    if (nearest) {
      console.log(
        `[updated] ${spot.name} → buoy.stationId set to ${nearest.id} (${nearest.name || 'unknown'})`
      )

      // set buoy fields correctly according to schema
      spot.buoy.stationId = nearest.id
      spot.buoy.stationName = nearest.name

      // save updated buoy info
      await spot.save()

      // fetch buoy data from new station
      buoyData = await fetchNDBCRss(nearest.id)
    }
  }

  // fetch unsplash image if not already set
  if (!spot.imageUrl) {
    const imageUrl = await fetchUnsplashImage(spot.name)
    if (imageUrl) {
      spot.imageUrl = imageUrl
      await spot.save()
    }
  }

  // return enriched object
  return { ...spot.toObject(), buoyData }
}

module.exports = enrichSurfSpot
