var passport = require('passport');
var GoogleTokenStrategy = require('passport-google-id-token');

passport.use(new GoogleTokenStrategy({
    clientID: '726385581494-3te31aa3t09polsm5paeg4eeh9qgbcgl.apps.googleusercontent.com'
  },
  function (parsedToken, googleId, done) {
    //console.log('parsedToken', parsedToken);
    //console.log('googleId', googleId);

    return done(null, {id: googleId});

    /*User.findOrCreate({ googleId: googleId }, function (err, user) {
     return done(err, user);
     });*/
  }
));
