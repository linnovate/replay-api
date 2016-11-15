const MANIFEST_SUFFIX = '/manifest.mpd';
var Promise = require('bluebird');

function ManifestRequestBuilder() {
	var self = this;
	self.server = sails.config.settings.services.wowza.server;
	self.port = sails.config.settings.services.wowza.port;
	self.instance = sails.config.settings.services.wowza.instance;
	self.contentInstance = sails.config.settings.services.wowza.content_instance;
	self.getVideoCompartmentManifestRequest = function(videoCompartment) {
		return getVideoCompartmentManifestRequest(videoCompartment);
	};

	function getVideoCompartmentManifestRequest(videoCompartment) {
		console.log('building manifest');
		return validateVideoCompartmentObject(videoCompartment)
		.catch(function(err) {
			console.log(err);
		})
		.then(assembleUrlRequest);
	}

	function assembleUrlRequest(manifestParams) {
		console.log("assembling");
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
		return requestUrl;
	}
}

function validateVideoCompartmentObject(videoCompartment) {
	if (videoCompartment.relativeStartTime !== undefined &&
		videoCompartment.durationInSeconds !== undefined &&
		videoCompartment.videoId.contentDirectoryPath !== undefined &&
		videoCompartment.videoId.requestFormat !== undefined &&
		videoCompartment.videoId.baseName !== undefined) {
		return Promise.resolve(getManifestParams(videoCompartment));
	}
	return Promise.reject('failed validation');
}

function getManifestParams(videoCompartment) {
	var manifestParams = {
		wowzaplaystart: videoCompartment.relativeStartTime,
		wowzaplayduration: videoCompartment.durationInSeconds,
		contentDirectoryPath: videoCompartment.videoId.contentDirectoryPath,
		requestFormat: videoCompartment.videoId.requestFormat,
		baseName: videoCompartment.videoId.baseName
	};
	return manifestParams;
}

module.exports = new ManifestRequestBuilder();
