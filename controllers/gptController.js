const OpenAI = require('openai')
const User = require('../models/Users')
const BadRequestError = require('../errors/BadRequestError')
const NotFoundError = require('../errors/NotFoundError')

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

exports.askOtto = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      throw new NotFoundError('User not found')
    }

    const userMessage = req.body.message
    if (!userMessage) {
      throw new BadRequestError('Message is required')
    }

    const preferences = user.preferences || {}

    const gear = preferences.gear || {}
    const gearList = Array.isArray(gear.boards)
      ? gear.boards.join(', ')
      : 'unknown'

    const prompt = `
      You are Otto, a surf forecasting assistant.

      User preferences:
      - Wave: ${preferences.waveHeight?.join(', ') || 'N/A'}
      - Gear: ${gearList}
      - Skill: ${preferences.shredderLevel || 'N/A'}
      - Travel Distance: ${preferences.travelDistance || 'N/A'}

      User said: "${userMessage}"

      Instructions:
      - If the user mentions a location (e.g. San Diego), suggest a known nearby California surf spot (e.g. Blacks, Cardiff, La Jolla).
      - Match wave height, wind, tide, and skill level.
      - Respond briefly, then return JSON:

      <JSON>
      {
        "recommendations": [
          {
            "spot": "Cardiff Reef",
            "bestTime": "7 AM",
            "conditions": "3-4 ft, offshore",
            "gear": "Fish"
          }
        ]
      }
      </JSON>
    `

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    })

    const rawReply = completion.choices[0].message.content
    console.log('GPT raw reply:', rawReply)

    const jsonMatch = rawReply.match(/<JSON>([\s\S]*?)<\/JSON>/)
    let forecast = []
    if (jsonMatch) {
      try {
        forecast = JSON.parse(jsonMatch[1])
      } catch (err) {
        console.error('JSON parsing error:', err)
      }
    }

    const reply = rawReply.replace(/<JSON>[\s\S]*<\/JSON>/, '').trim()

    res.json({ reply, forecast })
  } catch (err) {
    next(err)
  }
}
