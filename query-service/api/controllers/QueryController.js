/**
 * QueryController
 *
 * @description :: Server-side logic for managing queries
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Promise = require('bluebird'),
	Query = require('replay-schemas/Query');

module.exports = {
	find: function(req, res, next) {
		validateRequest(req)
			.then(() => QueryService.getQueries(req.userId, req.query))
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
		// check that if limit present, then it's a positive integer
		if(req.query.limit && (!parseInt(req.query.limit) || parseInt(req.query.limit) <= 0)) {
			return reject(new Error('Parameter limit is not a positive integer'));
		}
		resolve(req);
	});
}
