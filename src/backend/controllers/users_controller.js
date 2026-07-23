const SpotifyDataService = require("../services/spotify_data_service");

async function getTopArtists(req, res, next) {
    try {
        const result = await SpotifyDataService.getTopArtists(req.userId);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
}

async function getTopTracks(req, res, next) {
    try {
        const result = await SpotifyDataService.getTopTracks(req.userId);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getTopArtists,
    getTopTracks
};
