const SurfSpots = require('../models/SurfSpots');
const enrichSurfSpot = require('../utils/enrichSurfSpots');

// GET all surf spots
exports.getAllSpots = async (req, res) => {
  const spots = await SurfSpots.find({});
  res.json(spots);
};

// GET surf spots by id
exports.getSpotById = async (req, res) => {
  const spots = await SurfSpots.findById(req.params.id);
  res.json(spots);
};

// GET surf spot by name
exports.getSpotByName = async (req, res) => {
  const spots = await SurfSpots.findOne({ id: req.params.name });
  res.json(spots);
};

// GET surf spots enriched with updated buoy data
exports.getEnrichedSurfSpots = async (req, res, next) => {
  try {
    const spots = await SurfSpots.find({});
    const enrichedSpots = [];

    let updatedBuoyCount = 0;
    let updatedImageCount = 0;

    for (const spot of spots) {
      const originalStationId = spot.buoy?.stationId;
      const originalImageUrl = spot.imageUrl;

      const enrichedSpot = await enrichSurfSpot(spot);
      enrichedSpots.push(enrichedSpot);

      if (!originalStationId && enrichedSpot.buoy?.stationId) {
        updatedBuoyCount++;
      }

      if (!originalImageUrl && enrichedSpot.imageUrl) {
        updatedImageCount++;
      }
    }

    console.log(`[summary] ${updatedBuoyCount} new stationIds set`);
    console.log(`[summary] ${updatedImageCount} new images set`);

    res.json({ spots: enrichedSpots });
  } catch (err) {
    console.error('Error in getEnrichedSurfSpots:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
