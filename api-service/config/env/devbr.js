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
var baseUrl = process.env.BASE_URL || 'http://server.me';

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

    token_secret: process.env.TOKEN_SECRET || 'gbrejhgkjrehogi54yu89u9nk8',
    google_secret: process.env.GOOGLE_SECRET || 'R83YWn4E5mObpeN7Fn6AKYPY',

    elasticStreamIndex: 'replay_stream_samples',

    services: {
      kaltura: {
        url: process.env.KALTURA_URL || 'http://vod.linnovate.net',
        partner_id: process.env.KALTURA_PARTNER_ID || 101,

      },
      wowza: {
        url: process.env.WOWZA_URL || 'http://vod.linnovate.net',
        port: process.env.WOWZA_PORT || '1935',
        appName: process.env.WOWZA_APP_NAME || 'weplay',
        contentDirectory: process.env.WOWZA_CONTENT_DIR || 'kaltura_content'
      },
      query: {
        url: process.env.QUERY_SERVICE_URL || 'http://localhost',
        port: process.env.QUERY_SERVICE_PORT || 1338
      },
      video: {
        url: process.env.VIDEO_SERVICE_URL || 'http://localhost',
        port: process.env.VIDEO_SERVICE_PORT || 1338
      },
      videometadata: {
        url: process.env.VIDEOMETADATA_SERVICE_URL || 'http://localhost',
        port: process.env.VIDEOMETADATA_SERVICE_PORT || 1338
      },
      media: {
        url: process.env.MEDIA_SERVICE_URL || 'http://localhost',
        port: process.env.MEDIA_SERVICE_PORT || 1339
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
