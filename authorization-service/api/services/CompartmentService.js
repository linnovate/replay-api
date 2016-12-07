var fs = require('fs');
var xml2js = require('xml2js');
var Promise = require('bluebird');

var parser = new xml2js.Parser();

module.exports.getCompartmentPermissions = function(id) {
	console.log('Getting compartment for user with id:', id);
	var fileName = 'sys';
	console.log('RETRIEVING SOME sys.xml FILE DUE TO DEVELOPMENT MOCK, USE REAL ID LATER');
	// TODO: comment this out for now because we are using real IDs and not numbers
	// if (id) {
	// 	fileName += id;
	// }
	var path = './assets/authorizationXml/' + fileName + '.xml';
	return readFileAsPromise(path)
		.then(parseXml);
}

function readFileAsPromise(path) {
	return new Promise(function(resolve, reject) {	
		fs.readFile(path, function(err, data) {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
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