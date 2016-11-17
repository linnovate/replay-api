var sails = require('sails');

before(function(done) {
	// Increase the Mocha timeout so that Sails has enough time to lift.
	this.timeout(15000);
	sails.lift({ environment: 'testing' }, function(err, server) {
		if (err) {
			return done(err);
		}
		// here you can load fixtures, etc.
		setEnvironmentVariables(function() {
			done(undefined, sails);
		});
	});
});

after(function(done) {
	// here you can clear fixtures, etc.
	sails.lower(done);
});

function setEnvironmentVariables(callback) {
	process.env.COMPARTMENT_HOST = sails.config.settings.services.compartment.host;
	process.env.COMPARTMENT_PORT = sails.config.settings.services.compartment.port;
	callback();
}
