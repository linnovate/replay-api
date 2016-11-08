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
				server: 'http://vod.linnovate.net',
				port: '1935',
				instance: 'weplay',
				content_instance: 'weplay'
			}
		}
	},
	mongo: {
		host: process.env.MONGO_HOST || 'localhost',
		port: process.env.MONGO_PORT || 27017,
		database: process.env.MONGO_DATABASE || 'replay_dev',
		username: process.env.MONGO_USERNAME,
		password: process.env.MONGO_PASSWORD
	}
};


