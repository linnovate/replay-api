const MANIFEST_SUFFIX = '/manifest.mpd';
var request = require('supertest'),
	assert = require('chai').assert,
	req = require('request'),
	nock = require('nock'),
	VideoCompartment = require('replay-schemas/VideoCompartment').VideoCompartment,
	Video = require('replay-schemas/Video');

function test() {
	before(function(done) {
		mongoFill()
		.then(function() {
				done();
			})
			.catch(function(err) {
				done(err);
			});
	});

	after(function(done) {
		wipeMongo(done);
	});

	describe('MediaController', function() {
		findOne();
	});
}

function findOne() {
	describe('Normal behavior', function() {
		var compartmentBaseUrl = 'http://localhost:5165';
		var compartmentRoute = '/compartment/getCompartment';
		var id = '57a70996d7230637394ccc62';
		var userId = 'abc123';
		var videoFileName;

		before(function(done) {
			var compartmentData = '<permissions><allow><userPermission><id>System 1</id><level>3</level></userPermission><userPermission><id>System 2</id><level>3</level></userPermission><userPermission><id>System 3</id><level>3</level></userPermission></allow></permissions>';
			nock(compartmentBaseUrl)
				.defaultReplyHeaders({
					'Content-Type': 'application/xml'
				})
				.get(compartmentRoute)
				.reply(200, compartmentData);

			VideoCompartment.findOne({ _id: id }, function(err, videoComp) {
				if (err || videoComp === null) {
					done(err);
				} else {
					Video.findOne({ _id: videoComp.videoId }, function(err, video) {
						if (err || videoComp === null) {
							done(err);
						} else {
							videoFileName = video.videoFileName;
							done();
						}
					});
				}
			});
		});

		it('should return url for media request', function(done) {
			request(sails.hooks.http.app)
				.get('/media/' + id)
				.set({ 'Authorization': 'abc123' })
				.expect(200)
				.expect(function(res) {
					assert.include(res.body.url, MANIFEST_SUFFIX);
					assert.include(res.body.url, id);
				})
				.end(done);
		});
	});

	describe('bad requests returns', function() {
		var id;

		beforeEach(function() {
			id = 'not mongo id';
		});

		it('should return bad request', function(done) {
			request(sails.hooks.http.app)
				.get('/media/' + id)
				.expect(400, done);
		});
	});
}

// test();

function mongoFill() {
	return createVideoRecordInMongo()
		.then(createVideoCompartmentRecordInMongo);
}

function createVideoCompartmentRecordInMongo() {
	return new Promise(function(resolve, reject) {
		var videoComp = new VideoCompartment({
			_id: '57a70996d7230637394ccc62',
			videoId: '57a70996d7230637394bbb62',
			startTime: '2016-08-07T10:12:57.417Z',
			endTime: '2016-08-07T10:13:27.417Z',
			startAsset: '20000',
			duration: '30000',
			destination: 'System 2'
		});
		videoComp.save(function(err, result) {
			if (err) {
				console.log(err);
				reject(err);
			} else {
				console.log('created videoCompartment object');
				resolve();
			}
		});
	});
}

function createVideoRecordInMongo() {
	return new Promise(function(resolve, reject) {
		var video = new Video({
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
			console.log(err);
		}
		VideoCompartment.remove({}, function(err) {
			if (err) {
				console.log(err);
			}
			done();
		});
	});
}
