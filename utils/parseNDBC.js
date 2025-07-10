const axios = require('axios')
const cheerio = require('cheerio')

// Main function to fetch and parse NOAA buoy RSS data
async function fetchNDBCRss(stationId) {
  try {
    // Construct the RSS feed URL for the buoy station
    const url = `https://www.ndbc.noaa.gov/data/latest_obs/${stationId}.rss`

    // Fetch the RSS feed using Axios
    const response = await axios.get(url)

    // Load the XML response using cheerio in XML mode
    const $ = cheerio.load(response.data, { xmlMode: true })

    // Get the <description> field inside the first <item> element
    const descriptionHTML = $('item > description').first().text()

    // Load the HTML inside the description field for further parsing
    const $desc = cheerio.load(descriptionHTML)

    // Extract values from the parsed description HTML using helper function
    const data = {
      waveHeight: extractValue($desc, 'Significant Wave Height'),
      dominantPeriod: extractValue($desc, 'Dominant Wave Period'),
      avgPeriod: extractValue($desc, 'Average Period'),
      direction: extractValue($desc, 'Mean Wave Direction'),
      waterTemp: extractValue($desc, 'Water Temperature'),
    }

    // Return the cleaned and structured data
    return data
  } catch (err) {
    // Log and rethrow any errors
    if (err.response?.status === 404) {
      console.warn(`RSS feed not found for station ${stationId}`)
      return null // gracefully handle in controller
    }
  }
}

// Helper function to extract the value next to a <strong> label
function extractValue($, label) {
  const strongs = $('strong') // Get all <strong> tags
  for (let i = 0; i < strongs.length; i++) {
    const el = $(strongs[i])
    if (el.text().includes(label)) {
      // Return the text node that comes immediately after the <strong> tag
      return el[0].nextSibling?.nodeValue?.trim()
    }
  }
  // If label is not found, return null
  return null
}

module.exports = fetchNDBCRss
