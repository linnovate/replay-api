/**
 * PlaylistController
 *
 * @description :: Server-side logic for managing playlists
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find: function (req, res, next) {

	},
	create: function (req, res, next) {

	},
	update: function (req, res, next) {

	},
	destroy: function (req, res, next) {
		var playlistId = req.params.id;
		if (!validateDeleteRequest(req)) {
			return res.badRequest(new Error('Some parameters are missing.'));
		}

		validateUserOwnsPlaylist(req.userId, playlistId)
			.then(() => PlaylistService.deletePlaylist(playlistId))
			.then(() => {
				return res.ok();
			})
			.catch(err => {
				if (err) {
					console.log(err);
					next(err);
				}
			})

	}
};

function validateDeleteRequest(req) {
	if (!req.params || !req.params.id) {
		return false;
	}

	return true;
}