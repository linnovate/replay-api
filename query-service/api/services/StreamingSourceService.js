var StreamingSource = require('replay-schemas/StreamingSource');

module.exports.getStreamingSources = function() {
    // return only relevant properties, sorted by ascending sourceName
	return StreamingSource.find({}).select('sourceID sourceName _id').sort({ sourceName: 1 });
}