var VideoCompartment = require('replay-schemas/VideoCompartment'),
    Tag = require('replay-schemas/Tag')
request = require('supertest-as-promised'),
    Promise = require('bluebird'),
    mongoose = require('mongoose'),
    util = require('util');

describe('VideoController', function () {
    describe('#find()', function () {
        var videoStubsAmount = 3;
        it(util.format('should return all %s videos', videoStubsAmount), function (done) {
            var query = {};
            createVideoCompartments(videoStubsAmount)
                .then(() => getAndExpectVideoCompartments(videoStubsAmount, query))
                .then(done)
                .catch(done);
        });

        it('should return 0 videos', function (done) {
            var query = {};
            getAndExpectVideoCompartments(0, query)
                .then(done)
                .catch(done);
        })

        it('should return 1 videoCompartments by fromVideoTime', function (done) {
            var query = { fromVideoTime: new Date('1970') }
            createVideoCompartments(1)
                .then(() => getAndExpectVideoCompartments(1, query))
                .then(done)
                .catch(done);
        })

        it('should return 0 videoCompartments by fromVideoTime', function (done) {
            var query = { fromVideoTime: new Date('9999') }
            createVideoCompartments(1)
                .then(() => getAndExpectVideoCompartments(0, query))
                .then(done)
                .catch(done);
        })

        it('should return 1 videoCompartments by toVideoTime', function (done) {
            var query = { toVideoTime: new Date('9999') }
            createVideoCompartments(1)
                .then(() => getAndExpectVideoCompartments(1, query))
                .then(done)
                .catch(done);
        })

        it('should return 0 videoCompartments by toVideoTime', function (done) {
            var query = { toVideoTime: new Date('1970') }
            createVideoCompartments(1)
                .then(() => getAndExpectVideoCompartments(0, query))
                .then(done)
                .catch(done);
        })

        it('should return 1 videoCompartments by minVideoDuration', function (done) {
            var query = { minVideoDuration: 1 }
            createVideoCompartments(1)
                .then(() => getAndExpectVideoCompartments(1, query))
                .then(done)
                .catch(done);
        })

        it('should return 0 videoCompartments by minVideoDuration', function (done) {
            var query = { minVideoDuration: 9999999 }
            createVideoCompartments(1)
                .then(() => getAndExpectVideoCompartments(0, query))
                .then(done)
                .catch(done);
        })

        it('should return 1 videoCompartments by maxVideoDuration', function (done) {
            var query = { maxVideoDuration: 9999999 }
            createVideoCompartments(1)
                .then(() => getAndExpectVideoCompartments(1, query))
                .then(done)
                .catch(done);
        })

        it('should return 0 videoCompartments by maxVideoDuration', function (done) {
            var query = { maxVideoDuration: 1 }
            createVideoCompartments(1)
                .then(() => getAndExpectVideoCompartments(0, query))
                .then(done)
                .catch(done);
        })

        it('should return 1 videoCompartments by sourceId', function (done) {
            var query = { sourceId: '100' }
            createVideoCompartments(1)
                .then(() => getAndExpectVideoCompartments(1, query))
                .then(done)
                .catch(done);
        })

        it('should return 0 videoCompartments by sourceId', function (done) {
            var query = { sourceId: 'someSourceId' }
            createVideoCompartments(1)
                .then(() => getAndExpectVideoCompartments(0, query))
                .then(done)
                .catch(done);
        })

        it('should return 1 videoCompartments by tagsIds', function (done) {
            var tag = 'test1';
            createVideoCompartments(1)
                .then(() => getVideoCompartments())
                .then((videos) => updateVideoAndExpectOK(videos[0].id, tag))
                .then(() => getTags())
                .then((tags) => {
                    var query = { tagsIds: JSON.stringify([tags[0].id]) }
                    return getAndExpectVideoCompartments(1, query);
                })
                .then(done)
                .catch(done);
        })

        it('should return 0 videoCompartments by tagsIds', function (done) {
            var tag = 'test1';
            createVideoCompartments(1)
                .then(() => getVideoCompartments())
                .then((videos) => updateVideoAndExpectOK(videos[0].id, tag))
                .then(() => getTags())
                .then((tags) => {
                    var query = { tagsIds: JSON.stringify([new mongoose.Types.ObjectId()]) }
                    return getAndExpectVideoCompartments(0, query);
                })
                .then(done)
                .catch(done);
        })

        it('should return 1 videoCompartments by boundingShape', function (done) {
            var query = {
                boundingShapeType: 'Polygon',
                boundingShapeCoordinates: '[[[34.784518, 32.128957], [34.848031, 32.125534], [34.846299, 32.029153], [34.744677, 32.018383], [34.784518, 32.128957]]]'
            }
            createVideoCompartments(1)
                .then(() => getAndExpectVideoCompartments(1, query))
                .then(done)
                .catch(done);
        })

        it('should return 0 videoCompartments by boundingShape', function (done) {
            var query = {
                boundingShapeType: 'Polygon',
                boundingShapeCoordinates: '[[[1,1], [2,2], [3,3], [1,1]]]'
            }
            createVideoCompartments(1)
                .then(() => getAndExpectVideoCompartments(0, query))
                .then(done)
                .catch(done);
        })
    });

    describe('#update()', function () {
        it('should update videoCompartments tag successfuly', function (done) {
            var tag = 'newTag'
            createVideoCompartments(1)
                .then(() => getVideoCompartments())
                .then((videos) => updateVideoAndExpectOK(videos[0].id, tag))
                .then(() => validateTagUpdated(tag))
                .then(done)
                .catch(done);
        })
    })

    describe('#find() bad input tests', function () {
        it('should reject due to bad fromVideoTime (not Date)', function (done) {
            var query = createVideoCompartmentQuery();
            query.fromVideoTime = 'test';
            getVideoCompartmentAndExpectError(done, query);
        })

        it('should reject due to bad toVideoTime (not Date)', function (done) {
            var query = createVideoCompartmentQuery();
            query.toVideoTime = 'test';
            getVideoCompartmentAndExpectError(done, query);
        })

        it('should reject due to bad minVideoDuration (not Number)', function (done) {
            var query = createVideoCompartmentQuery();
            query.minVideoDuration = 'test';
            getVideoCompartmentAndExpectError(done, query);
        })

        it('should reject due to bad maxVideoDuration (not Number)', function (done) {
            var query = createVideoCompartmentQuery();
            query.maxVideoDuration = 'test';
            getVideoCompartmentAndExpectError(done, query);
        })

        it('should reject due to bad boundingShapeType (boundingShapeCoordinates without boundingShapeType)', function (done) {
            var query = createVideoCompartmentQuery();
            query.boundingShapeType = undefined;
            getVideoCompartmentAndExpectError(done, query);
        })

        it('should reject due to bad boundingShapeCoordinates (boundingShapeType without boundingShapeCoordinates)', function (done) {
            var query = createVideoCompartmentQuery();
            query.boundingShapeCoordinates = undefined;
            getVideoCompartmentAndExpectError(done, query);
        })

        it('should reject due to bad tagsIds (not [mongoose.Types.ObjectId])', function (done) {
            var query = createVideoCompartmentQuery();
            query.tagsIds = '[someId]';
            getVideoCompartmentAndExpectError(done, query);
        })
    });

    describe('#update() bad input tests', function () {
        it('should reject due to empty update', function (done) {
            var tag = ''
            createVideoCompartments(1)
                .then(() => getVideoCompartments())
                .then((videos) => updateVideoCompartmentAndExpectError(videos[0].id, tag))
                .then(() => done())
                .catch(done);
        })

        it('should reject due to bad id (not mongoose.Types.ObjectId)', function (done) {
            var tag = 'newTag'
            createVideoCompartments(1)
                .then(() => getVideoCompartments())
                .then((videos) => updateVideoCompartmentAndExpectError('someNotExistingId', tag))
                .then(() => done())
                .catch(done);
        })

        it('should reject due to bad update property (not tag property)', function (done) {
            var tag = 'newTag'
            createVideoCompartments(1)
                .then(() => getVideoCompartments())
                .then((videos) => {
                    return request(sails.hooks.http.app)
                        .put(util.format('/video/%s', videos[0].id))
                        .send({
                            tag: tag,
                            sourceId: 'newSourceId'
                        })
                        .expect(500);
                })
                .then(() => done())
                .catch(done);
        })
    });
});

