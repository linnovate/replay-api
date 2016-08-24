/**
 * GatewayController
 *
 * @description :: Server-side logic for managing gateways
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const request = require('request'),
    urlJoin = require('url-join');

module.exports = {
    gate: function(req, res, next) {
        var baseUrl;
        var service = req.param('service');
        var params = req.originalUrl.substring(req.originalUrl.indexOf(service) + service.length);

        var serviceConf = sails.config.settings.services[service];
        if (serviceConf !== undefined) {
            baseUrl = serviceConf.url + ':' + serviceConf.port;
        } else {
            return res.notFound();
        }

        console.log('Routing incoming request to %s service.\nURL params: %s.\nBody: %s.\n', service, params, req.body);
        
        var url = urlJoin(baseUrl, service, params);
               
        request({
            method: req.method,
            url: url,
            json: true,
            body: req.body
        }, function(err, response, body) {
            if (err) {
                return next(err);
            }
            res.ok(body);
        });

    }
};

