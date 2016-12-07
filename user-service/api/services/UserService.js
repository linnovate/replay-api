var User = require('replay-schemas/User');

module.exports.findUserById = function(id) {
	console.log('Finding user by id:', id);
	return User.findById(id).populate('favorites');
}

module.exports.updateUserById = function(id, updateParams) {
	console.log('Updating user of id: %s with params: %s', id, JSON.stringify(updateParams));
	return User.findOneAndUpdate({ _id: id }, updateParams);
}