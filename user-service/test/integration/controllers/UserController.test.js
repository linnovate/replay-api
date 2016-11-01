var User = require('replay-schemas/User'),
    Mission = require('replay-schemas/Mission'),
    request = require('supertest-as-promised'),
    Promise = require('bluebird'),
    mongoose = require('mongoose'),
    util = require('util'),
    authorizationMock = require('replay-test-utils/authorization-mock');

var userFindOneUrlFormat = '/user/%s';

describe('UserController', () => {
    describe('#findOne()', () => {
        it('should find user', done => {
            getUserAndExpectOK()
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
            done();
        });

        it('should reject due to different user', done => {
            done();
        });
    });

    describe('#updateFavorite() bad input tests', () => {
        it('should reject due to bad user id', done => {
            done();
        });

        it('should reject due to bad mission id', done => {
            done();
        });
    });
});

function getUserAndExpectOK() {
    var userId = authorizationMock.getUser().id;
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