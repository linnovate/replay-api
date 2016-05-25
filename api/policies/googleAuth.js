/**
 * googleAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow google authenticated user
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
var passport = require('passport');

module.exports = function (req, res, next) {
  passport.authenticate('google-id-token', { session: false }, function (err, user, info) {
    //console.log('err', err);
    //console.log('user', user);
    //console.log('info', info);

    var exInfo = {
          message: info && info.message ? info.message : null,
          code: 0,
          error: err
        };

    if (err) {
      exInfo.code = 500;
      return res.status(exInfo.code).send(exInfo);
    }
    if (!user) {
      exInfo.code = 401;
      return res.status(exInfo.code).send(exInfo);
    }
    req.user = user;

    return next();
  })(req, res, next);

};
