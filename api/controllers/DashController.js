/**
 * DashController
 *
 * @description :: Server-side logic for managing dashes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Promise = require('bluebird');

module.exports = {
	'mpd': function(req, res, next){
		var id = req.params.id;

		getVideo(id)
		.then(getMpdFromWowza)
		.then(function(mpd){

      //res.setHeader('Content-Type', 'application/dash+xml');
			res.json({url: mpd});
		})
		.catch(function(err){
			if(err){
				console.log(err);
				return res.badRequest(err);
			}

			res.serverError('There was an unexpected error retrieving mpd file.');
		});
	}
};



function getVideo(id){
	return Video
			.findOne({id: id})
			.then(function(video){
				if(!video)
					return Promise.reject('Video does not exist');
				else
					return Promise.resolve(video)
			})
			.catch(function(err){
				Promise.reject(err);
			});
}

function getMpdFromWowza(video){
	var path = video.relativePath;
	return WowzaService.getMpd(path);
}

