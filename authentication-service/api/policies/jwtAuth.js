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
    console.log('Request lacks Authorization header.');
    return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
  }
  var token = req.header('Authorization').split(' ')[1];

  var payload = null;
  try {
    payload = jwt.decode(token, sails.config.settings.token_secret);
  }
  catch (err) {
    console.log('Error decoding JWT:', err);
    return res.status(401).send({ message: err.message });
  }

  if (payload.exp <= moment().unix()) {
    console.log('Request token has expired.');
    return res.status(401).send({ message: 'Token has expired' });
  }
  req.user = payload.sub;
  console.log('JWT is valid.');
  next();
};
