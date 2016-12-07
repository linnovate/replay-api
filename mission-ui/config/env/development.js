module.exports = {
	port: process.env.PORT || 1550,
	mongo: {
		host: process.env.MONGO_HOST || 'localhost',
		port: process.env.MONGO_PORT || 27017,
		database: process.env.MONGO_DATABASE || 'replay_dev',
		username: process.env.MONGO_USERNAME,
		password: process.env.MONGO_PASSWORD
	}
};
