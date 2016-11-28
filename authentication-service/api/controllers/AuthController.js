var request = require('request'),
  passport = require('passport');

var User = require('replay-schemas/User');

module.exports = {

  googleCallback: function (req, res, next) {
    var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
    var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
    var params = {
      code: req.body.code,
      client_id: req.body.clientId,
      client_secret: sails.config.settings.google_secret,
      redirect_uri: req.body.redirectUri,
      grant_type: 'authorization_code'
    };

    // Step 1. Exchange authorization code for access token.
    request.post({
      url: accessTokenUrl,
      json: true,
      form: params,
      agentOptions: {
        keepAlive: true // required because if not ECONNRESET was thrown
      }
    }, function (err, response, token) {
      var accessToken = token.access_token;
      var headers = { Authorization: 'Bearer ' + accessToken };

      // Step 2. Retrieve profile information about the current user.
      request.get({ url: peopleApiUrl, headers: headers, json: true }, function (err, response, profile) {
        if (profile.error) {
          return res.status(500).send({ message: profile.error.message });
        }
        // Step 3a. Link user accounts.
        if (req.header('Authorization')) {
          User.findOne({ 'providerDetails.id': profile.sub }, function (err, existingUser) {
            if (existingUser) {
              return res.status(409).send({ message: 'There is already a Google account that belongs to you' });
            }
            var token = req.header('Authorization').split(' ')[1];
            var payload = jwt.decode(token, sails.config.settings.token_secret);
            // TODO: check logical statement 'profileDetails.id' instead _id
            User.findOne({ _id: profile.sub }, function (err, user) {
              if (!user) {
                return res.status(400).send({ message: 'User not found' });
              }
              user.providerDetails.id = profile.sub;
              user.providerDetails.name = 'google';
              user.pictureUri = user.picture || profile.picture.replace('sz=50', 'sz=200');
              user.displayName = user.displayName || profile.name;
              user.save(function () {
                var token = createJWT(user);
                res.send({ token: token });
              });
            });
          });
        } else {
          // Step 3b. Create a new user account or return an existing one.
          User.findOne({ 'providerDetails.id': profile.sub }, function (err, existingUser) {
            if (existingUser) {
              return res.send({ token: JwtService.createJWT(existingUser) });
            }
            User.create({
              email: profile.email,
              providerDetails: {
                id: profile.sub,
                name: 'google'
              },
              pictureUri: profile.picture.replace('sz=50', 'sz=200'),
              displayName: profile.name,
            }, function (err, created) {
              if (err) {
                return res.serverError(err);
              }
              var token = JwtService.createJWT(created);
              res.send({ token: token });
            });
          });
        }
      });
    });
  },

  adfsSamlLogin: function (req, res, next) {
    passport.authenticate('saml', { session: false })(req, res, next);
  },

  adfsSamlCallback: function (req, res, next) {
    passport.authenticate('saml', { session: false }, function (err, userDetails, info) {
      console.log('Authenticating callback...');

      if (err) {
        return res.serverError(err);
      }

      // check user existence
      UserService
        .findUserByProfileId(userDetails.uniqueId)
        .then(function (user) {
          // case user exist, return him
          if (user) {
            console.log('User exists.');
            return Promise.resolve(user);
          }
          // else, create user
          else {
            console.log('User does not exist, creating user...');
            return UserService.createUser('adfs-saml', userDetails.uniqueId, userDetails.displayName);
          }
        })
        .then(function (user) {
          // return JWT
          var token = JwtService.createJWT(user);
          console.log('Returned JWT:', token);
          res.redirect(sails.config.settings.frontendUrl+'?token='+token);
        })
        .catch(function (err) {
          res.serverError(err);
        })
    })(req, res, next);
  },

  isAuthenticated: function (req, res, next) {
    // return OK always because there's a policy of jwtAuth in order to reach this route,
    // so if we reached here token is validated.
    res.ok();
  }

};
