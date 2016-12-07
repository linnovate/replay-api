var User = require('replay-schemas/User');

module.exports.getUserById = function (id) {
	return User.findOne({ _id: id })
		.then(user => {
			if (user) {
				console.log('Found user:', JSON.stringify(user));
				return Promise.resolve(user);
			}

			return Promise.reject(new Error(`User with id: ${id} was not found.`));
		});
}