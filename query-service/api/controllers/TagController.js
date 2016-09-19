/**
 * TagController
 *
 * @description :: Server-side logic for managing tags
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Promise = require('bluebird'),
	Tag = require('replay-schemas/Tag');

module.exports = {
	find: function(req, res, next) {
		validateFindRequest(req)
			.then(TagService.getTags)
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

