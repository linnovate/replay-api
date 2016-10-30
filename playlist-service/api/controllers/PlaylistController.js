/**
 * PlaylistController
 *
 * @description :: Server-side logic for managing playlists
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find: function (req, res, next) {
		PlaylistService.findPlaylists()
	},
	create: function (req, res, next) {
		if(!validateCreateRequest(req)) {
			return res.badRequest(new Error('Some parameters are missing.'));
		}

		var name = req.body.name;
		PlaylistService.createPlaylist(req.userId, name)
			.then(playlist => {
				console.log('Playlist created successfuly.');
				return res.json(playlist);
			})
			.catch(err => {
				if(err) {
					console.log(err);
					next(err);
				}
			})
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

function validateCreateRequest(req) {
	if (!req.body || !req.body.name) {
		return false;
	}

	return true;
}

function validateDeleteRequest(req) {
	if (!req.params || !req.params.id) {
		return false;
	}

	return true;
}