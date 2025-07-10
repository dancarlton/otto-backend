// this file loads and caches all active buoy stations from ndbc’s activestations.xml
// we parse the xml once and store the stations in memory for quick lookup

const axios = require('axios')
const xml2js = require('xml2js')

let activeStations = []

// fetch and parse the xml list of active stations from ndbc
async function loadActiveStations() {
  const url = 'https://www.ndbc.noaa.gov/activestations.xml'
  const response = await axios.get(url)
  const result = await xml2js.parseStringPromise(response.data)
  const stations = result?.stations?.station || []

  // convert each station entry into a simplified object
  activeStations = stations.map(station => ({
    id: station.$.id,
    lat: parseFloat(station.$.lat),
    lng: parseFloat(station.$.lng),
    name: station.$.name || '',
  }))

  return activeStations
}

// return the cached station list
function getActiveStations() {
  return activeStations
}

module.exports = { loadActiveStations, getActiveStations }
