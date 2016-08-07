var request = require('request');

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
    //console.log('body', req.body);

    // Step 1. Exchange authorization code for access token.
    request.post(accessTokenUrl, {json: true, form: params}, function (err, response, token) {
      var accessToken = token.access_token;
      var headers = {Authorization: 'Bearer ' + accessToken};

      // Step 2. Retrieve profile information about the current user.
      request.get({url: peopleApiUrl, headers: headers, json: true}, function (err, response, profile) {
        if (profile.error) {
          return res.status(500).send({message: profile.error.message});
        }
        // Step 3a. Link user accounts.
        if (req.header('Authorization')) {
          User.findOne({google: profile.sub}, function (err, existingUser) {
            if (existingUser) {
              return res.status(409).send({message: 'There is already a Google account that belongs to you'});
            }
            var token = req.header('Authorization').split(' ')[1];
            var payload = jwt.decode(token, sails.config.settings.token_secret);
            User.findOne({_id: profile.sub}, function (err, user) {
              if (!user) {
                return res.status(400).send({message: 'User not found'});
              }
              user.google = profile.sub;
              user.picture = user.picture || profile.picture.replace('sz=50', 'sz=200');
              user.displayName = user.displayName || profile.name;
              user.save(function () {
                var token = createJWT(user);
                res.send({token: token});
              });
            });
          });
        } else {
          // Step 3b. Create a new user account or return an existing one.
          User.findOne({google: profile.sub}, function (err, existingUser) {
            if (existingUser) {
              return res.send({token: JwtService.createJWT(existingUser)});
            }
            User.create({
              email: profile.email,
              google: profile.sub,
              picture: profile.picture.replace('sz=50', 'sz=200'),
              displayName: profile.name
            }).exec(function (err, created) {
                var token = JwtService.createJWT(created);
                res.send({token: token});
              }
            );
          });
        }
      });
    });
  }
};
