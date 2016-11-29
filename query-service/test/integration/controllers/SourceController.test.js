var StreamingSource = require('replay-schemas/StreamingSource'),
    request = require('supertest'),
    Promise = require('bluebird'),
    util = require('util');

var sourceUrl = '/source';

describe('SourceController', function () {
    describe('#find()', function () {
        var tagStubsAmount = 3;
        it(util.format('should return %s streaming sources', tagStubsAmount), function (done) {
            createStreamingSources(tagStubsAmount)
                .then(() => getAndExpectStreamingSources(tagStubsAmount))
                .then(done)
                .catch(done);
        });

        it('should return 0 queries', function (done) {
            getAndExpectStreamingSources(0)
                .then(done)
                .catch(done);
        })
    });

});

function createStreamingSources(amount) {
    var streamingSource = {
        sourceID: 100,
        sourceName: "VideoMuxedStream",
        sourceType: "VideoMuxedTelemetry",
        sourceIP: "238.0.0.1",
        sourcePort: 1234,
        streamingMethod: {
            standard: "VideoStandard",
            version: "1.0"
        },
        streamingStatus: "NONE"
    };

    var promises = [];
    for (var i = 0; i < amount; i++) {
        streamingSource.sourceID++;
        promises.push(StreamingSource.create(streamingSource));
    }
    return Promise.all(promises);
}

function getAndExpectStreamingSources(amount) {
    return request(sails.hooks.http.app)
        .get(sourceUrl)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {
            expect(res.body).to.have.lengthOf(amount);
        });
}