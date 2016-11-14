
module.exports = {
	port: process.env.PORT || 1342,
	mongo: {
		host: process.env.MONGO_HOST || 'localhost',
		port: process.env.MONGO_PORT || 27017,
		database: 'replay_test_user_service'
	}
}