var Playlist = require('replay-schemas/Playlist');

module.exports.findPlaylists = function (ownerId) {
	console.log('Finding playlists of ownerId:', ownerId);
	return Playlist.find({
		ownerId: ownerId
	}).populate('missions');
}

function findPlaylistById(ownerId, playlistId, populate) {
	console.log('Finding playlist with id %s of ownerId %s', playlistId, ownerId);
  var playlistPromise = Playlist.findOne({ _id: playlistId, ownerId: ownerId });
  if(populate){
   playlistPromise = playlistPromise.populate('missions');
  }
  return playlistPromise;
}
module.exports.findPlaylistById = findPlaylistById;

module.exports.createPlaylist = function (userId, name) {
	console.log('Creating playlist for userId: %s, with name: %s.', userId, name);
	return Playlist.create({
		name: name,
		ownerId: userId
	});
}

module.exports.updatePlaylistById = function (id, updateParams) {
	console.log('Updating playlist of id: %s with params: %s', id, JSON.stringify(updateParams));
	return Playlist.findOneAndUpdate({ _id: id }, updateParams);
}

module.exports.validateUserOwnsPlaylist = function (userId, playlistId) {
	console.log('Validating user owns the playlist...');

	return findPlaylistById(userId, playlistId)
		.then(playlist => {
			if (playlist) {
				return Promise.resolve();
			}

			return Promise.reject(new Error(`Could not find playlist with id: ${playlistId}`));
		})
}

module.exports.deletePlaylist = function (id) {
	console.log('Deleting playlist with id:', id);
	return Playlist.findByIdAndRemove(id);
}
