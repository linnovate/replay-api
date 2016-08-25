
module.exports = {
    port: process.env.PORT || 1338,
    mongo: {
		host: process.env.MONGO_HOST || 'localhost',
		port: process.env.MONGO_PORT || 27017,
		database: process.env.MONGO_DATABASE || 'replay_test'
	}
}