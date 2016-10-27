var Mission = require('replay-schemas/Mission'),
    VideoCompartment = require('replay-schemas/VideoCompartment'),
    Tag = require('replay-schemas/Tag');

module.exports.buildMongoQuery = function (query, permissions) {
    // build the baseline of the query
    var mongoQuery = {
        $and: [
            VideoCompartment.buildQueryCondition(permissions)
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
            duration: { $gte: query.minVideoDuration }
        });
    }

    if (query.maxVideoDuration) {
        mongoQuery.$and.push({
            duration: { $lte: query.maxVideoDuration }
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

    return Mission.find(mongoQuery).populate('tags');
}

module.exports.performUpdate = function (id, body) {
    var updateQuery = {};

    if (body.tag) {
        return findOrCreateTagByTitle(body.tag)
            .then(function (tag) {
                console.log('Found / Created tag:', tag.title);
                updateQuery.$addToSet = {
                    tags: tag._id
                };
                return updateMission(id, updateQuery);
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

function updateMission(id, updateQuery) {
    console.log('Updating mission:', id);
    console.log('Update query:', updateQuery);
    return Mission.findOneAndUpdate({
        _id: id
    }, updateQuery);
}
