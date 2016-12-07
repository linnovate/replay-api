// MPD requests standard for manifests
const MANIFEST_SUFFIX = '/manifest.mpd';

// Required libs
var assert = require('chai').assert;
var Promise = require('bluebird');
var sails = require('sails');
// Project Modules
var dataInit = require('replay-test-utils/test-data');
// Mongoose schemas
var Mission = require('replay-schemas/Mission'),
	Video = require('replay-schemas/Video');

// Tested module !< ManifestRequestBuilder >!
describe('getVideoCompartmentManifestRequest tests', getVideoCompartmentManifestRequest);
// buildManifestRequest methods tests
function getVideoCompartmentManifestRequest() {
	var originProcessPath;
	before(function(done) {
		originProcessPath = process.cwd();
		process.chdir(__dirname);
		mongoFill()
			.then(done)
			.catch(function(err) {
				done(err);
			});
	});

	describe('Normal behavior tests', function() {
		describe('retrive mpd url for Mission\'s videoCompartment single object', function() {
			var mpdUrl = '';
			var videoName;
			var duration;
			before(function(done) {
				getMissionPopulated()
					.then(function(mission) {
						if (mission.videoCompartments.length > 0) {
							videoName = mission.videoCompartments[0].videoId.baseName;
							duration = mission.videoCompartments[0].durationInSeconds;
							ManifestRequestBuilder.getVideoCompartmentManifestRequest(mission.videoCompartments[0])
								.then(function(url) {
									console.log(url);
									mpdUrl = JSON.stringify(url);
									done();
								})
								.catch(function(err) {
									done(err);
								});
						} else {
							done('no video compartments found');
						}
					});
			});

			it('should return valid mpd request url with video base name, mpd suffix,wowza play duration', function(done) {
				assert.include(mpdUrl, MANIFEST_SUFFIX);
				assert.include(mpdUrl, videoName);
				assert.include(mpdUrl, 'wowzaplayduration=' + (duration * 1000));
				done();
			});
		});
	});

	describe('error handling tests', function() {
		describe('videoCompartment validation tests', function() {
			var videoComp;

			beforeEach(function() {
				videoComp = {
					relativeStartTime: 0,
					durationInSeconds: 120,
					videoId: {
						contentDirectoryPath: 'BigBuckBunny',
						requestFormat: 'mp4',
						baseName: 'BigBuckBunny'
					}
				};
			});

			it('should fail validation with bad relative start time', function(done) {
				videoComp.relativeStartTime = 'avner';
				ManifestRequestBuilder.getVideoCompartmentManifestRequest(videoComp)
					.then(function(url) {
						done('shouldn\'t resolve');
					})
					.catch(function(err) {
						assert.include(err, 'failed validation');
						done();
					});
			});

			it('should fail validation with no relative start time', function(done) {
				videoComp.relativeStartTime = undefined;
				ManifestRequestBuilder.getVideoCompartmentManifestRequest(videoComp)
					.then(function(url) {
						done('shouldn\'t resolve');
					})
					.catch(function(err) {
						assert.include(err, 'failed validation');
						done();
					});
			});

			it('should fail validation with bad duration', function(done) {
				videoComp.durationInSeconds = 'avner';
				ManifestRequestBuilder.getVideoCompartmentManifestRequest(videoComp)
					.then(function(url) {
						done('shouldn\'t resolve');
					})
					.catch(function(err) {
						assert.include(err, 'failed validation');
						done();
					});
			});

			it('should fail validation with no duration', function(done) {
				videoComp.relativeStartTime = undefined;
				ManifestRequestBuilder.getVideoCompartmentManifestRequest(videoComp)
					.then(function(url) {
						done('shouldn\'t resolve');
					})
					.catch(function(err) {
						assert.include(err, 'failed validation');
						done();
					});
			});

			it('should fail validation with no videoId population', function(done) {
				videoComp.videoId = undefined;
				ManifestRequestBuilder.getVideoCompartmentManifestRequest(videoComp)
					.then(function(url) {
						done('shouldn\'t resolve');
					})
					.catch(function(err) {
						assert.include(err, 'failed validation');
						done();
					});
			});

			it('should fail validation with no video content directory path', function(done) {
				videoComp.videoId.contentDirectoryPath = undefined;
				ManifestRequestBuilder.getVideoCompartmentManifestRequest(videoComp)
					.then(function(url) {
						done('shouldn\'t resolve');
					})
					.catch(function(err) {
						assert.include(err, 'failed validation');
						done();
					});
			});

			it('should fail validation with no video request format', function(done) {
				videoComp.videoId.requestFormat = undefined;
				ManifestRequestBuilder.getVideoCompartmentManifestRequest(videoComp)
					.then(function(url) {
						done('shouldn\'t resolve');
					})
					.catch(function(err) {
						assert.include(err, 'failed validation');
						done();
					});
			});

			it('should fail validation with no video baseName', function(done) {
				videoComp.videoId.baseName = undefined;
				ManifestRequestBuilder.getVideoCompartmentManifestRequest(videoComp)
					.then(function(url) {
						done('shouldn\'t resolve');
					})
					.catch(function(err) {
						assert.include(err, 'failed validation');
						done();
					});
			});
		});
	});

	after(function(done) {
		wipeMongo(done);
		process.chdir(originProcessPath);
	});
}

function mongoFill() {
	console.log(process.env.MONGO_DATABASE);
	return dataInit.insertVideos(dataInit.videoPath)
		.then(dataInit.insertNewMission(dataInit.missionWithVideoPath));
}

function wipeMongo(done) {
	console.log('after');
	Video.remove({}, function(err) {
		if (err) {
			console.log(err);
		}
		Mission.remove({}, function(err) {
			if (err) {
				console.log(err);
			}
			done();
		});
	});
}

function getMissionPopulated() {
	return new Promise(function(resolve, reject) {
		return Mission.findOne()
			.populate({
				path: 'videoCompartments.videoId',
				model: 'Video'
			})
			.exec(function(err, mission) {
				if (err) {
					reject(err);
				}
				resolve(mission);
			});
	});
}
