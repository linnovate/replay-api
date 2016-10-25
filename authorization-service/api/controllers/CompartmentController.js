/**
 * AuthorizationXmlController
 *
 * @description :: Server-side logic for serving authorization xmls files
 */

module.exports = {

	find: function (req, res, next) {
		var id = req.query.id;
		return validateRequest(req.query)
			.then(() => CompartmentService.getCompartmentPermissions(id))
			.then(function (result) {
				res.send(result);
			})
			.catch(function (err) {
				res.serverError(err);
			});
	}
};

function validateRequest(params) {
	if (!params.id) {
		return Promise.reject(new Error('Missing id in query parameters'));
	}
	return Promise.resolve();
}
