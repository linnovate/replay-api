var fs = require("fs");
var passport = require('passport'),
    SamlStrategy = require('passport-saml').Strategy,
    User = require('replay-schemas/User');

var _displayNameKey = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
    _uniqueIdKey = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/unique_id';

module.exports.initialize = function () {
    // Use SAML strategy
    passport.use(new SamlStrategy({
        entryPoint: sails.config.settings.passport.adfsSaml.entryPoint,
        issuer: sails.config.settings.passport.adfsSaml.issuer,
        callbackUrl: sails.config.settings.baseUrl + '/auth/adfs-saml/callback',
        cert: fs.readFileSync('./replayadfs.westeurope.cloudapp.azure.com.crt', 'utf-8'),
        disableRequestedAuthnContext: true,
        identifierFormat: null,
        signatureAlgorithm: 'sha256'
    },
        function (profile, done) {
            console.log('Verifying ADFS response:', JSON.stringify(profile));
            var displayName = profile[_displayNameKey];
            // default value for development
            var uniqueId = profile[_uniqueIdKey] || 'T12345678';

            // verify required fields exist        
            if (!displayName || !uniqueId) {
                return done(new Error('Verification lacks some info.'));
            }
            var userDetails = {
                displayName: displayName,
                uniqueId: uniqueId
            };
            console.log('Response is valid...');
            done(null, userDetails);
        }
    ));

};
