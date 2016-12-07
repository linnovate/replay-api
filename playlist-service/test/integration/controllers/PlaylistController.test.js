var Playlist = require('replay-schemas/Playlist'),
    Mission = require('replay-schemas/Mission'),
    request = require('supertest-as-promised'),
    Promise = require('bluebird'),
    mongoose = require('mongoose'),
    util = require('util'),
    authorizationMock = require('replay-test-utils/authorization-mock');

var playlistUrl = '/playlist',
    playlistFindOneUrlFormat = '/playlist/%s',
    playlistUpdateUrlFormat = '/playlist/%s',
    playlistDeleteUrlFormat = '/playlist/%s',
    playlistUpdateMissionUrlFormat = '/playlist/%s/mission/%s';

describe('PlaylistController', () => {

    describe('#find()', () => {
        var tagStubsAmount = 3;
        it(`should return ${tagStubsAmount} playlists`, done => {
            createPlaylistsInMongo(tagStubsAmount)
                .then(() => getPlaylistsAndExpectOK(tagStubsAmount))
                .then(done)
                .catch(done);
        });

        it('should return 0 playlists', done => {
            getPlaylistsAndExpectOK(0)
                .then(done)
                .catch(done);
        });
    });

    describe('#findOne()', () => {
        it(`should return 1 playlist`, done => {
            createPlaylistsInMongo(1)
                .then(playlists => getPlaylistAndExpectOK(playlists[0].id))
                .then(done)
                .catch(done);
        });

        it('should return 404 due to no playlist', done => {
            findPlaylistAndExpectNotFound(done);
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
        it('should update playlist name', done => {
            var _playlistId;
            var _updateField = 'name';
            var _updateValue = 'newName';

            createPlaylistsInMongo(1)
                .then(playlists => {
                    _playlistId = playlists[0].id;
                    return updatePlaylistAndExpectOK(_playlistId, _updateField, _updateValue);
                })
                .then(() => {
                    return validatePlaylistUpdated(_playlistId, _updateField, _updateValue);
                })
                .then(() => done())
                .catch(done);
        });
    });

    describe('#updateMission()', () => {
        it('should add a mission to playlist', done => {
            var _playlistId, _missionId;

            createPlaylistsInMongo(1)
                .then(playlists => {
                    _playlistId = playlists[0].id;
                    return createMissionInMongo();
                })
                .then(mission => {
                    _missionId = mission.id;
                    return addMissionToPlaylistAndExpectOK(_playlistId, _missionId);
                })
                .then(() => {
                    return validateMissionAddedToPlaylist(_playlistId, _missionId);
                })
                .then(() => done())
                .catch(done);
        });

        it('should remove a mission from playlist', done => {
            var _playlistId, _missionId;

            createPlaylistsInMongo(1)
                .then(playlists => {
                    _playlistId = playlists[0].id;
                    return createMissionInMongo();
                })
                .then(mission => {
                    _missionId = mission.id;
                    return addMissionToPlaylistAndExpectOK(_playlistId, _missionId);
                })
                .then(() => {
                    return removeMissionFromPlaylistAndExpectOK(_playlistId, _missionId);
                })
                .then(() => {
                    return validateMissionRemovedFromPlaylist(_playlistId);
                })
                .then(() => done())
                .catch(done);
        });
    });

    describe('#delete()', () => {
        it('should delete a playlist', done => {
            var _playlistId;

            createPlaylistsInMongo(1)
                .then(playlists => {
                    _playlistId = playlists[0].id;
                    return deletePlaylistAndExpectOK(_playlistId);
                })
                .then(() => validatePlaylistDeleted(_playlistId))
                .then(() => done())
                .catch(done);
        });
    });

    describe('#findOne() bad input tests', () => {
        it('should reject due to lack of id', done => {
            findPlaylistAndExpectBadRequest(done);
        });
    });

    describe('#create() bad input tests', () => {
        it('should reject due to lack of name', done => {
            var playlist = {};
            createPlaylistAndExpectBadRequest(playlist, done);
        });
    });

    describe('#update() bad input tests', () => {
        it('should reject due to lack of name', done => {
            var updateParams = { name: undefined };
            createPlaylistsInMongo(1)
                .then(playlists => updatePlaylistAndExpectBadRequest(playlists[0].id, updateParams))
                .then(() => done())
                .catch(done);
        });

        it('should reject due to bad playlist id', done => {
            var updateParams = { name: 'someName' };
            var id = 'someId';

            updatePlaylistAndExpectBadRequest(id, updateParams)
                .then(() => done())
                .catch(done);
        });
    });

    describe('#updateMission() bad input tests', () => {
        it('should reject due to bad playlist id', done => {
            var _playlistId = 'someId';
            var _missionId = new mongoose.Types.ObjectId();

            updatePlaylistMissionAndExpectBadRequest(_playlistId, _missionId, done);
        });

        it('should reject due to bad mission id', done => {
            var _playlistId = new mongoose.Types.ObjectId();
            var _missionId = 'someId';

            updatePlaylistMissionAndExpectBadRequest(_playlistId, _missionId, done);
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

function getPlaylistsAndExpectOK(amount) {
    return request(sails.hooks.http.app)
        .get(playlistUrl)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {
            expect(res.body).to.have.lengthOf(amount);
        });
}

function getPlaylistAndExpectOK(id) {
    var playlistFindOneUrl = util.format(playlistFindOneUrlFormat, id);

    return request(sails.hooks.http.app)
        .get(playlistFindOneUrl)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {
            expect(res.body).to.have.property('_id');
            expect(res.body._id).to.equal(id);
        });
}

function generatePlaylist() {
    return {
        name: 'test',
        ownerId: authorizationMock.getUser().id
    };
}

function findPlaylistAndExpectNotFound(done) {
    var playlistFindOneUrl = util.format(playlistFindOneUrlFormat, new mongoose.Types.ObjectId());
    
    return request(sails.hooks.http.app)
        .get(playlistFindOneUrl)
        .set('Accept', 'application/json')
        .expect(404, done);
}

function findPlaylistAndExpectBadRequest(done) {
    var playlistFindOneUrl = util.format(playlistFindOneUrlFormat, 'someNotExistedId');
    
    return request(sails.hooks.http.app)
        .get(playlistFindOneUrl)
        .set('Accept', 'application/json')
        .expect(400, done);
}

function createAndExpectPlaylist(playlist) {
    return request(sails.hooks.http.app)
        .post(playlistUrl)
        .send(playlist)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);
}

function createPlaylistAndExpectBadRequest(playlist, done) {
    return request(sails.hooks.http.app)
        .post(playlistUrl)
        .send(playlist)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400, done);
}

function validatePlaylistCreated(playlist) {
    return Playlist.findOne(playlist)
        .then(playlist => {
            if (playlist) {
                return Promise.resolve();
            }

            return Promise.reject(new Error('Playlist was not found in mongo.'));
        })
}

function updatePlaylistAndExpectOK(playlistId, field, value) {
    var updateUrl = util.format(playlistUpdateUrlFormat, playlistId);
    var updateParams = {};
    updateParams[field] = value;

    return request(sails.hooks.http.app)
        .put(updateUrl)
        .send(updateParams)
        .set('Accept', 'application/json')
        .expect(200);
}

function updatePlaylistAndExpectBadRequest(playlistId, updateParams) {
    var updateUrl = util.format(playlistUpdateUrlFormat, playlistId);

    return request(sails.hooks.http.app)
        .put(updateUrl)
        .send(updateParams)
        .set('Accept', 'application/json')
        .expect(400);
}

function updatePlaylistMissionAndExpectBadRequest(playlistId, missionId, done) {
    var updateUrl = util.format(playlistUpdateMissionUrlFormat, playlistId, missionId);

    return request(sails.hooks.http.app)
        .put(updateUrl)
        .set('Accept', 'application/json')
        .expect(400, done);
}

function validatePlaylistUpdated(playlistId, field, value) {
    return Playlist.findOne({ _id: playlistId })
        .then(playlist => {
            if (playlist && playlist[field] === value) {
                return Promise.resolve();
            }

            return Promise.reject(new Error(`Playlist field: ${field} did not update to value: ${value}.`));
        });
}

function addMissionToPlaylistAndExpectOK(playlistId, missionId) {
    var updateUrl = util.format(playlistUpdateMissionUrlFormat, playlistId, missionId);

    return request(sails.hooks.http.app)
        .put(updateUrl)
        .set('Accept', 'application/json')
        .expect(200);
}

function validateMissionAddedToPlaylist(playlistId, missionId) {
    return Playlist.findOne({ _id: playlistId })
        .then(permission => {
            if (permission && permission.missions[0].toString() === missionId) {
                return Promise.resolve();
            }

            return Promise.reject(new Error('Mission was not added to playlist.'));
        });
}

function removeMissionFromPlaylistAndExpectOK(playlistId, missionId) {
    var updateUrl = util.format(playlistUpdateMissionUrlFormat, playlistId, missionId);

    return request(sails.hooks.http.app)
        .delete(updateUrl)
        .set('Accept', 'application/json')
        .expect(200);
}

function validateMissionRemovedFromPlaylist(playlistId) {
    return Playlist.findOne({ _id: playlistId })
        .then(permission => {
            if (permission && permission.missions.length === 0) {
                return Promise.resolve();
            }

            return Promise.reject(new Error('Mission was not added to playlist.'));
        });
}

function deletePlaylistAndExpectOK(playlistId) {
    var deleteUrl = util.format(playlistDeleteUrlFormat, playlistId);

    return request(sails.hooks.http.app)
        .delete(deleteUrl)
        .set('Accept', 'application/json')
        .expect(200);
}

function deletePlaylistAndExpectBadRequest(playlistId, done) {
    var deleteUrl = util.format(playlistDeleteUrlFormat, playlistId);

    return request(sails.hooks.http.app)
        .delete(deleteUrl)
        .set('Accept', 'application/json')
        .expect(400, done);
}

function validatePlaylistDeleted(playlistId) {
    return Playlist.findOne({ _id: playlistId })
        .then(playlist => {
            if (!playlist) {
                return Promise.resolve();
            }

            return Promise.reject(new Error('Playlist was in mongo.'));
        })
}