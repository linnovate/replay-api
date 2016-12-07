/**
 * PlaylistController
 *
 * @description :: Server-side logic for managing playlists
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var mongoose = require('mongoose');
_ = require('lodash'),
	Mission = require('replay-schemas/Mission');

var AuthorizationService = require('replay-request-services/authorization');

module.exports = {
	// retrieves the authenticated user's playlists
	find: function (req, res, next) {
		PlaylistService.findPlaylists(req.userId)
			.then(playlists => {
				console.log('Returning %s playlists.', playlists.length);
				return res.json(playlists);
			})
			.catch(err => {
				if (err) {
					console.log(err);
					next(err);
				}
			});
	},
	findOne: function (req, res, next) {
		if (!validateReqHasId(req)) {
			return res.badRequest(new Error('Some parameters are missing.'));
		}

		PlaylistService.findPlaylistById(req.userId, req.params.id)
			.then(playlist => {
				if (playlist) {
					console.log('Returning playlist:', JSON.stringify(playlist));
					return res.json(playlist);
				}
				return res.notFound();
			})
			.catch(err => {
				if (err) {
					console.log(err);
					next(err);
				}
			});
	},
	// creates an empty playlist with just a name and the authenticated user's id as ownerId
	create: function (req, res, next) {
		if (!validateCreateRequest(req)) {
			return res.badRequest(new Error('Some parameters are missing.'));
		}

		var name = req.body.name;
		PlaylistService.createPlaylist(req.userId, name)
			.then(playlist => {
				console.log('Playlist created successfuly.');
				return res.json(playlist);
			})
			.catch(err => {
				if (err) {
					console.log(err);
					next(err);
				}
			});
	},
	// update playlist's fields which aren't missions (only name at the moment)
	update: function (req, res, next) {
		if (!validateUpdateRequest(req)) {
			return res.badRequest(new Error('Some parameters are missing.'));
		}

		var playlistId = req.params.id;
		var newName = req.body.name;
		PlaylistService.validateUserOwnsPlaylist(req.userId, playlistId)
			.then(() => PlaylistService.updatePlaylistById(playlistId, { name: newName }))
			.then(() => {
				console.log('Playlist updated successfuly.');
				return res.ok();
			})
			.catch(err => {
				if (err) {
					console.log(err);
					next(err);
				}
			})
	},
	// add or remove a mission from playlist
	updateMission: function (req, res, next) {
		if (!validateAlterMissionRequest(req)) {
			return res.badRequest(new Error('Some parameters are missing.'));
		}

		var playlistId = req.params.id;
		var missionId = req.params.missionId;
		PlaylistService.validateUserOwnsPlaylist(req.userId, playlistId)
			.then(() => AuthorizationService.findPermissionsByUserId(req.userId))
			.then(permissions => Mission.validateMissionExists(missionId, permissions))
			.then(() => {
				if (req.method === 'PUT') {
					return PlaylistService.updatePlaylistById(playlistId, { $addToSet: { missions: missionId } });
				}
				else if (req.method === 'DELETE') {
					return PlaylistService.updatePlaylistById(playlistId, { $pull: { missions: missionId } });
				}

				return Promise.reject(new Error('Unsupported HTTP method.'));
			})
			.then(() => {
				console.log('Playlist updated missions successfuly.');
				return res.ok();
			})
			.catch(err => {
				if (err) {
					console.log(err);
					next(err);
				}
			})
	},
	// delete a user's playlist
	destroy: function (req, res, next) {
		if (!validateDeleteRequest(req)) {
			return res.badRequest(new Error('Some parameters are missing.'));
		}

		var playlistId = req.params.id;
		PlaylistService.validateUserOwnsPlaylist(req.userId, playlistId)
			.then(() => PlaylistService.deletePlaylist(playlistId))
			.then(() => {
				console.log('Playlist deleted successfuly.');
				return res.ok();
			})
			.catch(err => {
				if (err) {
					console.log(err);
					next(err);
				}
			});
	}
};

function validateCreateRequest(req) {
	if (!req.body || !req.body.name) {
		return false;
	}

	return true;
}

function validateReqHasId(req) {
	// make sure params.id is a valid ObjectId
	if (req.params.id) {
		try {
			mongoose.Types.ObjectId(req.params.id);
		} catch (e) {
			return false;
		}
	}
	else {
		return false;
	}

	return true;
}

function validateUpdateRequest(req) {
	if (!validateReqHasId(req)) {
		return false;
	}

	if (!req.body) {
		return false;
	}

	// allow to update name only
	if (Object.keys(req.body).length !== 1 || !req.body.name) {
		return false;
	}

	return true;
}

function validateAlterMissionRequest(req) {
	if (!validateReqHasId(req)) {
		return false;
	}

	// make sure missionId is a valid ObjectId
	if (req.params.missionId) {
		try {
			mongoose.Types.ObjectId(req.params.missionId);
		} catch (e) {
			return false;
		}
	}
	else {
		return false;
	}

	return true;
}

function validateDeleteRequest(req) {
	if (!req.params) {
		return false;
	}

	if (req.params.id) {
		try {
			mongoose.Types.ObjectId(req.params.id);
		} catch (e) {
			return false;
		}
	}
	else {
		return false;
	}

	return true;
}
