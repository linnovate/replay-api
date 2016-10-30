var Playlist = require('replay-schemas/Playlist');

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

			return Promise.reject(new Error(`Could not found playlist with id: ${playlistId}`));
		})
}

module.exports.deletePlaylist = function(id) {
	return Playlist.findByIdAndRemove(id);
}