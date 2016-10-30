var Mission = require('replay-schemas/Mission');

module.exports.validateMissionExists = function(missionId) {
	console.log('Validating that mission with id %s exists...', missionId);
	
	return Mission.findById(missionId)
		.then(mission => {
			if(mission) {
				return Promise.resolve();
			}

			return Promise.reject(new Error(`Mission with id ${missionId} does not exist.`));
		})
}