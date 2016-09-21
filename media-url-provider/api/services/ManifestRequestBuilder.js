const MANIFEST_SUFFIX = '/manifest.mpd';
var Promise = require('bluebird'),
	Video = require('replay-schemas/Video'),
	VideoCompartment = require('replay-schemas/VideoCompartment');

function ManifestRequestBuilder() {
	var self = this;
	self.server = sails.config.settings.services.wowza.server;
	self.port = sails.config.settings.services.wowza.port;
	self.instance = sails.config.settings.services.wowza.instance;
	self.contentInstance = sails.config.settings.services.wowza.content_instance;
	self.buildManifestRequest = function(id) {
		return getVideoAndTimeCompassByCompartmentId(id)
			.then(function(manifestParams) {
				var requestUrl = self.server + ':' +
					self.port + '/' +
					self.instance + '/' +
					self.contentInstance + '/' +
					manifestParams.contentDirectoryPath + '/' +
					manifestParams.requestFormat + ':' +
					manifestParams.baseName + '.' +
					manifestParams.requestFormat +
					MANIFEST_SUFFIX + '?wowzaplaystart=' +
					manifestParams.wowzaplaystart + '&wowzaplayduration=' +
					manifestParams.wowzaplayduration;
				console.log(requestUrl);
				return requestUrl;
			});
	};
}

function getVideoAndTimeCompassByCompartmentId(id) {
	var manifestParams = {};
	return getVideoCompartment(id)
		.then(function(videoCompartment) {
			manifestParams.wowzaplaystart = videoCompartment.startAsset;
			manifestParams.wowzaplayduration = videoCompartment.duration;
			return Promise.resolve(videoCompartment.videoId);
		})
		.then(getVideo)
		.then(function(video) {
			manifestParams.contentDirectoryPath = video.contentDirectoryPath;
			manifestParams.requestFormat = video.requestFormat;
			manifestParams.baseName = video.baseName;
			return Promise.resolve(manifestParams);
		})
		.catch(function(err) {
			return Promise.reject(err);
		});
}

function getVideoCompartment(id) {
	return VideoCompartment
		.findOne({ _id: id })
		.then(function(videoCompartment) {
			if (!videoCompartment) {
				return Promise.reject('Video compartment does not exist');
			}
			return Promise.resolve(videoCompartment);
		})
		.catch(function(err) {
			return Promise.reject(err);
		});
}

function getVideo(id) {
	return Video
		.findOne({ _id: id })
		.then(function(video) {
			if (!video) {
				return Promise.reject('Video does not exist');
			}
			return Promise.resolve(video);
		})
		.catch(function(err) {
			return Promise.reject(err);
		});
}

module.exports = new ManifestRequestBuilder();
