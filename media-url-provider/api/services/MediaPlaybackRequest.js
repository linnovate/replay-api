var Promise = require('bluebird'),
	Mission = require('replay-schemas/Mission'),
	VideoCompartment = require('replay-schemas/VideoCompartment'),
	AuthorizationService = require('replay-request-services/authorization');

var ManifestRequestBuiler = require('./ManifestRequestBuilder');

function MediaPlaybackRequest() {
	var self = this;

	self.missionPlayback = function(missionId, userId) {
		return AuthorizationService.findPermissionsByUserId(userId)
			.then(function(permissions) {
				return getMission(missionId, permissions);
			})
			.then(getMissionPlaylist);
	};
}

function getMission(missionId, permissions) {
	return new Promise(function(resolve, reject) {
		var query = {
			$and: [
				{ _id: missionId }
			]
		};
		return Mission.findOne(query)
			.populate({
				path: 'videoCompartments.videoId',
				model: 'Video'
			})
			.exec(function(err, mission) {
				if (err) {
					reject(err);
				}
				resolve(mission);
			});
	});
}

function getMissionPlaylist(mission) {
	return Promise.map(mission.videoCompartments, function(videoCompartment) {
		return ManifestRequestBuiler.getVideoCompartmentManifestRequest(videoCompartment);
	});
}
module.exports = new MediaPlaybackRequest();
