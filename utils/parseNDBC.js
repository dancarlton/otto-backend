const axios = require('axios')
const cheerio = require('cheerio')

function extractValue($, label) {
  const strongs = $('strong')
  for (let i = 0; i < strongs.length; i++) {
    const el = $(strongs[i])
    if (el.text().includes(label)) {
      return el[0].nextSibling?.nodeValue?.trim()
    }
  }
  return null
}

async function fetchNDBCRss(stationId) {
  try {
    const url = `https://www.ndbc.noaa.gov/data/latest_obs/${stationId}.rss`

    const response = await axios.get(url)

    const $ = cheerio.load(response.data, { xmlMode: true })

    // get the <description> field inside the first <item> element
    const descriptionHTML = $('item > description').first().text()

    const $desc = cheerio.load(descriptionHTML)

    const data = {
      waveHeight: extractValue($desc, 'Significant Wave Height'),
      dominantPeriod: extractValue($desc, 'Dominant Wave Period'),
      avgPeriod: extractValue($desc, 'Average Period'),
      direction: extractValue($desc, 'Mean Wave Direction'),
      waterTemp: extractValue($desc, 'Water Temperature'),
    }

    return data
  } catch (err) {
    if (err.response?.status === 404) {
      console.warn(`RSS feed not found for station ${stationId}`)
      return null
    }
  }
}

module.exports = fetchNDBCRss
