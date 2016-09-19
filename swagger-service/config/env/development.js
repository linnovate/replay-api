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
var port = process.env.PORT || 1336;
var baseHost = process.env.BASE_HOST || 'http://localhost';
var baseUrl = baseUrl + ':' + port;

// external swagger services urls
var QUERY_SERVICE_URL = process.env.QUERY_SERVICE_URL || 'http://localhost:1338',
  MEDIA_PROVIDER_URL = process.env.MEDIA_PROVIDER_URL || 'http://localhost:1339',
  AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:1337';

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  // models: {
  //   connection: 'someMongodbServer'
  // }

  port: port,
  baseHost: baseHost,
  swaggerCombined: {
    port: process.env.SWAGGER_DOCS_PORT || 1111,
    list_url: [
      {
        docs: QUERY_SERVICE_URL + '/swagger/doc',
        base_path: QUERY_SERVICE_URL,
        route_match: [
          "/video*",
          "/query*",
          "/source*",
          "/tag*",
          "/videometadata*"
        ],
        route_filter: []
      }
    ],
    info: {
      title: 'Replay API',
      version: '1.0'
    }
  }
};
