/**
 * MediaController
 *
 * @description :: Server-side logic for managing media
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {
	findOne: function(req, res, next) {
		var missionId = req.query.missionId;
		var userId = req.query.userId;
		MediaPlaybackRequest.missionPlayback(missionId, userId)
			.then(function(playlist) {
				console.log(playlist);
				res.json(playlist);
			})
			.catch(function(err) {
				if (err) {
					console.log(err);
					return res.badRequest(err);
				}
				res.serverError('There was an unexpected error retrieving mpd file.');
			});
	}
};
