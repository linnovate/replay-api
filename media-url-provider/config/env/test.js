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

module.exports = {

	/***************************************************************************
	 * Set the default database connection for models in the development       *
	 * environment (see config/connections.js and config/models.js )           *
	 ***************************************************************************/

	// models: {
	//   connection: 'someMongodbServer'
	// }
	port: 1339,
	settings: {
		services: {
			wowza: {
				server: 'localhost',
				port: '1935',
				instance: 'test',
				content_instance: 'test'
			},
			compartment: {
				host: 'localhost',
				port: 5165
			}
		}
	},
	mongo: {
		host: process.env.MONGO_HOST || '127.0.0.1',
		port: process.env.MONGO_PORT || 27017,
		database: 'replay_test_media_url_provider'
	}
};
