/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var mongoose = require('mongoose');

module.exports = {
	findOne: function(req, res, next) {
		if(!validateFindRequest(req)) {
			return res.badRequest('Some parameters are missing.');
		}
		// make sure only the authenticated user itself can fetch his own data
		else if(req.userId !== req.params.id) {
			return res.forbidden();
		}

		UserService.findUserById(req.params.id)
			.then(user => {
				console.log('Found user:', JSON.stringify(user));
				res.json(user);
			})
			.catch(err => {
				if(err) {
					console.log(err);
					next(err);
				}
			})
	}
};

function validateFindRequest(req) {
	// validare id is indeed a proper id
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