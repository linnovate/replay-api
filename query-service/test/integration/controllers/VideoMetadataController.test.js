var VideoMetadata = require('replay-schemas/VideoMetadata'),
    Video = require('replay-schemas/Video'),
    request = require('supertest-as-promised'),
    Promise = require('bluebird'),
    mongoose = require('mongoose'),
    util = require('util');

describe('VideoMetadataController', function () {

    describe('#find()', function () {
        var metadataStubsAmount = 3;
        it(util.format('should return all %s video metadatas', metadataStubsAmount), function (done) {
            var _videoId;
            createVideo()
                .then((video) => {
                    _videoId = video.id;
                    return createVideoMetadatas(_videoId, metadataStubsAmount);
                })
                .then(() => getAndExpectVideoMetadatas(_videoId, metadataStubsAmount))
                .then(done)
                .catch(done);
        });

        it('should return 0 video metadatas', function (done) {
            getAndExpectVideoMetadatas('notExistingVideoId', 0)
                .then(done)
                .catch(done);
        })
    });

    describe('#validateRequest()', function () {
        it('should reject due to bad videoId parameter (undefined)', function (done) {
            var videoId = undefined;
            getVideoMetadatasAndExpectError(done, videoId);
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

function getAndExpectVideoMetadatas(videoId, amount) {
    return request(sails.hooks.http.app)
        .get('/videometadata')
        .query({ videoId: videoId })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {
            expect(res.body).to.have.lengthOf(amount);
        });
}

function getVideoMetadatasAndExpectError(done, videoId) {
    request(sails.hooks.http.app)
        .get('/videometadata')
        .query({ videoId: videoId })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(500, done);
}