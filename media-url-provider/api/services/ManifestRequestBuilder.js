const MANIFEST_SUFFIX = '/manifest.mpd';
var Promise = require('bluebird'),
	Video = require('replay-schemas/Video');

function ManifestRequestBuilder() {
	var self = this;
	self.server = sails.config.settings.services.wowza.server;
	self.port = sails.config.settings.services.wowza.port;
	self.instance = sails.config.settings.services.wowza.instance;
	self.contentInstance = sails.config.settings.services.wowza.content_instance;
	self.buildManifestRequest = function(id) {
		return getVideo(id).then(function(video) {
			var requestUrl = self.server + ':' +
				self.port + '/' +
				self.instance + '/' +
				self.contentInstance + '/' +
				video.contentDirectoryPath + '/' +
				video.requestFormat + ':' +
				video.baseName + '.' +
				video.requestFormat +
				MANIFEST_SUFFIX;

			return requestUrl;
		});
	};
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
