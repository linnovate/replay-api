var Video = require('replay-schemas/Video'),
    request = require('supertest'),
    Promise = require('bluebird'),
    mongoose = require('mongoose'),
    util = require('util');

describe('VideoController', function () {
    describe('#find()', function () {
        var videoStubsAmount = 3;
        it(util.format('should return all %s videos', videoStubsAmount), function (done) {
            var query = {};
            createVideos(videoStubsAmount)
                .then(() => getAndExpectVideos(done, videoStubsAmount, query))
                .catch(done);
        });

        it('should return 0 videos', function (done) {
            var query = {};
            getAndExpectVideos(done, 0, query);
        })
    });

    describe('bad input tests', function () {
        it('should reject due to bad fromVideoTime (not Date)', function (done) {
            var query = createVideoQuery();
            query.fromVideoTime = 'test';
            getVideoAndExpectError(done, query);
        })

        it('should reject due to bad toVideoTime (not Date)', function (done) {
            var query = createVideoQuery();
            query.toVideoTime = 'test';
            getVideoAndExpectError(done, query);
        })

        it('should reject due to bad minVideoDuration (not Number)', function (done) {
            var query = createVideoQuery();
            query.minVideoDuration = 'test';
            getVideoAndExpectError(done, query);
        })

        it('should reject due to bad maxVideoDuration (not Number)', function (done) {
            var query = createVideoQuery();
            query.maxVideoDuration = 'test';
            getVideoAndExpectError(done, query);
        })

        it('should reject due to bad boundingShapeType (boundingShapeCoordinates without boundingShapeType)', function (done) {
            var query = createVideoQuery();
            query.boundingShapeType = undefined;
            getVideoAndExpectError(done, query);
        })

        it('should reject due to bad boundingShapeCoordinates (boundingShapeType without boundingShapeCoordinates)', function (done) {
            var query = createVideoQuery();
            query.boundingShapeCoordinates = undefined;
            getVideoAndExpectError(done, query);
        })

        it('should reject due to bad tagsIds (not [String])', function (done) {
            var query = createVideoQuery();
            query.tagsIds = 'test';
            getVideoAndExpectError(done, query);
        })
    });
});

function createVideos(amount) {
    var video = {
        sourceId: '100',
        relativePath: 'test.mp4',
        name: 'test.mp4',
        receivingMethod: {
            standard: 'VideoStandard',
            version: '1.0'
        },
        jobStatusId: 'someId',
        startTime: new Date(),
        endTime: new Date(),
        status: 'ready'
    };

    var promises = [];
    for (var i = 0; i < amount; i++) {
        promises.push(Video.create(video));
    }
    return Promise.all(promises);
}

function getAndExpectVideos(done, amount, params) {
    request(sails.hooks.http.app)
        .get('/video')
        .query({ fromVideoTime: params.fromVideoTime })
        .query({ toVideoTime: params.toVideoTime })
        .query({ minVideoDuration: params.minVideoDuration })
        .query({ maxVideoDuration: params.maxVideoDuration })
        .query({ sourceId: params.sourceId })
        .query({ boundingShapeType: params.boundingShapeType })
        .query({ boundingShapeCoordinates: params.boundingShapeCoordinates })
        .query({ tagsIds: params.tagsIds })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
            if (err) throw err;
            expect(res.body).to.have.lengthOf(amount);
            done();
        });
}

function getVideoAndExpectError(done, params) {
    request(sails.hooks.http.app)
        .get('/video')
        .query({ fromVideoTime: params.fromVideoTime })
        .query({ toVideoTime: params.toVideoTime })
        .query({ minVideoDuration: params.minVideoDuration })
        .query({ maxVideoDuration: params.maxVideoDuration })
        .query({ sourceId: params.sourceId })
        .query({ boundingShapeType: params.boundingShapeType })
        .query({ boundingShapeCoordinates: params.boundingShapeCoordinates })
        .query({ tagsIds: params.tagsIds })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(500, done);
}

function createVideoQuery() {
    return {
        fromVideoTime: new Date(),
        toVideoTime: new Date(),
        minVideoDuration: 0,
        maxVideoDuration: 1000,
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