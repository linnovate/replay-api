var Mission = require('replay-schemas/Mission'),
	VideoCompartment = require('replay-schemas/VideoCompartment');

module.exports.validateMissionExists = function (missionId, permissions) {
	console.log('Validating that mission with id %s exists and user has permissions for it...', missionId);

	return findMissions(missionId, permissions)
		.then(mission => {
			if (mission) {
				return Promise.resolve(mission);
			}

			return Promise.reject(new Error(`Mission with id ${missionId} does not exist or user has no permissions for it.`));
		})
}

function findMissions(missionId, permissions) {
	var query = {
		$and: [
			{ _id: missionId },
			VideoCompartment.buildQueryCondition(permissions)
		]
	}
	return Mission.findOne(query);
}