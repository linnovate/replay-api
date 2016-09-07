var fs = require("fs");
var passport = require('passport'),
    SamlStrategy = require('passport-saml').Strategy;

// Use SAML strategy
passport.use(new SamlStrategy({
        entryPoint: 'https://replayadfs.westeurope.cloudapp.azure.com/adfs/ls/',
        issuer: 'https://dev.replay.linnovate.net',
        callbackUrl: 'https://localhost:1337' + '/auth/adfs-saml/callback',
        cert: fs.readFileSync('./replayadfs.westeurope.cloudapp.azure.com.crt', 'utf-8'),
        disableRequestedAuthnContext: true,
        identifierFormat: null,
        signatureAlgorithm: 'sha256'
    },
    function(profile, done) {
        console.log('in verifier, profile is:', JSON.stringify(profile));
        done();
    }
));
