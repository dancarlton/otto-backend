const OpenAI = require('openai')
const User = require('../models/Users')

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

exports.askOtto = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    const preferences = user.preferences
    const userMessage = req.body.message

    const prompt = `
        You are Otto, a surf forecast assistant.
        User preferences:
        - Wave Height: ${preferences.waveHeight}
        - Gear: ${JSON.stringify(preferences.gear)}
        - Skill Level: ${preferences.shredderLevel}

        User asks: "${userMessage}"

        Respond in natural language, and include a JSON block like:

        <JSON>
        {
        "recommendations": [
            {
            "spot": "Trestles",
            "bestTime": "6 AM",
            "conditions": "3-5 ft, offshore",
            "gear": "Shortboard"
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
    console.error(err)
    res.status(500).json({ message: 'Otto wiped out.' })
  }
}
