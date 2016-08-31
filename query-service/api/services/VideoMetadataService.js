
var VideoMetadata = require('replay-schemas/VideoMetadata');

module.exports.getVideoMetadatas = function (query) {
    var videoId = query.videoId;

    // return video's metadatas sorted by descendent creation time
    return VideoMetadata.find({ videoId: videoId }).sort({ createdAt: -1 });
}
