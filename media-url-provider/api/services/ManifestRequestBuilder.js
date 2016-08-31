const MANIFEST_SUFFIX = '/manifest.mpd';
var Promise = require('bluebird'),
	Video = require('replay-schemas/Video');

function ManifestRequestBuilder() {
	this.server = sails.config.settings.services.wowza.server;
	this.port = sails.config.settings.services.wowza.port;
	this.instance = sails.config.settings.services.wowza.instance;
	this.content_instance = sails.config.settings.services.wowza.content_instance;

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
				Promise.reject(err);
			});
	}

	function buildManifestRequest(id) {
		return getVideo(id).then(function(video) {
			var requestUrl = this.server + ':' +
				this.port + '/' +
				this.instance + '/' +
				this.content_instance + '/' +
				video.relativePath + '/' +
				video.format + ':' +
				video.name + '.' +
				video.format +
				MANIFEST_SUFFIX;

			return requestUrl;
		});
	}

	return {
		buildManifestRequest: buildManifestRequest
	}
}

module.exports = ManifestRequestBuilder();
