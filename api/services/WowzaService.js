
var request = require('request'),
	Promise = require('bluebird');

module.exports = {
	getMpd: function(path){
		return new Promise(function(resolve, reject){
			// var stubUrl = 'http://178.79.165.97:1935/weplay/_definst_/kaltura_content/'+path+'/manifest.mpd';

			var wowzaUrl = sails.config.settings.services.wowza.url;
			var wowzaPort = sails.config.settings.services.wowza.port;
			var appName = sails.config.settings.services.wowza.appName;
			var dir = sails.config.settings.services.wowza.contentDirectory;

			var url = wowzaUrl + ':' + wowzaPort + '/'
					 + appName + '/_definst_/' + dir
					 + '/' + path + '/manifest.mpd';

			request.get({
				url: url
			}, function(error, response, body){
				if(error){
					return reject(new Error(error));
				}
				if(!body){
					return reject(new Error('No mpd found'));
				}
				return resolve(body);
			});
		});
	}
}