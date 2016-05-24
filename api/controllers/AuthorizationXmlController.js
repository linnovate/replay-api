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
  serve: function (req, res) {
  	var id = req.params.id;
  	var fileName = 'sys';
  	if (id) {
    	fileName += id;
  	}
  	var target = './assets/authorizationXml/' + fileName + '.xml';   
    fileSystem.exists(target, function (exists) {
      if (!exists) {
        return res.notFound('The requested file (' + fileName + ') does not exist.');
      }

      fileSystem.createReadStream(target).pipe(res);
    });
  }
};
