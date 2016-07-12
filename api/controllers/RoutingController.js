/**
 * RoutingController
 *
 * @description :: Server-side logic for managing routings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	route: function(req, res, next){
		console.log('New request: ', req);
		res.ok();
	}
};

