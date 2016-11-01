var User = require('replay-schemas/User');

module.exports.findUserById = function(id) {
	console.log('Finding user by id:', id);
	return User.findById(id).populate('favorites');
}