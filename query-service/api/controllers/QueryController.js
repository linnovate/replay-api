/**
 * QueryController
 *
 * @description :: Server-side logic for managing queries
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Promise = require('bluebird'),
	Query = require('replay-schemas/Query');

// trick sails to activate resful API to this controller
sails.models.query = {};

module.exports = {
	find: function(req, res, next) {
		validateRequest(req)
			.then(QueryService.getQueries)
			.then(function(results) {
				return res.json(results);
			})
			.catch(function(err) {
				return res.serverError(err);
			});
	}
};

function validateRequest(req) {
	return new Promise(function(resolve, reject) {
		// right now we have nothing to validate
		resolve(req);
	});
}
