var requestAsPromise = require('request-promise');

module.exports.findPermissionsByUserId = function(userId) {
	return UserService.findUserById(userId)
		.then(user => {
			if(user) {
				return getPermissions(user.providerDetails.id);
			}

			return Promise.reject(new Error(`User with id: ${userId} was not found.`));
		});
};

function getPermissions(userProviderId) {
	var authorizationServiceUrl = sails.config.services.authorization_service.host + ':' + sails.config.services.authorization_service.port + '/compartment/permission';
	console.log('Requesting permissions from authorization-service in url:', authorizationServiceUrl);
	var options = {
		url: authorizationServiceUrl,
		json: true
	};
	return requestAsPromise(options)
		.then(permissions => {
			console.log('resp is:', permissions);
			return permissions;
		});
}