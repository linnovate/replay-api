/**
 * VideoController
 *
 * @description :: Server-side logic for managing videos
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find: function(req, res, next){
		Video.find({}, function(err, videos){
			if(err) next(err);

			res.ok(videos);
		});
	},

	findOne: function(req, res, next){
		Video.findOne({id: req.params.id}, function(err, video){
			if(err) next(err);

			res.ok(video);
		})
	},

	create: function(req, res, next){
		var entryId = req.params.entryId; //'1_2up3em8s'
		var path = req.params.path //'some/path/in/storage'

		if(!entryId || !path){
			return res.badRequest('entryId or path is empty');
		}


		KalturaService.getVideo(entryId)
		.then(function(video){
			console.log('Got video from kaltura: ', video);

			Video.create({
			  	provider: 'kaltura',
			  	providerId: entryId,
			  	relativePath: path,
			  	name: video.name,
			  	providerData: video
			  	
			  }, function(err, obj){
			  	if(err) return next(err);

			  	console.log("Successfuly created a video...");
			  	res.ok(obj.id);
			  });
		})
		.catch(function(err){
			if(err) console.log(err);

			res.serverError("Failed creating the video");
		});
	}
};

