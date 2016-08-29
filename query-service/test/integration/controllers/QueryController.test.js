var Query = require('replay-schemas/Query'),
    request = require('supertest'),
    Promise = require('bluebird'),
    util = require('util');

describe('QueryController', function () {

    describe('#find()', function () {
        var queryStubsAmount = 3;
        it(util.format('should return %s queries', queryStubsAmount), function (done) {
            createEmptyQueries(queryStubsAmount)
                .then(() => getAndExpectQueries(queryStubsAmount, done))
        });

        it('should return 0 queries', function (done) {
            getAndExpectQueries(0, done);
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

function getAndExpectQueries(amount, done) {
    request(sails.hooks.http.app)
        .get('/query')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
            if (err) throw err;
            expect(res.body).to.have.lengthOf(amount);
            done();
        });
}