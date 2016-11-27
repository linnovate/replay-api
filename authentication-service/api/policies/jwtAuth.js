/**
 * googleAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow google authenticated user
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */

var moment = require('moment');
var jwt = require('jwt-simple');

module.exports = function (req, res, next) {
  if (!req.header('Authorization')) {
    return res
        .set('WWW-Authenticate', 'missing authorization header')
        .status(401)
        .send();
  }
  var token = req.header('Authorization').split(' ')[1];

  var payload = null;
  try {
    payload = jwt.decode(token, sails.config.settings.token_secret);
  }
  catch (err) {
    console.log('Error decoding JWT:', err);
    return res
        .set('WWW-Authenticate', err.message)
        .status(401)
        .send();
  }

  if (payload.exp <= moment().unix()) {
    console.log('JWT has expired.');
    return res
        .set('WWW-Authenticate', 'JWT has expired')
        .status(401)
        .send();
  }
  req.user = payload.sub;
  console.log('JWT is valid.');
  return next();
};
