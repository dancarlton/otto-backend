const findNearestBuoy = require('../utils/findNearestBuoy')
const BadRequestError = require('../errors/BadRequestError')
const NotFoundError = require('../errors/NotFoundError')

// return closest buoy for a given lat/lng
async function getNearestBuoy(req, res, next) {
  try {
    const { lat, lng } = req.query

    if (!lat || !lng) {
      throw new BadRequestError('Latitude and longitude are required')
    }

    // find nearest buoy from surf spots
    const buoy = await findNearestBuoy(parseFloat(lat), parseFloat(lng))

    // if nothing return 404
    if (!buoy) {
      throw new NotFoundError('No buoy found nearby')
    }

    res.json({ buoy })
  } catch (err) {
    next(err)
  }
}

module.exports = { getNearestBuoy }
