var Playlist = require('replay-schemas/Playlist');

module.exports.findPlaylistsByOwnerId = function(ownerId) {
	console.log('Finding playlists of ownerId:', ownerId);
	return Playlist.find({
		ownerId: ownerId
	}).populate('missions');
}

module.exports.createPlaylist = function(userId, name) {
	console.log('Creating playlist for userId: %s, with name: %s.', userId, name);
	return Playlist.create({
		name: name,
		ownerId: userId
	});
}

module.exports.updatePlaylistById = function(id, updateParams) {
	console.log('Updating playlist of id: %s with params: %s', id, JSON.stringify(updateParams));
	return Playlist.findOneAndUpdate({ _id: id }, updateParams);
}

module.exports.validateUserOwnsPlaylist = function(userId, playlistId) {
	console.log('Validating user owns the playlist...');

	return Playlist.findOne({_id: playlistId})
		.then(playlist => {
			if(playlist) {
				console.log('Found playlist:', JSON.stringify(playlist));
				if(playlist.ownerId === userId) {
					return Promise.resolve();
				}

				return Promise.reject(new Error(`User with id: ${userId} does not own playlist with id: ${playlist}`));
			}

			return Promise.reject(new Error(`Could not find playlist with id: ${playlistId}`));
		})
}

module.exports.deletePlaylist = function(id) {
	console.log('Deleting playlist with id:', id);
	return Playlist.findByIdAndRemove(id);
}