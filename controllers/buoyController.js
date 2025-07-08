const findNearestBuoy = require('../utils/findNearestBuoy')
const fetchNDBCRss = require('../utils/parseNDBC')
const BadRequestError = require('../errors/BadRequestError')
const NotFoundError = require('../errors/NotFoundError')

// return closest buoy for a given lat/lng
exports.getNearestBuoy = async (req, res, next) => {
  try {
    const { lat, lng } = req.query

    if (!lat || !lng) {
      throw new BadRequestError('Latitude and longitude are required')
    }

    const buoy = await findNearestBuoy(parseFloat(lat), parseFloat(lng))

    if (!buoy) {
      throw new NotFoundError('No buoy found nearby')
    }

    res.json({ buoy })
  } catch (err) {
    next(err)
  }
}

// get latest buoy data for a station
exports.getBuoyData = async (req, res, next) => {
  try {
    const { stationId } = req.params
    const data = await fetchNDBCRss(stationId)
    res.json({ stationId, data })
  } catch (err) {
    next(err)
  }
}
