var Mission = require('replay-schemas/Mission'),
	Tag = require('replay-schemas/Tag')
request = require('supertest-as-promised'),
	Promise = require('bluebird'),
	mongoose = require('mongoose'),
	util = require('util');
var testUtils = require('replay-common/replay-test-utils/test-data');

var missionUpdateUrlFormat = '/mission/%s',
	missionUrlFormat = '/mission';

describe('MissionController', function() {
	describe('#find()', function() {
		var missionStubsAmount = 3;
		it(util.format('should return all %s missions', missionStubsAmount), function(done) {
			var query = {};
			createMissions(missionStubsAmount)
				.then(() => getAndExpectMissions(missionStubsAmount, query))
				.then(done)
				.catch(done);
		});

		it('should return 0 missions', function(done) {
			var query = {};
			getAndExpectMissions(0, query)
				.then(done)
				.catch(done);
		})

		it('should return 1 Missions by fromMissionTime', function(done) {
			var query = { fromMissionTime: new Date('1970') }
			createMissions(1)
				.then(() => getAndExpectMissions(1, query))
				.then(done)
				.catch(done);
		})

		it('should return 0 Missions by fromMissionTime', function(done) {
			var query = { fromMissionTime: new Date('9999') }
			createMissions(1)
				.then(() => getAndExpectMissions(0, query))
				.then(done)
				.catch(done);
		})

		it('should return 1 Missions by toMissionTime', function(done) {
			var query = { toMissionTime: new Date('9999') }
			createMissions(1)
				.then(() => getAndExpectMissions(1, query))
				.then(done)
				.catch(done);
		})

		it('should return 0 Missions by toMissionTime', function(done) {
			var query = { toMissionTime: new Date('1970') }
			createMissions(1)
				.then(() => getAndExpectMissions(0, query))
				.then(done)
				.catch(done);
		})

		it('should return 1 Missions by minMissionDuration', function(done) {
			var query = { minMissionDuration: 1 }
			createMissions(1)
				.then(() => getAndExpectMissions(1, query))
				.then(done)
				.catch(done);
		})

		it('should return 0 Missions by minMissionDuration', function(done) {
			var query = { minMissionDuration: 9999999 }
			createMissions(1)
				.then(() => getAndExpectMissions(0, query))
				.then(done)
				.catch(done);
		})

		it('should return 1 Missions by maxMissionDuration', function(done) {
			var query = { maxMissionDuration: 9999999 }
			createMissions(1)
				.then(() => getAndExpectMissions(1, query))
				.then(done)
				.catch(done);
		})

		it('should return 0 Missions by maxMissionDuration', function(done) {
			var query = { maxMissionDuration: 1 }
			createMissions(1)
				.then(() => getAndExpectMissions(0, query))
				.then(done)
				.catch(done);
		})

		it('should return 1 Missions by sourceId', function(done) {
			var query = { sourceId: '100' }
			createMissions(1)
				.then(() => getAndExpectMissions(1, query))
				.then(done)
				.catch(done);
		})

		it('should return 0 Missions by sourceId', function(done) {
			var query = { sourceId: 'someSourceId' }
			createMissions(1)
				.then(() => getAndExpectMissions(0, query))
				.then(done)
				.catch(done);
		})

		it('should return 1 Missions by tagsIds', function(done) {
			var tag = 'test1';
			createMissions(1)
				.then(() => getMissions())
				.then((missions) => updateMissionAndExpectOK(missions[0].id, tag))
				.then(() => getTags())
				.then((tags) => {
					var query = { tagsIds: JSON.stringify([tags[0].id]) }
					return getAndExpectMissions(1, query);
				})
				.then(done)
				.catch(done);
		})

		it('should return 0 Missions by tagsIds', function(done) {
			var tag = 'test1';
			createMissions(1)
				.then(() => getMissions())
				.then((missions) => updateMissionAndExpectOK(missions[0].id, tag))
				.then(() => getTags())
				.then((tags) => {
					var query = { tagsIds: JSON.stringify([new mongoose.Types.ObjectId()]) }
					return getAndExpectMissions(0, query);
				})
				.then(done)
				.catch(done);
		})

		it('should return 1 Missions by boundingShape', function(done) {
			var query = {
				boundingShapeType: 'Polygon',
				boundingShapeCoordinates: '[[[34.784518, 32.128957], [34.848031, 32.125534], [34.846299, 32.029153], [34.744677, 32.018383], [34.784518, 32.128957]]]'
			}
			createMissions(1)
				.then(() => getAndExpectMissions(1, query))
				.then(done)
				.catch(done);
		})

		it('should return 0 Missions by boundingShape', function(done) {
			var query = {
				boundingShapeType: 'Polygon',
				boundingShapeCoordinates: '[[[1,1], [2,2], [3,3], [1,1]]]'
			}
			createMissions(1)
				.then(() => getAndExpectMissions(0, query))
				.then(done)
				.catch(done);
		})

		it('should return 1 Missions by missionName', function(done) {
			var query = { missionName: 'testMission' }
			createMissions(1)
				.then(() => getAndExpectMissions(1, query))
				.then(done)
				.catch(done);
		})

		it('should return 0 Missions by missionName', function(done) {
			var query = { missionName: 'someTestMission' }
			createMissions(1)
				.then(() => getAndExpectMissions(0, query))
				.then(done)
				.catch(done);
		})
	});

	describe('#update()', function() {
		it('should update Missions tag successfuly', function(done) {
			var tag = 'newTag'
			createMissions(1)
				.then(() => getMissions())
				.then((missions) => updateMissionAndExpectOK(missions[0].id, tag))
				.then(() => validateTagUpdated(tag))
				.then(done)
				.catch(done);
		})
	})

	describe('#find() bad input tests', function() {
		it('should reject due to bad fromMissionTime (not Date)', function(done) {
			var query = createMissionQuery();
			query.fromMissionTime = 'test';
			getMissionAndExpectError(done, query);
		})

		it('should reject due to bad toMissionTime (not Date)', function(done) {
			var query = createMissionQuery();
			query.toMissionTime = 'test';
			getMissionAndExpectError(done, query);
		})

		it('should reject due to bad minMissionDuration (not Number)', function(done) {
			var query = createMissionQuery();
			query.minMissionDuration = 'test';
			getMissionAndExpectError(done, query);
		})

		it('should reject due to bad maxMissionDuration (not Number)', function(done) {
			var query = createMissionQuery();
			query.maxMissionDuration = 'test';
			getMissionAndExpectError(done, query);
		})

		it('should reject due to bad boundingShapeType (boundingShapeCoordinates without boundingShapeType)', function(done) {
			var query = createMissionQuery();
			query.boundingShapeType = undefined;
			getMissionAndExpectError(done, query);
		})

		it('should reject due to bad boundingShapeCoordinates (boundingShapeType without boundingShapeCoordinates)', function(done) {
			var query = createMissionQuery();
			query.boundingShapeCoordinates = undefined;
			getMissionAndExpectError(done, query);
		})

		it('should reject due to bad tagsIds (not [mongoose.Types.ObjectId])', function(done) {
			var query = createMissionQuery();
			query.tagsIds = '[someId]';
			getMissionAndExpectError(done, query);
		})
	});

	describe('#update() bad input tests', function() {
		it('should reject due to empty update', function(done) {
			var tag = ''
			createMissions(1)
				.then(() => getMissions())
				.then((missions) => updateMissionAndExpectError(missions[0].id, tag))
				.then(() => done())
				.catch(done);
		})

		it('should reject due to bad id (not mongoose.Types.ObjectId)', function(done) {
			var tag = 'newTag'
			createMissions(1)
				.then(() => getMissions())
				.then((missions) => updateMissionAndExpectError('someNotExistingId', tag))
				.then(() => done())
				.catch(done);
		})

		it('should reject due to bad update property (not tag property)', function(done) {
			var tag = 'newTag'
			createMissions(1)
				.then(() => getMissions())
				.then((missions) => {
					return request(sails.hooks.http.app)
						.put(util.format(missionUpdateUrlFormat, missions[0].id))
						.send({
							tag: tag,
							sourceId: 'newSourceId'
						})
						.expect(500);
				})
				.then(() => done())
				.catch(done);
		})

		it('should return 1 Missions by boundingShape with polygon times', function(done) {
			var query = {  sourceId: '123',
				boundingShapeType: 'Polygon',
				boundingShapeCoordinates: '[[[34.784518, 32.128957], [34.848031, 32.125534], [34.846299, 32.029153], [34.744677, 32.018383], [34.784518, 32.128957]]]'
			}
			prepareDataForPolygonTest()
				.then(() => getAndExpectMissionWithPolygonTimes(query))
				.then(done)
				.catch(done);
		})
	});
});

