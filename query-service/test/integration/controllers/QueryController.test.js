var Query = require('replay-schemas/Query'),
    request = require('supertest'),
    Promise = require('bluebird'),
    util = require('util');

describe('QueryController', function () {

    describe('#find()', function () {
        var queryStubsAmount = 3;
        it(util.format('should return all %s queries without limit', queryStubsAmount), function (done) {
            createEmptyQueries(queryStubsAmount)
                .then(() => getAndExpectQueries(done, queryStubsAmount))
                .catch(done);
        });

        it('should return 0 queries without limit', function (done) {
            getAndExpectQueries(done, 0);
        })

        var limit = 1;
        it(util.format('should return all %s queries with limit', queryStubsAmount - limit), function (done) {
            createEmptyQueries(queryStubsAmount)
                .then(() => getAndExpectQueries(done, limit, limit))
                .catch(done);
        })
    });

});

function createEmptyQueries(amount) {
    var promises = [];
    for (var i = 0; i < amount; i++) {
        promises.push(Query.create({}));
    }
    return Promise.all(promises);
}

function getAndExpectQueries(done, amount, limit) {
    request(sails.hooks.http.app)
        .get('/query')
        .query({ limit: limit })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
            if (err) throw err;
            expect(res.body).to.have.lengthOf(amount);
            done();
        });
}