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

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  // models: {
  //   connection: 'someMongodbServer'
  // }

  port: port,
  list_url: [
    {
      docs: 'http://petstore.swagger.io/v2/swagger.json',
      base_path: 'http://petstore.swagger.io/v2',
      route_match: ['/user*', '/pet*'],
      route_filter: ['/store*']
    }
  ],
  info: {
    title: 'Example API',
    version: '1.0'
  }

};
