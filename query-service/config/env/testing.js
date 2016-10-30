
module.exports = {
	port: process.env.PORT || 1338,
	mongo: {
		host: process.env.MONGO_HOST || 'localhost',
		port: process.env.MONGO_PORT || 27017,
		database: process.env.MONGO_DATABASE || 'replay_test'
	},
	services: {
		'authorization_service': {
			host: process.env.AUTHORIZATION_SERVICE_HOST || 'http://localhost',
			port: process.env.AUTHORIZATION_SERVICE_PORT || '1340'
		}
	}
}