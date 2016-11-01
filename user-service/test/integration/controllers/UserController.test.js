var User = require('replay-schemas/User'),
    Mission = require('replay-schemas/Mission'),
    request = require('supertest-as-promised'),
    Promise = require('bluebird'),
    mongoose = require('mongoose'),
    authorizationMock = require('replay-test-utils/authorization-mock');

describe('UserController', () => {
    describe('#findOne()', () => {
        it('should find user', done => {
            done();
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