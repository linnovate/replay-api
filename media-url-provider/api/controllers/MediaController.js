/**
 * MediaController
 *
 * @description :: Server-side logic for managing media
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {
	findOne: function(req, res, next) {
		var id = req.params.id;
		ManifestRequestBuilder.buildManifestRequest(id)
			.then(function(mpd) {
				res.json({ url: mpd });
			})
			.catch(function(err) {
				if (err) {
					console.log(err);
					return res.badRequest(err);
				}
				res.serverError('There was an unexpected error retrieving mpd file.');
			});
	}
};
