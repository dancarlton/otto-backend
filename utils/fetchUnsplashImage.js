// utils/fetchUnsplashImage.js
const axios = require('axios');

async function fetchUnsplashImage(spotName) {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  const url = 'https://api.unsplash.com/search/photos';
  const params = {
    query: `${spotName} surf beach`,
    orientation: 'landscape',
    per_page: 1,
    client_id: accessKey,
  };

  try {
    const response = await axios.get(url, { params });
    const result = response.data.results?.[0];
    return result?.urls?.regular || null;
  } catch (err) {
    console.error(`Failed to fetch Unsplash image for ${spotName}:`, err.message);
    return null;
  }
}

module.exports = fetchUnsplashImage;
