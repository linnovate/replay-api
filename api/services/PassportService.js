var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.serializeUser(function(user, next) {
  next(null, user.id);
});

passport.deserializeUser(function(id, next) {
  User.findOne(id, function foundUser(err, user) {
    if (err) return next(err);
    next(err, user);
  });
});

//  Use the GoogleStrategy within Passport.
//  Strategies in Passport require a `verify` function, which accept
//  credentials (in this case, an accessToken, refreshToken, and Google
//  profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: sails.config.settings.services.google.clientID,
    clientSecret: sails.config.settings.services.google.secret,
    callbackURL: sails.config.settings.baseUrl + "/auth/google/callback"
  },
  function (accessToken, refreshToken, profile, done) {
    console.log('accessToken', accessToken);
    console.log('refreshToken', refreshToken);
    console.log('profile', profile);
    console.log('profile.emails', profile.emails);

    User.findOrCreate(
      {
        provider: profile.provider,
        providerId: profile.id
      },
      {
        name: profile.displayName,
        email: profile.emails[0].value,
        provider: profile.provider,
        providerId: profile.id
      },
      function (err, user) {
        return done(err, user);
      }
    );
  }
));
