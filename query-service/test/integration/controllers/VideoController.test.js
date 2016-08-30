var Video = require('replay-schemas/Video'),
    request = require('supertest'),
    Promise = require('bluebird'),
    mongoose = require('mongoose'),
    util = require('util');

describe('VideoController', function () {

    // describe('#find()', function () {
    //     var metadataStubsAmount = 3;
    //     it(util.format('should return all %s video metadatas', metadataStubsAmount), function (done) {
    //         var _videoId;
    //         createVideo()
    //             .then((video) => {
    //                 _videoId = video.id;
    //                 return createVideoMetadatas(_videoId, metadataStubsAmount);
    //             })
    //             .then(() => getAndExpectVideoMetadatas(done, _videoId, metadataStubsAmount))
    //             .catch(done);
    //     });

    //     it('should return 0 video metadatas', function (done) {
    //         getAndExpectVideoMetadatas(done, 'notExistingVideoId', 0);
    //     })
    // });

    describe('#validateRequest()', function () {
        it('should reject due to bad boundingShapeType (boundingShapeCoordinates without boundingShapeType)', function () {
            var query = createQuery();
            query.boundingShapeType = undefined;
            getVideoAndExpectError(query);
        })

        it('should reject due to bad boundingShapeCoordinates (boundingShapeType without boundingShapeCoordinates)', function () {
            var query = createQuery();
            query.boundingShapeCoordinates = undefined;
            getVideoAndExpectError(query);
        })

        it('should reject due to bad tagsIds (not [string])', function () {
            var query = createQuery();
            query.tagsIds = '[]';
            getVideoAndExpectError(query);
        })

        it('should reject due to bad tagsIds (not [string])', function () {
            var query = createQuery();
            getVideoAndExpectError(query);
        })
    });
});

function createVideo() {
    var video = {
        _id: new mongoose.Types.ObjectId(),
        sourceId: '100',
        relativePath: 'test.mp4',
        name: 'test.mp4',
        receivingMethod: {
            standard: 'VideoStandard',
            version: '1.0'
        },
        jobStatusId: 'someId',
        startTime: new Date(),
        endTime: new Date()
    };

    return Video.create(video);
}

function createVideoMetadatas(videoId, amount) {
    var videoMetadata = {
        sourceId: '100',
        receivingMethod: {
            standard: 'VideoStandard',
            version: '1.0'
        },
        videoId: videoId
    };

    var promises = [];
    for (var i = 0; i < amount; i++) {
        promises.push(VideoMetadata.create(videoMetadata));
    }
    return Promise.all(promises);
}

function getAndExpectVideoMetadatas(done, videoId, amount) {
    request(sails.hooks.http.app)
        .get('/videometadata')
        .query({ videoId: videoId })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
            if (err) throw err;
            expect(res.body).to.have.lengthOf(amount);
            done();
        });
}

function getVideoAndExpectError(params) {
    request(sails.hooks.http.app)
        .get('/video')
        .query({ boundingShapeType: params.boundingShapeType })
        .query({ boundingShapeCoordinates: params.boundingShapeCoordinates })
        .query({ tagsIds: params.tagsIds })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(500);
}

function createQuery() {
    return {
        // fromVideoTime: new Date(),
        // toVideoTime: new Date(),
        // minVideoDuration: 0,
        // maxVideoDuration: 1000,
        // copyright: 'test',
        // minTraceHeight: 100,
        // minTraceWidth: 100,
        // minMinutesInsideShape: 10,
        // sourceId: '100',
        tagsIds: [],
        boundingShapeCoordinates: [[[1,1],[2,2],[3,3],[1,1]]],
        boundingShapeType: 'Polygon'
    };
}