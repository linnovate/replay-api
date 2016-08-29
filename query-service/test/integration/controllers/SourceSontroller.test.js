var StreamingSource = require('replay-schemas/StreamingSource'),
    request = require('supertest'),
    Promise = require('bluebird'),
    util = require('util');

describe('SourceController', function () {

    describe('#find()', function () {
        var queryStubsAmount = 3;
        it(util.format('should return %s streaming sources', queryStubsAmount), function (done) {
            createEmptyStreamingSources(queryStubsAmount)
                .then(() => getAndExpectStreamingSources(queryStubsAmount, done))
                .catch(done);
        });

        it('should return 0 queries', function (done) {
            getAndExpectStreamingSources(0, done);
        })
    });

});

function createEmptyStreamingSources(amount) {
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

function getAndExpectStreamingSources(amount, done) {
    request(sails.hooks.http.app)
        .get('/source')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
            if (err) throw err;
            expect(res.body).to.have.lengthOf(amount);
            done();
        });
}