function createVideoCompartments(amount) {
    var videoCompartment = {
        sourceId: '100',
        videoFileName: 'test.mp4',
        contentDirectoryPath: '/',
        baseName: 'test',
        requestFormat: 'mp4',
        receivingMethod: {
            standard: 'VideoStandard',
            version: '1.0'
        },
        jobStatusId: 'someId',
        startTime: new Date(),
        endTime: addMinutes(new Date(), 10),
        status: 'ready',
        boundingPolygon: {
            type: 'Polygon',
            coordinates: [[[34.784518, 32.128957], [34.848031, 32.125534], [34.846299, 32.029153], [34.744677, 32.018383], [34.784518, 32.128957]]]
        }
    };

    var promises = [];
    for (var i = 0; i < amount; i++) {
        promises.push(VideoCompartment.create(videoCompartment));
    }
    return Promise.all(promises);
}

function getVideoCompartments() {
    return VideoCompartment.find();
}

function getAndExpectVideoCompartments(amount, params) {
    return request(sails.hooks.http.app)
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
        .then((res) => {
            expect(res.body).to.have.lengthOf(amount);
        });
}

function getVideoCompartmentAndExpectError(done, params) {
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

function updateVideoAndExpectOK(videoId, tag) {
    return request(sails.hooks.http.app)
        .put(util.format('/video/%s', videoId))
        .send({ tag: tag })
        .expect(200);
}

function updateVideoCompartmentAndExpectError(videoId, tag) {
    request(sails.hooks.http.app)
        .put(util.format('/video/%s', videoId))
        .send({ tag: tag })
        .expect(500);
}

function createVideoCompartmentQuery() {
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

function validateTagUpdated(tag) {
    return VideoCompartment
        .find()
        .populate('tags')
        .then(function (videos) {
            expect(videos).to.be.lengthOf(1);
            expect(videos[0].tags[0].title).to.equal(tag);
        });
}

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}

function getTags() {
    return Tag.find({});
}