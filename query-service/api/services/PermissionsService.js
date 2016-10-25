var requestAsPromise = require('request-promise');

module.exports.findPermissionsByUserId = function(userId) {
	console.log('Finding permission to user of id:', userId);
	return UserService.findUserById(userId)
		.then(user => {
			if(user) {
				console.log('Found user:', JSON.stringify(user));
				return getPermissions(user.providerDetails.id);
			}

			return Promise.reject(new Error(`User with id: ${userId} was not found.`));
		});
};

function getPermissions(userProviderId) {
	var authorizationServiceUrl = sails.config.services.authorization_service.host + ':' + sails.config.services.authorization_service.port + '/compartment';
	console.log('Requesting permissions from authorization-service in url:', authorizationServiceUrl);
	var options = {
		url: authorizationServiceUrl,
		qs: { id: userProviderId },
		json: true
	};
	return requestAsPromise(options)
		.then(permissions => {
			console.log('resp is:', permissions);
			return permissions;
		});
}