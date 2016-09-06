var passport = require('passport');

module.exports = {

	login: function(req, res) {

		console.log("11111login: function(req, res) ");
		passport.authenticate('saml',
			function(err, user, info) {
				console.log("22222login: function(req, res) ");
				console.log(err, user, info);
				if ((err) || (!user)) {
					return res.send({
						message: info.message,
						user: user
					});
				}
				req.logIn(user, function(err) {
					if (err) res.send(err);
					return res.send({
						message: info.message,
						user: user
					});
				});

			})(req, res);
	},

	logout: function(req, res) {
		req.logout();
		res.redirect('/');
	},
	redirect: function(req, res) {
		console.log('in redirect');
		passport.authenticate('saml',
			function(err, user, info) {
				console.log('redirected to dev.replay');
				res.redirect('http://dev.replay.linnovate.net');
			})(req, res);
		// passport.authenticate('saml',
		// 	function(req, res) {
		// 		console.log('redirected to dev.replay');
		// 		res.redirect('http://dev.replay.linnovate.net');
		// 	};
	},
	ensureAuthenticated: function(req, res, next) {
		console.log("test ensureAuthenticated")
		if (req.isAuthenticated())
			return next();
		else
			return res.redirect('/login');
	},
	signup: function(req, res) {
		User.create(req.params.all()).exec(function(err, user) {
			if (err) return res.negotiate(err);
			req.login(user, function(err) {
				if (err) return res.negotiate(err);
				return res.redirect('/welcome');
			});
		});
	},

	authCallback: function(req, res) {
		var payload = req.user;
		var escaped = JSON.stringify(payload);
		escaped = encodeURI(escaped);
		// We are sending the payload inside the token
		var token = jwt.sign(escaped, config.secret, { expiresInMinutes: 60 * 5 });
		res.cookie('token', token);
		res.redirect('/');
	}
};
