var Video = require('replay-schemas/Video'),
    Tag = require('replay-schemas/Tag');

module.exports.buildMongoQuery = function (query) {
    // build the baseline of the query
    var mongoQuery = {
        $and: [
            { status: 'ready' }
        ]
    };

    // append the fields the user specified

    if (query.fromVideoTime) {
        mongoQuery.$and.push({
            startTime: { $gte: query.fromVideoTime }
        });
    }

    if (query.toVideoTime) {
        mongoQuery.$and.push({
            endTime: { $lte: query.toVideoTime }
        });
    }

    if (query.minVideoDuration) {
        mongoQuery.$and.push({
            durationInSeconds: { $gte: query.minVideoDuration }
        });
    }

    if (query.maxVideoDuration) {
        mongoQuery.$and.push({
            durationInSeconds: { $lte: query.maxVideoDuration }
        });
    }

    if (query.sourceId) {
        mongoQuery.$and.push({
            sourceId: query.sourceId
        });
    }

    if (query.tagsIds && query.tagsIds.length > 0) {
        mongoQuery.$and.push({
            tags: { $in: query.tagsIds }
        });
    }

    if (query.boundingShape) {
        mongoQuery.$and.push({
            boundingPolygon: { $geoIntersects: { $geometry: query.boundingShape } }
        });
    }

    // skip check of minimum width & height and minimum duration inside intersection


    // return the original query for later use, and the built mongo query
    return Promise.resolve(mongoQuery);
}

module.exports.performMongoQuery = function (mongoQuery) {
    console.log('Performing mongo query:', JSON.stringify(mongoQuery));

    return Video.find(mongoQuery).populate('tags');
}

module.exports.performUpdate = function (id, body) {
    var updateQuery = {};

    if (body.tag) {
        return findOrCreateTagByTitle(body.tag)
            .then(function (tag) {
                console.log('Find / Created tag:', tag.title);
                updateQuery.$addToSet = {
                    tags: tag._id
                };
                return updateVideo(id, updateQuery);
            });
    }

    // should never reach here as we currently allow only tag update, and abort if other updates occur
    return Promise.resolve();
}

// find a Tag with such title or create one if not exists.
function findOrCreateTagByTitle(title) {
    // upsert: create if not exist; new: return updated value
    return Tag.findOneAndUpdate({
        title: title
    }, {
            title: title
        }, {
            upsert: true,
            new: true
        });
}

function updateVideo(id, updateQuery) {
    console.log('Updating video by id', id, 'Update is:', updateQuery);
    return Video.findOneAndUpdate({
        _id: id
    }, updateQuery);
}
