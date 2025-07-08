const SurfSpots = require( '../models/SurfSpots' )

// GET all surf spots
exports.getAllSpots = async (req, res) => {
    const spots = await SurfSpots.find({})
    res.json(spots)
}

// GET surf spots by id
exports.getSpotById = async (req, res) => {
    const spots = await SurfSpots.findById(req.params.id)
    res.json(spots)
}

// GET surf spot by name
exports.getSpotByName = async (req, res) => {
    const spots = await SurfSpots.findOne({ id: req.params.name})
    res.json(spots)
}
