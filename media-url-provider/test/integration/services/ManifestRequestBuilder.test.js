var assert = require('chai').assert;
var nock = require('nock');
var fs = require('fs');
var sails = require('sails');
var VideoCompartment = require('replay-schemas/VideoCompartment').VideoCompartment,
	Video = require('replay-schemas/Video');

// mpd requests standard for manifests
const MANIFEST_SUFFIX = '/manifest.mpd';

// Tested module
var ManifestRequestBuilder = require('../../../api/services/ManifestRequestBuilder.js');
// Mock Params for compartment service
var compartmentBaseUrl, compartmentRoute;

// run buildManifestRequest methods tests
describe('buildManifestRequest tests', buildManifestRequest);
// buildManifestRequest methods tests
function buildManifestRequest() {
	var originProcessPath;
	
	before(function (done) {
		compartmentBaseUrl = 'http://' + sails.config.settings.services.compartment.host + ':' + sails.config.settings.services.compartment.port,
		compartmentRoute = '/compartment/getCompartment';

		originProcessPath = process.cwd();
		process.chdir(__dirname);
		mongoFill()
			.then(function () {
				done();
			})
			.catch(function (err) {
				done(err);
			});
	});

	after(function (done) {
		wipeMongo(done);
		process.chdir(originProcessPath);
	});

	describe('Normal behavior', function normalBehavior() {
		var id = '57a70996d7230637394ccc62',
			userId = 'abc123';
		describe('retrive mpd url by videoCompartment id', function () {
			var videoFileName;
			before(function (done) {
				try {
					var compartmentData = fs.readFileSync('../assets/compartmentDummy.xml');
					nock(compartmentBaseUrl)
						.defaultReplyHeaders({
							'Content-Type': 'application/xml'
						})
						.get(compartmentRoute)
						.reply(200, compartmentData);
				} catch (err) {
					return done(err);
				}

				VideoCompartment.findOne({ _id: id }, function (err, videoComp) {
					if (err || videoComp === null) {
						done(err);
					} else {
						Video.findOne({ _id: videoComp.videoId }, function (err, video) {
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
			after(function () {
				nock.cleanAll();
			});
			it('should return valid mpd request url', function (done) {
				ManifestRequestBuilder.buildManifestRequest(id, userId)
					.then(function (mpd) {
						assert.include(mpd, MANIFEST_SUFFIX);
						assert.include(mpd, videoFileName);
						done();
					})
					.catch(function (err) {
						done(err);
					});
			});
		});
		describe('empty user compartments', function () {
			before(function (done) {
				try {
					var compartmentData = fs.readFileSync('../assets/emptyUserCompartment.xml');
					nock(compartmentBaseUrl)
						.defaultReplyHeaders({
							'Content-Type': 'application/xml'
						})
						.get(compartmentRoute)
						.reply(200, compartmentData);
					done();
				} catch (err) {
					return done(err);
				}
			});
			after(function () {
				nock.cleanAll();
			});
			it('should not return mpd url', function (done) {
				ManifestRequestBuilder.buildManifestRequest(id, userId)
					.then(function (mpd) {
						assert.fail(undefined, undefined, 'should have been rejected');
						done();
					})
					.catch(function (err) {
						assert.typeOf(err, 'error', 'got the error');
						done();
					});
			});
		});
	});

	describe('Error handling', function errorHandling() {
		describe('non existing id', function () {
			before(function (done) {
				try {
					var compartmentData = fs.readFileSync('../assets/compartmentDummy.xml');
					nock(compartmentBaseUrl)
						.defaultReplyHeaders({
							'Content-Type': 'application/xml'
						})
						.get(compartmentRoute)
						.reply(200, compartmentData);
					done();
				} catch (err) {
					return done(err);
				}
			});
			after(function () {
				nock.cleanAll();
			});
			it('should not find video compartment', function (done) {
				ManifestRequestBuilder.buildManifestRequest('not_real_id', 'someUser')
					.then(function (mpd) {
						assert.fail(undefined, undefined, 'should have been rejected');
						done();
					})
					.catch(function (err) {
						assert.equal(err, 'Video compartment does not exist');
						done();
					});
			});
		});
		describe('compartment service not found', function () {
			it('should reject with error not found', function (done) {
				ManifestRequestBuilder.buildManifestRequest()
					.then(function (mpd) {
						assert.fail(undefined, undefined, 'should have been rejected');
						done();
					})
					.catch(function (err) {
						assert.typeOf(err, 'error', 'got the error');
						done();
					});
			});
		});
		describe('bad http response from compartment service', function () {
			before(function (done) {
				try {
					nock(compartmentBaseUrl)
						.defaultReplyHeaders({
							'Content-Type': 'application/xml'
						})
						.get(compartmentRoute)
						.reply(404);
					done();
				} catch (err) {
					return done(err);
				}
			});
			after(function () {
				nock.cleanAll();
			});
			it('should reject on bad response', function (done) {
				ManifestRequestBuilder.buildManifestRequest()
					.then(function (mpd) {
						assert.fail(undefined, undefined, 'should have been rejected');
						done();
					})
					.catch(function (err) {
						assert.typeOf(err, 'error', 'got the error');
						done();
					});
			});
		});
		describe('bad xml response from compartment service', function () {
			before(function (done) {
				try {
					nock(compartmentBaseUrl)
						.defaultReplyHeaders({
							'Content-Type': 'application/xml'
						})
						.get(compartmentRoute)
						.reply(200, '<this><is><wierd><xml></xml></wierd></is></this>');
					done();
				} catch (err) {
					return done(err);
				}
			});
			after(function () {
				nock.cleanAll();
			});
			it('should reject on invalid xml return', function (done) {
				ManifestRequestBuilder.buildManifestRequest()
					.then(function (mpd) {
						assert.fail(undefined, undefined, 'should have been rejected');
						done();
					})
					.catch(function (err) {
						assert.typeOf(err, 'error', 'got the error');
						done();
					});
			});
		});
		describe('no video matching compartment id', function () {
			var id;
			before(function (done) {
				try {
					var compartmentData = fs.readFileSync('../assets/compartmentDummy.xml');
					nock(compartmentBaseUrl)
						.defaultReplyHeaders({
							'Content-Type': 'application/xml'
						})
						.get(compartmentRoute)
						.reply(200, compartmentData);
					id = '57a70996d7230637394ddd62';
					var videoComp = new VideoCompartment({
						_id: '57a70996d7230637394ddd62',
						videoId: '57a70996d7230637394eee62',
						startTime: '2016-08-07T10:12:57.417Z',
						endTime: '2016-08-07T10:13:27.417Z',
						startAsset: '20000',
						duration: '30000',
						destination: 'System 2'
					});
					videoComp.save(function (err, result) {
						if (err) {
							done(err);
						} else {
							done();
						}
					});
				} catch (err) {
					done(err);
				}
			});
			after(function () {
				nock.cleanAll();
			});
			it('should reject when no match for video', function (done) {
				ManifestRequestBuilder.buildManifestRequest(id, 'someUser')
					.then(function (mpd) {
						assert.fail(undefined, undefined, 'should have been rejected');
						done();
					})
					.catch(function (err) {
						assert.equal(err, 'Video does not exist');
						done();
					});
			});
		});
	});
}

function mongoFill() {
	return createVideoRecordInMongo()
		.then(createVideoCompartmentRecordInMongo);
}

function createVideoCompartmentRecordInMongo() {
	return new Promise(function (resolve, reject) {
		var videoComp = new VideoCompartment({
			_id: '57a70996d7230637394ccc62',
			videoId: '57a70996d7230637394bbb62',
			startTime: '2016-08-07T10:12:57.417Z',
			endTime: '2016-08-07T10:13:27.417Z',
			startAsset: '20000',
			duration: '30000',
			destination: 'System 2'
		});
		videoComp.save(function (err, result) {
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
	return new Promise(function (resolve, reject) {
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
		video.save(function (err, result) {
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
	Video.remove({}, function (err) {
		if (err) {
			console.log(err);
		}
		VideoCompartment.remove({}, function (err) {
			if (err) {
				console.log(err);
			}
			done();
		});
	});
}
