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
		var path = req.body.path; // 'some/path/in/storage'
		var entryId = req.body.entryId;

		if(!entryId || !path){
			return res.badRequest('path or entryId is empty');
		}

		// remove leading and trailing slashes if exist
		path = fixPath(path);
		
		// ******************************************
		// we should check what is our video CMS.
		// if it's Kaltura, then add to Kaltura
		// ******************************************


		// KalturaService.addVideo('grb_1.mpg');
		// res.ok();

		KalturaService.getVideo(entryId)
		.then(function(video){
			console.log('Got video from kaltura: ', video);

			Video.create({
			  	provider: 'kaltura',
			  	providerId: video.id,
			  	relativePath: path,
			  	name: video.name,
			  	providerData: video
			  	
			  }, function(err, obj){
			  	if(err) {
			  		console.log(err);
			  		return next(err);
			  	}

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

// we want the path to match the following structure:
// path/to/certain/file, so strip leading and trailing '/' if exist
var fixPath = function(path){
	if(path.startsWith('/'))
		path = path.substr(1);
	if(path.endsWith('/'))
		path = path.substr(0, path.length - 1)

	return path;
}

