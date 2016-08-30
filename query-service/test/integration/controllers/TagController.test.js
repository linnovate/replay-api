var Tag = require('replay-schemas/Tag'),
    request = require('supertest'),
    Promise = require('bluebird'),
    util = require('util');

describe('TagController', function () {

    describe('#find()', function () {
        var tagStubsAmount = 3;
        it(util.format('should return %s tags', tagStubsAmount), function (done) {
            createEmptyTags(tagStubsAmount)
                .then(() => getAndExpectTags(tagStubsAmount, done))
                .catch(done);
        });

        it('should return 0 tags', function (done) {
            getAndExpectTags(0, done);
        })
    });

});

function createEmptyTags(amount) {
    var tag = {
       title: 'test'
    };

    var promises = [];
    for (var i = 0; i < amount; i++) {
        tag.title = tag.title + i;
        promises.push(Tag.create(tag));
    }
    return Promise.all(promises);
}

function getAndExpectTags(amount, done) {
    request(sails.hooks.http.app)
        .get('/tag')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
            if (err) throw err;
            expect(res.body).to.have.lengthOf(amount);
            done();
        });
}