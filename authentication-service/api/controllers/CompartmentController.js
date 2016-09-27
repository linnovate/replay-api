/**
 * AuthorizationXmlController
 *
 * @description :: Server-side logic for serving authorization xmls files
 */

var fileSystem = require('fs');

module.exports = {

	/**
	 * `AuthorizationXmlController.serve()`
	 */
	getCompartment: function(req, res) {
		var id = req.params.id;
		var fileName = 'sys';
		if (id) {
			fileName += id;
		}
		var target = './assets/authorizationXml/' + fileName + '.xml';
		fileSystem.exists(target, function(exists) {
			if (!exists) {
				return res.notFound('The requested file (' + fileName + ') does not exist.');
			}
			console.log('resolving');
			res.writeHead(200, { 'Content-Type': 'text/xml' });
			var readStream = fileSystem.createReadStream(target);
			// We replaced all the event handlers with a simple call to readStream.pipe()
			readStream.pipe(res);
		});
	}
};