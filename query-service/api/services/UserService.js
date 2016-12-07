var User = require('replay-schemas/User');

module.exports.findUserById = function(id) {
	return User.findById(id);
};