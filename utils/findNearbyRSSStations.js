const axios = require('axios')
const cheerio = require('cheerio')

// fetch stations near lat/lon from NOAA RSS
async function fetchNearbyRSSStations(lat, lon, radius = 100) {
  try {
    const url = `https://www.ndbc.noaa.gov/rss/ndbc_obs_search.php?lat=${lat}&lon=${lon}&radius=${radius}`
    const response = await axios.get(url)
    const $ = cheerio.load(response.data)
    const stations = []

    $('item').each((_, el) => {
      const title = $(el).find('title').text()
      const description = $(el).find('description').text()
      const match = title.match(/Station (\w+)/)
      const stationId = match ? match[1] : null
      const hasWaveData = /wave height|dominant wave period/i.test(description)

      if (stationId) {
        stations.push({
          stationId,
          name: title,
          hasWaveData,
          rawText: description,
        })
      }
    })

    return stations
  } catch (err) {
    console.error('Failed to fetch nearby RSS stations:', err)
    return []
  }
}

// load stations on server startup
async function loadActiveStations() {
  const defaultLat = 34.4
  const defaultLon = -119.6
  const stations = await fetchNearbyRSSStations(defaultLat, defaultLon)
  console.log(`✅ Loaded ${stations.length} nearby stations`)
  global.cachedStations = stations
  return stations
}

// return cached stations
function getActiveStations() {
  return (global.cachedStations || []).filter(
    s => s.stationId && s.lat && s.lng && s.hasWaveData
  )
}

module.exports = {
  fetchNearbyRSSStations,
  loadActiveStations,
  getActiveStations,
}
