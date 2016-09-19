/**
 * SwaggerController
 *
 * @description :: Server-side logic for managing swaggers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	ui: function(req, res, next) {
        // sails combined module serves the combined swagger /docs from all microservices in a dedidcated internal port,
        // thats why we have to assemble another URL and pass it to swagger UI
        var swaggerDocsUrl = sails.config.host + ':' + sails.config.swaggerCombined.port + '/docs';
        return res.view('swagger', { docsUrl: swaggerDocsUrl });
    }
};

