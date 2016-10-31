var Playlist = require('replay-schemas/Playlist'),
    Mission = require('replay-schemas/Mission'),
    request = require('supertest-as-promised'),
    Promise = require('bluebird'),
    mongoose = require('mongoose'),
    authorizationMock = require('replay-test-utils/authorization-mock');

describe('PlaylistController', () => {

    describe('#find()', () => {
        var tagStubsAmount = 3;
        it(`should return ${tagStubsAmount} playlists`, done => {
            createPlaylistsInMongo(tagStubsAmount)
                .then(() => getAndExpectPlaylists(tagStubsAmount))
                .then(done)
                .catch(done);
        });

        it('should return 0 playlists', done => {
            getAndExpectPlaylists(0)
                .then(done)
                .catch(done);
        });
    });

    describe('#create()', () => {
        it('should create a playlist', done => {
            var playlist = generatePlaylist();
            createAndExpectPlaylist(playlist)
                .then(() => validatePlaylistCreated(playlist))
                .then(() => done())
                .catch(done);
        });
    });

    

    describe('#update()', () => {
        it('should add a mission to playlist', done => {
            var _playlistId, _missionId;

            createPlaylistsInMongo(1)
                .then(playlists => {
                    _playlistId = playlists[0].id;
                    return createMissionInMongo();
                })
                .then(mission => {
                    _missionId = mission.id;
                    return addMissionToPlaylistAndExpect(_playlistId, _missionId);
                })
                .then(() => {
                    return validateMissionAddedToPlaylist(_playlistId, _missionId);
                })
                .then(() => done())
                .catch(done);
        });

        it('should remove a mission from playlist', done => {
            done();
        });
    });

    describe('#delete()', () => {
        it('should delete a playlist', done => {
            var _playlistId;
            
            createPlaylistsInMongo(1)
                .then(playlists => {
                    _playlistId = playlists[0].id;
                    return deleteAndExpectPlaylist(_playlistId);
                })
                .then(() => validatePlaylistDeleted(_playlistId))
                .then(() => done())
                .catch(done);
        });
    });

    describe('#create() bad input tests', () => {
        it('should reject due to lack of name', done => {
            var playlist = {};
            createPlaylistAndExpectBadRequest(playlist, done);
        });
    });

    describe('#delete() bad input tests', () => {
        it('should reject due to bad playlist id', done => {
            var playlistId = 'bad';
            deletePlaylistAndExpectBadRequest(playlistId, done);
        });
    });
});

function createPlaylistsInMongo(amount) {
    var playlist = generatePlaylist();

    var promises = [];
    for (var i = 0; i < amount; i++) {
        playlist.title = playlist.title + i;
        promises.push(Playlist.create(playlist));
    }
    return Promise.all(promises);
}

function createMissionInMongo() {
    var mission = {
        missionName: 'test',
        sourceId: '123',
        startTime: Date.now(),
        endTime: Date.now(),
        destination: 'System 1'
    };

    return Mission.create(mission);
}

function getAndExpectPlaylists(amount) {
    return request(sails.hooks.http.app)
        .get('/playlist')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {
            expect(res.body).to.have.lengthOf(amount);
        });
}

function generatePlaylist(){
    return {
        name: 'test',
        ownerId: authorizationMock.getUser().id
    };
}

function createAndExpectPlaylist(playlist) {
    return request(sails.hooks.http.app)
        .post('/playlist')
        .send(playlist)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);
}

function createPlaylistAndExpectBadRequest(playlist, done) {
    return request(sails.hooks.http.app)
        .post('/playlist')
        .send(playlist)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400, done);
}

function validatePlaylistCreated(playlist) {
    return Playlist.findOne(playlist)
        .then(playlist => {
            if(playlist) {
                return Promise.resolve();
            }
            
            return Promise.reject(new Error('Playlist was not found in mongo.'));
        })
}

function updatePlaylistAndExpect(playlistId) {
    var updateUrl = '/playlist/' + playlistId;

    return request(sails.hooks.http.app)
        .post(updateUrl)
        .set('Accept', 'application/json')
        .expect(200);
}

function addMissionToPlaylistAndExpect(playlistId, missionId) {
    var updateUrl = '/playlist/' + playlistId + '/mission/' + missionId;
    
    return request(sails.hooks.http.app)
        .put(updateUrl)
        .set('Accept', 'application/json')
        .expect(200);
}

function validateMissionAddedToPlaylist(playlistId, missionId) {
    return Playlist.findOne({_id:playlistId})
        .then(permission => {
            if(permission && permission.missions[0].toString() === missionId) {
                return Promise.resolve();
            }

            return Promise.reject(new Error('Mission was not added to playlist.'));
        });
}

function deleteAndExpectPlaylist(playlistId) {
    var deleteUrl = '/playlist/' + playlistId;

    return request(sails.hooks.http.app)
        .delete(deleteUrl)
        .set('Accept', 'application/json')
        .expect(200);
}

function deletePlaylistAndExpectBadRequest(playlistId, done) {
    var deleteUrl = '/playlist/' + playlistId;
   
    return request(sails.hooks.http.app)
        .delete(deleteUrl)
        .set('Accept', 'application/json')
        .expect(400, done);
}

function validatePlaylistDeleted(playlistId) {
    return Playlist.findOne({_id: playlistId})
        .then(playlist => {
            if(!playlist) {
                return Promise.resolve();
            }
            
            return Promise.reject(new Error('Playlist was in mongo.'));
        })
}