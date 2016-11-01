var User = require('replay-schemas/User'),
    Mission = require('replay-schemas/Mission'),
    request = require('supertest-as-promised'),
    Promise = require('bluebird'),
    mongoose = require('mongoose'),
    util = require('util'),
    authorizationMock = require('replay-test-utils/authorization-mock');

var userFindOneUrlFormat = '/user/%s',
    userUpdateFavoriteFormat = '/user/%s/favorite/%s';

describe('UserController', () => {
    describe('#findOne()', () => {
        it('should find user', done => {
            var userId = authorizationMock.getUser().id;
            getUserAndExpectOK(userId)
                .then(done)
                .catch(done);
        });
    });

    describe('#updateFavorite()', () => {
        it('should add favorite mission to user', done => {
            done();
        });

        it('should remove favorite mission from user', done => {
            done();
        });
    });

    describe('#findOne() bad input tests', () => {
        it('should reject due to bad user id', done => {
            var userId = 'someId';
            getUserAndExpectErrorCode(400, userId, done);
        });

        it('should reject due to different user', done => {
            var userId = new mongoose.Types.ObjectId();
            getUserAndExpectErrorCode(403, userId, done);
        });
    });

    describe('#updateFavorite() bad input tests', () => {
        it('should reject due to bad user id', done => {
            var userId = 'someId';
            var missionId = new mongoose.Types.ObjectId();

            updateUserFavoriteAndExpectBadRequest(userId, missionId, done);
        });

        it('should reject due to bad mission id', done => {
            var userId = new mongoose.Types.ObjectId();
            var missionId = 'someId';

            updateUserFavoriteAndExpectBadRequest(userId, missionId, done);
        });
    });
});

function getUserAndExpectOK(userId) {
    var userUrl = util.format(userFindOneUrlFormat, userId);
    
    return request(sails.hooks.http.app)
        .get(userUrl)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {
            expect(res.body._id).to.have.equal(userId);
        });
}

function getUserAndExpectErrorCode(errCode, userId, done) {
    var userUrl = util.format(userFindOneUrlFormat, userId);
    
    return request(sails.hooks.http.app)
        .get(userUrl)
        .set('Accept', 'application/json')
        .expect(errCode, done);
}

function updateUserFavoriteAndExpectBadRequest(userId, missionId, done) {
    var userUrl = util.format(userUpdateFavoriteFormat, userId, missionId);
    
    return request(sails.hooks.http.app)
        .put(userUrl)
        .set('Accept', 'application/json')
        .expect(400, done);
}
