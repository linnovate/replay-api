/**
 * AuthorizationXmlController
 *
 * @description :: Server-side logic for serving authorization xmls files
 */

var fs = require('fs');
var xml2js = require('xml2js');
var Promise = require('bluebird');

var parser = new xml2js.Parser();

module.exports = {

	/**
	 * `AuthorizationXmlController.serve()`
	 */
	getCompartment: function(req, res) {
		var id = req.params.id;
		return getCompartment(id)
			.then(parseXml)
			.then(function(result) {
				res.send(result);
			})
			.catch(function(err) {
				res.notFound(err);
			});
	},
	generateCompartmentCondition: function(req, res) {
		var id = req.params.id;
		return getCompartment(id)
			.then(parseXml)
			.then(buildQuery)
			.then(function(result) {
				res.send(result);
			})
			.catch(function(err) {
				res.notFound(err);
			});
	},
	permission: function(req, res) {
		var id = req.params.id;
		return getCompartment(id)
			.then(parseXml)
			.then(function(result) {
				res.send(result);
			})
			.catch(function(err) {
				res.notFound(err);
			});
	},
};

function getCompartment(id) {
	var fileName = 'sys';
	if (id) {
		fileName += id;
	}
	return new Promise(function(resolve, reject) {
		var target = './assets/authorizationXml/' + fileName + '.xml';
		fs.readFile(target, function(err, data) {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
}

function buildQuery(permissions) {
	return new Promise(function(resolve, reject) {
		try {
			var query = { $or: [] };
			for (var i = 0; i < permissions.length; i++) {
				query.$or.push({
					destination: permissions[i].id[0]
				});
				if (i === permissions.length - 1) {
					console.log('query: ' + JSON.stringify(query));
					resolve(query);
					break;
				}
			}
		} catch (err) {
			reject(err);
		}
	});
}

function parseXml(data) {
	return new Promise(function(resolve, reject) {
		parser.parseString(data, function(err, result) {
			if (result === undefined || err) {
				reject(err);
			} else {
				var permissions = result.permissions.allow[0].userPermission;
				resolve(permissions);
			}
		});
	});
}

/*function getUserPermissions(userCode) {
	var PromiseRequest = Promise.method(function(options) {
		return new Promise(function(resolve, reject) {
			var request = http.request(options, function(response) {
				// Bundle the result
				response.setEncoding('utf8');
				var responseString = '';

				response.on('data', function(data) {
					responseString += data;
				});

				response.on('end', function() {
					resolve(responseString);
				});
			});

			// Handle errors
			request.on('error', function(error) {
				console.log('Problem with request:', error.message);
				reject(error);
			});

			request.end();
		});
	});

	return PromiseRequest({
		host: process.env.COMPARTMENT_HOST || 'localhost', //
		port: process.env.COMPARTMENT_PORT || 1340, //
		path: '/compartment/getCompartment',
		method: 'GET'
	});
}*/
