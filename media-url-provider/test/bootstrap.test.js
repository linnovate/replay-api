var sails = require('sails');
var Video = require('replay-schemas/Video'),
	Promise = require('bluebird');

before(function(done) {
	// Increase the Mocha timeout so that Sails has enough time to lift.
	this.timeout(10000);
	sails.lift({ environment: 'test' }, function(err, server) {
		if (err) {
			return done(err);
		}
		// here you can load fixtures, etc.
		mongoFill().then(function() {
			done(undefined, sails);
		});
	});
});

after(function(done) {
	// here you can clear fixtures, etc.
	sails.lower();
	wipeMongo(done);
});

function setTestEnvironment() {
	process.env.REPLAY_SCHEMA = 'Video';
	process.env.DATA_FILE = 'video';
	process.env.ID = '57a709954f3c38a839a0605c';
}

function mongoFill() {
	return new Promise(function(resolve, reject) {
		setTestEnvironment();
		var video = new Video({
			createdAt: '2016-08-07T10:12:38.590Z',
			_id: '57a70996d7230637394bbb62',
			durationInSeconds: 1800,
			endTime: '2016-08-07T10:42:37.417Z',
			jobStatusId: '57a709954f3c38a839a0605c',
			videoFileName: 'BigBuckBunny.smil',
			receivingMethod: {
				standard: 'VideoStandard',
				version: '1.0',
				_id: '57a70996d7230637394bbb63'
			},
			falvors: ['Big_Buck_Bunny_480p.mp4', 'Big_Buck_Bunny_720p.mp4', 'Big_Buck_Bunny_1080p.mp4'],
			requestFormat: 'smil',
			baseName: 'BigBuckBunny',
			contentDirectoryPath: 'BigBuckBunny',
			sourceId: '102',
			startTime: '2016-08-07T10:12:37.417Z',
			updatedAt: '2016-08-07T10:13:04.451Z',
			tags: [],
			status: 'ready'
		});
		video.save(function(err, result) {
			if (err) {
				console.log(err);
				reject(err);
			} else {
				console.log('created video object');
				resolve();
			}
		});
	});
}

function wipeMongo(done) {
	Video.remove({}, function(err) {
		if (err) {
			done(err);
		} else {
			done();
		}
	});
}
