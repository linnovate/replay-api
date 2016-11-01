var Query = require('replay-schemas/Query'),
    request = require('supertest'),
    Promise = require('bluebird'),
    authorizationMock = require('replay-test-utils/authorization-mock'),
    util = require('util');

describe('QueryController', function () {

    describe('#find()', function () {
        var queryStubsAmount = 3;
        it(util.format('should return all %s queries without limit', queryStubsAmount), function (done) {
            createEmptyQueries(queryStubsAmount)
                .then(() => getAndExpectQueries(queryStubsAmount))
                .then(done)
                .catch(done);
        });

        it('should return 0 queries without limit', function (done) {
            getAndExpectQueries(0)
                .then(done)
                .catch(done);
        })

        var limit = 1;
        it(util.format('should return all %s queries with limit', queryStubsAmount - limit), function (done) {
            createEmptyQueries(queryStubsAmount)
                .then(() => getAndExpectQueries(limit, limit))
                .then(done)
                .catch(done);
        })
    });

    describe('#validateRequest()', function () {
        it('should reject due to bad limit parameter (string)', function (done) {
            var limit = 'string';
            getQueriesAndExpectError(done, limit);
        })

        it('should reject due to bad limit parameter (negative)', function (done) {
            var limit = -1;
            getQueriesAndExpectError(done, limit);
        })
    });
});

function createEmptyQueries(amount) {
    var query = {
        userId: authorizationMock.getUser().id
    };

    var promises = [];
    for (var i = 0; i < amount; i++) {
        promises.push(Query.create(query));
    }
    return Promise.all(promises);
}

function getAndExpectQueries(amount, limit) {
    return request(sails.hooks.http.app)
        .get('/query')
        .query({ limit: limit })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {
            expect(res.body).to.have.lengthOf(amount);
        });
}

function getQueriesAndExpectError(done, limit) {
    request(sails.hooks.http.app)
        .get('/query')
        .query({ limit: limit })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(500, done);
}