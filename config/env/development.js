/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */
var blueprints = require('.././blueprints').blueprints;
var port = process.env.PORT || 1337;
var baseUrl = 'http://localhost';

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  // models: {
  //   connection: 'someMongodbServer'
  // }

  port: port,

  settings: {
    host: baseUrl,
  	baseUrl: baseUrl + ':' + port,
  	apiUrl: baseUrl + ':' + port + blueprints.restPrefix,

    token_secret: 'gbrejhgkjrehogi54yu89u9nk8',
    google_secret: 'R83YWn4E5mObpeN7Fn6AKYPY',

    elasticStreamIndex: 'replay_stream_samples',

    services: {
      kaltura: {
        url: 'http://vod.linnovate.net',
        partner_id: 101,

      },
      wowza: {
        url: 'http://vod.linnovate.net',
        port: '1935',
        appName: 'weplay',
        contentDirectory: 'kaltura_content'
      }
    }

  },

  swagger: {
    /**
     * require() the package.json file for your Sails app.
     */
    pkg: require('../.././package'),
    ui: {
      url: baseUrl + ':' + port + '/docs'
    }
  }

};
