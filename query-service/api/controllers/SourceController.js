/**
 * SourceController
 *
 * @description :: Server-side logic for managing sources
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Promise = require('bluebird'),
	StreamingSource = require('replay-schemas/StreamingSource');

module.exports = {
	find: function(req, res, next) {
		validateFindRequest(req)
			.then(StreamingSourceService.getStreamingSources)
			.then(function(results) {
				return res.json(results);
			})
			.catch(function(err) {
				return res.serverError(err);
			});
	}
};

function validateFindRequest(req) {
	return new Promise(function(resolve, reject) {
		// right now we have nothing to validate
		resolve(req);
	});
}

