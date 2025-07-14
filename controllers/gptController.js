const OpenAI = require('openai');
const axios = require('axios');
const User = require('../models/Users');
const SurfSpot = require('../models/SurfSpots');
const enrichSurfSpot = require('../utils/enrichSurfSpots');
const haversineDistance = require('../utils/geo');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 🔍 Geocode city/region from message
async function geocodeLocation(locationName) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    locationName,
  )}&format=json&limit=1`;
  const res = await axios.get(url, {
    headers: { 'User-Agent': 'Otto AI Bot' },
  });
  if (!res.data.length) return null;
  return {
    lat: parseFloat(res.data[0].lat),
    lng: parseFloat(res.data[0].lon),
  };
}

// 🧠 Extract location from message using GPT
async function extractLocationFromMessage(message) {
  const extractPrompt = `Extract the main California beach city or region from this user message: "${message}".`
    + 'Respond with just the location name, or "none".';

  const result = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: extractPrompt }],
  });

  const response = result.choices[0].message.content.trim();
  return response.toLowerCase() === 'none' ? null : response;
}

// 📍 Find nearest surf spot from lat/lng
async function findNearestSurfSpot(lat, lng) {
  const allSpots = await SurfSpot.find({
    'location.lat': { $exists: true },
    'location.lng': { $exists: true },
  });
  let closest = null;
  let minDist = Infinity;

  for (const spot of allSpots) {
    const d = haversineDistance(lat, lng, spot.location.lat, spot.location.lng);
    if (d < minDist) {
      minDist = d;
      closest = spot;
    }
  }

  return closest;
}

// 🔥 Main GPT controller
exports.askOtto = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw new NotFoundError('User not found');

    const userMessage = req.body.message;
    if (!userMessage) throw new BadRequestError('Message is required');

    const preferences = user.preferences || {};
    const gearList = Array.isArray(preferences.gear?.boards)
      ? preferences.gear.boards.join(', ')
      : 'unknown';

    const locationName = await extractLocationFromMessage(userMessage);
    if (!locationName) {
      return res.json({
        reply:
          'I couldn’t figure out which beach you meant. Try with a spot or city name like "Malibu" or "Trestles".',
        forecast: [],
      });
    }

    const coords = await geocodeLocation(locationName);
    if (!coords) throw new Error('Geocoding failed');

    const nearestSpot = await findNearestSurfSpot(coords.lat, coords.lng);
    if (!nearestSpot) throw new Error('No surf spot nearby');

    const enrichedSpot = await enrichSurfSpot(nearestSpot);

    const buoy = enrichedSpot.buoyData || {};
    const prompt = `
You are Otto, a surf forecasting assistant for Southern California surfers.
Your goal is to suggest local breaks based on real data and match the user’s preferences.

If buoy data is missing or limited, you may guess based on general knowledge of the spot.

User preferences:
- Wave Height: ${preferences.waveHeight || 'any'}
- Gear: ${gearList}
- Skill Level: ${preferences.shredderLevel || 'any'}

Forecasted spot: ${enrichedSpot.name}
Location: near ${locationName}
Conditions:
- Wave Height: ${buoy.waveHeight || 'unknown'}
- Period: ${buoy.dominantPeriod || 'unknown'}
- Direction: ${buoy.direction || 'unknown'}
- Water Temp: ${buoy.waterTemp || 'unknown'}

User said: "${userMessage}"

Respond in a friendly, short tone as if you're texting a buddy who's heading out. Then include this JSON:

<JSON>
{
  "recommendations": [
    {
      "spot": "${enrichedSpot.name}",
      "bestTime": "6 AM",
      "conditions": "${buoy.waveHeight || 'unknown'} ft, ${
  buoy.direction || 'unknown'
}",
      "gear": "${gearList}"
    }
  ]
}
</JSON>
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const rawReply = completion.choices[0].message.content;
    const jsonMatch = rawReply.match(/<JSON>([\s\S]*?)<\/JSON>/);
    let forecast = [];

    if (jsonMatch) {
      try {
        forecast = JSON.parse(jsonMatch[1].trim()).recommendations;
      } catch (e) {
        console.warn('Could not parse GPT JSON:', e);
      }
    }

    const reply = rawReply.replace(/<JSON>[\s\S]*?<\/JSON>/, '').trim();

    res.json({ reply, forecast });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
