/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */
var blueprints = require('.././blueprints').blueprints;
var fs = require('fs');

var port = process.env.PORT || 1337;
var baseUrl = process.env.BASE_URL || 'https://localhost';

var frontendPort = process.env.FRONTEND_PORT || 3000;
var frontendUrl = process.env.FRONTEND_URL || 'http://localhost';

module.exports = {

	/***************************************************************************
	 * Set the default database connection for models in the development       *
	 * environment (see config/connections.js and config/models.js )           *
	 ***************************************************************************/

	// models: {
	//   connection: 'someMongodbServer'
	// }

	port: port,

	settings: {
		host: baseUrl,
		baseUrl: baseUrl + ':' + port,
		apiUrl: baseUrl + ':' + port + blueprints.restPrefix,

		'token_secret': process.env.TOKEN_SECRET || 'gbrejhgkjrehogi54yu89u9nk8',
		'google_secret': process.env.GOOGLE_SECRET || 'R83YWn4E5mObpeN7Fn6AKYPY',

		frontendUrl: frontendUrl + ':' + frontendPort, 
		passport: {
			adfsSaml: {
				entryPoint: 'https://replaysts.westeurope.cloudapp.azure.com/adfs/ls/',
				issuer: 'https://dev.replay.linnovate.net'
			}
		}
	},
	mongo: {
		host: process.env.MONGO_HOST || 'localhost',
		port: process.env.MONGO_PORT || 27017,
		database: process.env.MONGO_DATABASE || 'replay_dev'
	},
	swagger: {
		/**
		 * require() the package.json file for your Sails app.
		 */
		pkg: require('../.././package'),
		ui: {
			url: baseUrl + ':' + port + '/docs'
		}
	},

	ssl: {
		key: fs.readFileSync('./key.pem'),
		cert: fs.readFileSync('./cert.pem')
	}
};
