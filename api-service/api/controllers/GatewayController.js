/**
 * RoutingController
 *
 * @description :: Server-side logic for managing routings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
// request param as set in route.js config

const request = require('request');

module.exports = {
    gate: function(req, res, next) {
        console.log('Routing incoming request...');
        var baseUrl;
        var service = req.param('service');
        var params = req.originalUrl.substring(req.originalUrl.indexOf(service));
        var serviceConf = sails.config.settings.services[service];
        if (serviceConf !== undefined) {
            baseUrl = serviceConf.url + ':' + serviceConf.port;
        } else {
            return res.notFound();
        }

        request({
            method: req.method,
            url: baseUrl + '/' + params,
            json:true,
            body: req.body
        }, function(err, response, body) {
            if (err) {
                return next(err);
            }
            res.ok(body);
        });

    }
};
