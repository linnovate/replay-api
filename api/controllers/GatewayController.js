/**
 * RoutingController
 *
 * @description :: Server-side logic for managing routings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 // request param as set in route.js config
const REQUEST_METHOD = 'method';
const request = require('request');

module.exports = {
	gate: function(req, res, next) {
		var baseUrl;
		var method = req.param(REQUEST_METHOD);
		var params = req.originalUrl.substring(req.originalUrl.indexOf(method));
		var serviceConf = sails.config.settings.services[method];
		if (serviceConf !== undefined) {
			baseUrl = serviceConf.url + ':' + serviceConf.port;
		} else {
			return res.badRequest('unknown service');
		}
    request(baseUrl + '/' + params, function (error, response, body) {
      if (error) res.status(500, error);
      res.ok(body);
    });
  }
};
