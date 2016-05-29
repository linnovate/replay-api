
var request = require('request'),
	Promise = require('bluebird');

module.exports = {
	getMpd: function(path){
		return new Promise(function(resolve, reject){
			var wowzaUrl = sails.config.settings.services.wowza.url;
			var wowzaPort = sails.config.settings.services.wowza.port;
			var appName = sails.config.settings.services.wowza.appName;
			var dir = sails.config.settings.services.wowza.contentDirectory;

			var url = wowzaUrl + ':' + wowzaPort + '/'
					 + appName + '/_definst_/' + dir
					 + '/' + path + '/manifest.mpd';

      		return resolve(url);
		});
	}
};
