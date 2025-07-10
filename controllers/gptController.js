const OpenAI = require('openai')
const User = require('../models/Users')
const SurfSpots = require('../models/SurfSpots')
const Buoy = require('../models/Buoy')

const BadRequestError = require('../errors/BadRequestError')
const NotFoundError = require('../errors/NotFoundError')

const fetchNDBCRss = require('../utils/parseNDBC')
const enrichSurfSpot = require('../utils/enrichSurfSpots')

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

function extractDegrees(str) {
  const match = str.match(/\((\d+)°\)/)
  return match ? parseInt(match[1], 10) : null
}

exports.askOtto = async (req, res, next) => {
  try {
    // 1. find user by ID from JWT payload
    const user = await User.findById(req.user.id)
    if (!user) {
      throw new NotFoundError('User not found')
    }

    // 2. get the user’s message from the request
    const userMessage = req.body.message
    if (!userMessage) {
      throw new BadRequestError('Message is required')
    }

    // 3. load all surf spots from the database
    const allSpots = await SurfSpots.find()

    // 4. try to find a spot mentioned in the user’s message
    let spot = allSpots.find(
      s => s.name && userMessage.toLowerCase().includes(s.name.toLowerCase())
    )

    let buoyData = null

    // 5. if a spot is mentioned
    if (spot) {
      // Auto-fix buoy if missing or invalid
      if (!spot.buoy || !spot.buoy.stationId) {
        console.warn(`⚠️ Spot "${spot.name}" has no buoy — enriching...`)
        spot = await enrichSurfSpot(spot)
      }

      // Fetch live buoy data
      if (spot.buoy && spot.buoy.stationId) {
        buoyData = await fetchNDBCRss(spot.buoy.stationId)

        // Save live buoy data to DB if found
        if (buoyData) {
          const buoy = await Buoy.findOne({ stationId: spot.buoy.stationId })
          if (buoy) {
            buoy.latestData = {
              waveHeight: parseFloat(buoyData.waveHeight),
              dominantPeriod: parseFloat(buoyData.dominantPeriod),
              swellDirection: extractDegrees(buoyData.direction),
              waterTemp: parseFloat(buoyData.waterTemp),
            }
            buoy.lastUpdated = new Date()
            await buoy.save()
          }
        }
      }
    }

    // 6. get user preferences
    const preferences = user.preferences || {}
    const gear = preferences.gear || {}
    const gearList = Array.isArray(gear.boards)
      ? gear.boards.join(', ')
      : 'unknown'

    // 7. prompt GPT using user preferences + message
    const prompt = `
      You are Otto, a surf forecasting assistant.

      User preferences:
      - Wave: ${preferences.waveHeight?.join(', ') || 'N/A'}
      - Gear: ${gearList}
      - Skill: ${preferences.shredderLevel || 'N/A'}
      - Travel Distance: ${preferences.travelDistance || 'N/A'}

      ${
        spot && spot.buoy
          ? `Current conditions at ${spot.name} (${spot.buoy.stationName || 'Unknown Buoy'}):
      - Wave Height: ${buoyData?.waveHeight || 'N/A'}
      - Dominant Period: ${buoyData?.dominantPeriod || 'N/A'}
      - Direction: ${buoyData?.direction || 'N/A'}
      - Water Temp: ${buoyData?.waterTemp || 'N/A'}`
          : ''
      }

      User said: "${userMessage}"

      Instructions:
      - If the user mentions a known surf spot, use it directly.
      - Only suggest a nearby spot if no known surf spot match is found.
      - Based on water temp, recommend a wetsuit (e.g. spring, full, none).
      - Suggest best board to use based on wave size and skill.
      - Recommend best time to surf today (consider tides and wind).
      - Keep the response short and friendly.
      - Then return JSON with the following keys:

      <JSON>
      {
        "recommendations": [
          {
            "spot": "Cardiff Reef",
            "bestTime": "7 AM",
            "conditions": "3-4 ft, offshore",
            "gear": "Fish",
            "wetsuit": "Spring suit"
          }
        ]
      }
      </JSON>
    `

    // 8. send prompt to GPT and get a response
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    })

    // 9. parse GPT's response
    const rawReply = completion.choices[0].message.content
    console.log('GPT raw reply:', rawReply)

    // 10. extract JSON block from the GPT response
    const jsonMatch = rawReply.match(/<JSON>([\s\S]*?)<\/JSON>/)
    let forecast = []
    if (jsonMatch) {
      try {
        forecast = JSON.parse(jsonMatch[1])
      } catch (err) {
        console.error('❌ JSON parsing error:', err)
      }
    } else {
      console.warn('⚠️ No JSON block found in GPT response')
    }

    // 11. remove JSON from GPT response so we can return clean message
    let reply = rawReply.replace(/<JSON>[\s\S]*<\/JSON>/, '').trim()

    // 12. fallback if reply is missing or unusable
    if (!reply || forecast.length === 0) {
      reply =
        "Otto went surfing and couldn't give a forecast. Try again later! 🏄‍♂️🌊"
      forecast = []
    }

    // 13. return both natural reply and parsed forecast
    res.json({ reply, forecast })
  } catch (err) {
    console.error('Error in AskOtto:', err)
    next(err)
  }
}
