/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var mongoose = require('mongoose');
	AuthorizationService = require('replay-request-services/authorization'),
	Mission = require('replay-schemas/Mission');

module.exports = {
	findOne: function(req, res, next) {
		if(!validateFindRequest(req)) {
			return res.badRequest('Some parameters are missing.');
		}
		// make sure only the authenticated user itself can fetch his own data
		else if(req.userId !== req.params.id) {
			return res.forbidden();
		}

		UserService.findUserById(req.userId)
			.then(user => {
				console.log('Found user:', JSON.stringify(user));
				res.json(user);
			})
			.catch(err => {
				if(err) {
					console.log(err);
					next(err);
				}
			});
	},
	updateFavorite: function(req, res, next) {
		if(!validateUpdateFavoriteRequest(req)) {
			return res.badRequest('Some parameters are missing.');
		}
		// make sure only the authenticated user itself can fetch his own data
		else if(req.userId !== req.params.id) {
			return res.forbidden();
		}

		var missionId = req.params.missionId;
		AuthorizationService.findPermissionsByUserId(req.userId)
			.then(permissions => Mission.validateMissionExists(missionId, permissions))
			.then(() => {
				if(req.method === 'PUT') {
					return UserService.updateUserById(req.userId, { $addToSet: { favorites: missionId } });
				}
				else if(req.method === 'DELETE') {
					return UserService.updateUserById(req.userId, { $pull: { favorites: missionId } });
				}
				
				return Promise.reject(new Error('Unsupported HTTP method.'));
			})
			.then(() => {
				console.log('User\'s favorites updated missions successfuly.');
				return res.ok();
			})
			.catch(err => {
				if(err) {
					console.log(err);
					next(err);
				}
			});
	},
	
};

function validateFindRequest(req) {
	// validate id is indeed a proper id
	if(req.params.id) {
		try {
			mongoose.Types.ObjectId(req.params.id);
		} catch(e) {
			return false;
		}
	}
	else {
		return false;
	}

	return true;
}

function validateUpdateFavoriteRequest(req) {
	// validate the user id
	if(!validateFindRequest(req)) {
		return false;
	}

	if(req.params.missionId) {
		try {
			mongoose.Types.ObjectId(req.params.missionId);
		} catch(e) {
			return false;
		}
	}
	else {
		return false;
	}

	return true;
}