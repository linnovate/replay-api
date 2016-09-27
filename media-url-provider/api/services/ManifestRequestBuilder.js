const MANIFEST_SUFFIX = '/manifest.mpd';
var Promise = require('bluebird'),
	Video = require('replay-schemas/Video'),
	VideoCompartment = require('replay-schemas/VideoCompartment');
var VideoCompartmentSchema = VideoCompartment.VideoCompartment,
	generateCompartmentCondition = VideoCompartment.generateCompartmentCondition;

function ManifestRequestBuilder() {
	var self = this;
	self.buildManifestRequest = function(id, user) {
		return buildManifestRequest(id, user);
	};

	function buildManifestRequest(id, user) {
		self.server = sails.config.settings.services.wowza.server;
		self.port = sails.config.settings.services.wowza.port;
		self.instance = sails.config.settings.services.wowza.instance;
		self.contentInstance = sails.config.settings.services.wowza.content_instance;
		return buildCompartmentQuery(id, user)
			.then(getVideoAndTimeCompassParamsByCompartmentQuery)
			.then(assembleUrlRequest)
			.catch(function(err) {
				return Promise.reject(err);
			});
	}

	function assembleUrlRequest(manifestParams) {
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

function buildCompartmentQuery(id, user) {
	var query = {
		$and: [
			{ _id: id }
		]
	};
	return generateCompartmentCondition(user)
		.then(function(compartmentQuery) {
			if (!compartmentQuery) {
				return Promise.reject('empty compartment query');
			}
			query.$and.push(compartmentQuery);
			return Promise.resolve(query);
		});
}

function getVideoAndTimeCompassParamsByCompartmentQuery(query) {
	var manifestParams = {};
	return getVideoCompartment(query)
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
		});
}

function getVideoCompartment(query) {
	return new Promise(function(resolve, reject) {
		return VideoCompartmentSchema
			.findOne(query, function(err, videoCompartment) {
				if (err || !videoCompartment) {
					reject('Video compartment does not exist');
				}
				resolve(videoCompartment);
			});
	});
}

function getVideo(id) {
	return new Promise(function(resolve, reject) {
		return Video
			.findOne({ _id: id })
			.then(function(video) {
				if (!video) {
					reject('Video does not exist');
				}
				resolve(video);
			})
			.catch(function(err) {
				throw err;
			});
	});
}

module.exports = new ManifestRequestBuilder();
