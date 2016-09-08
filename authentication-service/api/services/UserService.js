User = require('replay-schemas/User');

module.exports.findUserByProfileId = function (profileId) {
    return User
        .findOne({
            'providerDetails.id': profileId
        });
}

module.exports.createUser = function (providerName, providerId, displayName) {
    return User
        .create({
            'providerDetails.id': providerId,
            'providerDetails.name': providerName,
            displayName: displayName
        });
}