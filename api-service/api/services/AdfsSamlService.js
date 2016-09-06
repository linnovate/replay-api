var fs = require("fs");
var passport = require('passport'),
    SamlStrategy = require('passport-saml').Strategy;

module.exports.initialize = function () {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findOne({ id: id }, function (err, user) {
            done(err, user);
        });
    });

    passport.initialize();
    passport.session();

    // Use SAML strategy
    passport.use(new SamlStrategy({
        entryPoint: sails.config.settings.passport.adfsSaml.entryPoint,
        issuer: sails.config.settings.passport.adfsSaml.issuer,
        // callbackUrl: 'https://localhost:1337/auth/adfs-saml/callback',
        callbackUrl: 'https://localhost:1337/login/callback',
        cert: fs.readFileSync('./replayadfs.westeurope.cloudapp.azure.com.crt', 'utf-8'),
        disableRequestedAuthnContext: true,
        identifierFormat: null,
        signatureAlgorithm: 'sha256'
    },
        function (profile, done) {
            console.log('in passport, profile is:', JSON.stringify(profile));
            User.findOne({
                username: profile[sails.config.settings.services.saml.username]
            },
                function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (user) {
                        return done(null, user);
                    }

                    user = new User(config.saml.strategy.claims);

                    user.save(function (err) {
                        if (err) {
                            console.log(err);
                            return done(null, false, { message: 'Saml login failed, email already used by other login strategy' });
                        } else {
                            return done(err, user);
                        }
                    });
                });
        }
    ));
};