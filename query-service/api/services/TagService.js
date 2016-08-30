var Tag = require('replay-schemas/Tag');

module.exports.getTags = function() {
	return Tag.find({}).sort({ title: 1 });
}