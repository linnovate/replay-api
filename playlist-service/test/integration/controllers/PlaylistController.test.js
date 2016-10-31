var Playlist = require('replay-schemas/Playlist'),
    request = require('supertest-as-promised'),
    Promise = require('bluebird'),
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
        })
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

    describe('#create() bad input tests', () => {
        it('should reject due to lack of name', done => {
            var playlist = {};
            createPlaylistAndExpectBadRequest(playlist, done);
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