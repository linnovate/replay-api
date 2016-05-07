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
      res.setHeader('Content-Type', 'application/dash+xml');
			res.ok(mpd);
		})
		.catch(function(err){
			if(err){
				console.log(err);
				return res.badRequest(err);
			}

			res.serverError('There was an unexpected error retrieving mpd file.');
		});
	}
}



function getVideo(idRaw){
  var splitted = idRaw.split('.'),
      id;
  if (splitted.length != 2) throw new Error('video url is not correct');
  if (splitted[1] != 'mpd') throw new Error('video url is not correct');

  id = splitted[0];
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
	// var path = 'sample.mp4';
	return WowzaService.getMpd(path);
}

