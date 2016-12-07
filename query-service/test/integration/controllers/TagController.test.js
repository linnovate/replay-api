var Tag = require('replay-schemas/Tag'),
    request = require('supertest-as-promised'),
    Promise = require('bluebird'),
    util = require('util');

var tagUrl = '/tag';

describe('TagController', function () {
    describe('#find()', function () {
        var tagStubsAmount = 3;
        it(util.format('should return %s tags', tagStubsAmount), function (done) {
            createTags(tagStubsAmount)
                .then(() => getAndExpectTags(tagStubsAmount))
                .then(done)
                .catch(done);
        });

        it('should return 0 tags', function (done) {
            getAndExpectTags(0)
                .then(done)
                .catch(done);
        })
    });

});

function createTags(amount) {
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

function getAndExpectTags(amount) {
    return request(sails.hooks.http.app)
        .get(tagUrl)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {
            expect(res.body).to.have.lengthOf(amount);
        });
}