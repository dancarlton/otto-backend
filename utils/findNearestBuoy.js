const axios = require('axios');
const cheerio = require('cheerio');
const { getActiveStations } = require('./findNearbyRSSStations');
const haversineDistance = require('./geo');

const buoyCache = {};

async function buoyFeedExists(stationId) {
  if (!stationId) return false;

  if (stationId in buoyCache) return buoyCache[stationId];

  const url = `https://www.ndbc.noaa.gov/data/latest_obs/${stationId}.rss`;
  console.log(`Checking RSS feed for ${stationId}`);

  try {
    const res = await axios.head(url);
    buoyCache[stationId] = res.status === 200;
    return buoyCache[stationId];
  } catch (err) {
    console.warn(`Feed not found for ${stationId}`);
    buoyCache[stationId] = false;
    return false;
  }
}

async function getLatLonFromStationPage(stationId) {
  try {
    const url = `https://www.ndbc.noaa.gov/station_page.php?station=${stationId}`;
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);
    const text = $.text();

    const latMatch = text.match(/(\d+\.\d+)\s+N/);
    const lonMatch = text.match(/(\d+\.\d+)\s+W/);

    if (latMatch && lonMatch) {
      const lat = parseFloat(latMatch[1]);
      const lon = -parseFloat(lonMatch[1]);
      return { lat, lon };
    }

    return null;
  } catch (err) {
    console.warn(`Could not scrape lat/lon for station ${stationId}`);
    return null;
  }
}

async function findNearestBuoy(lat, lng, allowFallback = true) {
  const stations = getActiveStations();

  let nearest = null;
  let minDistance = Infinity;

  for (const station of stations) {
    if (!station.stationId || !station.lat || !station.lng) continue;

    const distance = haversineDistance(lat, lng, station.lat, station.lng);
    if (distance > 100) continue;

    const hasFeed = await buoyFeedExists(station.stationId);
    if (hasFeed && distance < minDistance) {
      minDistance = distance;
      nearest = station;
    }
  }

  if (!nearest && allowFallback) {
    console.warn(`⚠️ No valid RSS buoy near (${lat}, ${lng}). Skipping fallback logic here.`);
  }

  return nearest;
}

module.exports = findNearestBuoy;