function prepareDataForPolygonTest() {
	return testUtils.insertVideoMetadata(testUtils.metadataPath)
		.then(testUtils.insertVideos(testUtils.videoPath))
		.then(testUtils.insertNewMission(testUtils.missionWithVideoPath))
		.catch(function(err) {
			if (err) {
				console.log(err);
				Promise.reject(err);
			}
		});
}

function getAndExpectMissionWithPolygonTimes(params) {
	return request(sails.hooks.http.app)
		.get(missionUrlFormat)
		.query(params)
		.set('Accept', 'application/json')
		.expect('Content-Type', /json/)
		.expect(200)
		.then((res) => {
			var jsonResult = JSON.parse(JSON.stringify(res.body));
			expect(jsonResult[0].videoCompartments[0].polygonTimes.toString()).not.to.have.lengthOf(0);
		});
}

function createMissions(amount) {
	var mission = {
		missionName: 'testMission',
		sourceId: '100',
		startTime: new Date(),
		endTime: addMinutes(new Date(), 10),
		destination: 'System 1',
		boundingPolygon: {
			type: 'Polygon',
			coordinates: [
				[
					[34.784518, 32.128957],
					[34.848031, 32.125534],
					[34.846299, 32.029153],
					[34.744677, 32.018383],
					[34.784518, 32.128957]
				]
			]
		}
	};

	var promises = [];
	for (var i = 0; i < amount; i++) {
		promises.push(Mission.create(mission));
	}
	return Promise.all(promises);
}

