var Playlist = require('replay-schemas/Playlist'),
	request = require('supertest-as-promised'),
	Promise = require('bluebird'),
	authorizationMock = require('replay-test-utils/authorization-mock');

describe('PlaylistController', () => {

	describe('#find()', () => {
		var tagStubsAmount = 3;
        it(`should return ${tagStubsAmount} playlists`, function (done) {
            createPlaylists(tagStubsAmount)
                .then(() => getAndExpectPlaylists(tagStubsAmount))
                .then(done)
                .catch(done);
        });

        it('should return 0 playlists', function (done) {
            getAndExpectPlaylists(0)
                .then(done)
                .catch(done);
        })
	});
});

function createPlaylists(amount) {
	var playlist = {
		name: 'test',
		ownerId: authorizationMock.getUser().id
	};

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