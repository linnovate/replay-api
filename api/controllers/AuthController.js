/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var passport = require('passport');

module.exports = {

  login: function (req, res) {
    res.view();
  },

  google: function (req, res, next) {
    passport.authenticate(
      'google',
      { scope: ['https://www.googleapis.com/auth/userinfo.email']}
    )(req, res);

  },

  googleCallback: function (req, res, next) {
    console.log("entered google callback");
    passport.authenticate('google',
      { successRedirect: '/user/me', failureRedirect: '/auth/login' }
    )(req, res, next);
  },

  logout: function(req, res, next) {
    req.logout();
    res.redirect('/');
  }
};

