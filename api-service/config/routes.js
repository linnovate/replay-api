/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

var blueprints = require('./blueprints').blueprints;

module.exports.routes = addPrefixes({

	/***************************************************************************
	 *                                                                          *
	 * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
	 * etc. depending on your default view engine) your home page.              *
	 *                                                                          *
	 * (Alternatively, remove this and add an `index.html` file in your         *
	 * `assets` directory)                                                      *
	 *                                                                          *
	 ***************************************************************************/

	'/auth/google': {
		controller: 'auth',
		action: 'googleCallback'
	},

	'<restPrefix>/:service?*': {
		controller: 'GatewayController',
		action: 'gate'
	},
	'get /login': 'SamlController.login',
	'post /login/callback': 'SamlController.redirect',
	'/logout': 'SamlController.logout',
	
	'post /user': 'SamlController.signup',

	'post /adfs/postResponse': 'SamlController.redirect',

	'get /': 'SamlController.ensureAuthenticated'


	/***************************************************************************
	 *                                                                          *
	 * Custom routes here...                                                    *
	 *                                                                          *
	 * If a request to a URL doesn't match any of the custom routes above, it   *
	 * is matched against Sails route blueprints. See `config/blueprints.js`    *
	 * for configuration options and examples.                                  *
	 *                                                                          *
	 ***************************************************************************/

});

// manually add prefixes to custom defined routes starts with <restPrefix>,
// as sails does so only for the routes defined via blueprints
function addPrefixes(prefixes) {
	var result = {};

	for (var prefix in prefixes) {
		// append rest prefix
		if (prefix.indexOf('<restPrefix>') > -1) {
			result[prefix.replace('<restPrefix>', blueprints.restPrefix)] = prefixes[prefix];
		}
		// append internal prefix
		else if (prefix.indexOf('<internalPrefix>') > -1) {
			result[prefix.replace('<internalPrefix>', blueprints.restPrefix + blueprints.internalPrefix)] = prefixes[prefix];
		}
		// do not append prefix
		else {
			result[prefix] = prefixes[prefix];
		}
	}

	return result;
}