function getMissions() {
	return Mission.find();
}

function getAndExpectMissions(amount, params) {
	return request(sails.hooks.http.app)
		.get(missionUrlFormat)
		.query(params)
		.set('Accept', 'application/json')
		.expect('Content-Type', /json/)
		.expect(200)
		.then((res) => {
			expect(res.body).to.have.lengthOf(amount);
		});
}

function getMissionAndExpectError(done, params) {
	request(sails.hooks.http.app)
		.get(missionUrlFormat)
		.query(params)
		.set('Accept', 'application/json')
		.expect('Content-Type', /json/)
		.expect(500, done);
}

function updateMissionAndExpectOK(missionId, tag) {
	return request(sails.hooks.http.app)
		.put(util.format(missionUpdateUrlFormat, missionId))
		.send({ tag: tag })
		.expect(200);
}

function updateMissionAndExpectError(missionId, tag) {
	request(sails.hooks.http.app)
		.put(util.format(missionUpdateUrlFormat, missionId))
		.send({ tag: tag })
		.expect(500);
}

function createMissionQuery() {
	return {
		fromMissionTime: new Date(),
		toMissionTime: new Date(),
		minMissionDuration: 0,
		maxMissionDuration: 1000,
		copyright: 'test',
		minTraceHeight: 100,
		minTraceWidth: 100,
		minMinutesInsideShape: 10,
		sourceId: '100',
		tagsIds: '[]',
		boundingShapeCoordinates: '[[[1, 1], [2, 2], [3, 3], [1, 1]]]',
		boundingShapeType: 'Polygon'
	};
}

function validateTagUpdated(tag) {
	return Mission
		.find()
		.populate('tags')
		.then(function(missions) {
			expect(missions).to.be.lengthOf(1);
			expect(missions[0].tags[0].title).to.equal(tag);
		});
}

function addMinutes(date, minutes) {
	return new Date(date.getTime() + minutes * 60000);
}

function getTags() {
	return Tag.find({});
}
