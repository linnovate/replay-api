var fs = require("fs");
var passport = require('passport'),
SamlStrategy = require('passport-saml').Strategy,
LocalStrategy = require('passport-local').Strategy,
bcrypt = require('bcrypt');

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findOne({ id: id } , function (err, user) {
		done(err, user);
	});
});







passport.initialize();
passport.session();

// Use SAML strategy
passport.use(new SamlStrategy({
	entryPoint: 'https://replayadfs.westeurope.cloudapp.azure.com/adfs/ls/',
	issuer: 'https://dev.replay.linnovate.net',
	    	//callbackUrl: 'https://dev.replay.linnovate.net/adfs/postResponse',
	    	callbackUrl: 'https://localhost:1337/login/callback',
	    	//privateCert: fs.readFileSync('/path/to/vod .key', 'utf-8'),
	    	cert: fs.readFileSync('./replayadfs.westeurope.cloudapp.azure.com.crt', 'utf-8'),
	  // other authn contexts are available e.g. windows single sign-on
	  //authnContext: 'http://schemas.microsoft.com/ws/2008/06/identity/authenticationmethod/password',
	   disableRequestedAuthnContext: true,
	  identifierFormat: null,
	  signatureAlgorithm: 'sha256'

	},
	function(profile, done){
		console.log("***** passport.use **********")
		User.findOne({
			// TODO set username from config/local
			username: profile[sails.config.settings.services.saml.username]
		},
		function(err,user){
			console.log("3452345 passport.use **********")
			if(err) {
				return done(err);
			}
			if(user){
				return done(null, user);
			}

			user = new User(config.saml.strategy.claims);

			user.save(function(err){
				if (err) {
					console.log(err);
					return done(null, false, {message: 'Saml login failed, email already used by other login strategy'});
				} else {
					return done(err,user);
				}
			});
		});
	}
	));



passport.use(new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password'
},
function(email, password, done) {

	User.findOne({ email: email }, function (err, user) {
		if (err) { return done(err); }
		if (!user) {
			return done(null, false, { message: 'Incorrect email.' });
		}

		bcrypt.compare(password, user.password, function (err, res) {
			if (!res)
				return done(null, false, {
					message: 'Invalid Password'
				});
			var returnUser = {
				email: user.email,
				name: user.name,
				createdAt: user.createdAt,
				id: user.id
			};
			return done(null, returnUser, {
				message: 'Logged In Successfully'
			});
		});
	});
}
));
