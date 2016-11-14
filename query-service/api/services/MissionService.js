var Mission = require('replay-schemas/Mission'),
    Tag = require('replay-schemas/Tag');

module.exports.buildMongoQuery = function (query, permissions) {
    // build the baseline of the query
    var mongoQuery = {
        $and: [
            Mission.buildPermissionsQueryCondition(permissions)
        ]
    };

    // append the fields the user specified

    if (query.fromMissionTime) {
        mongoQuery.$and.push({
            endTime: { $gte: query.fromMissionTime }
        });
    }

    if (query.toMissionTime) {
        mongoQuery.$and.push({
            startTime: { $lte: query.toMissionTime }
        });
    }

    if (query.minMissionDuration) {
        mongoQuery.$and.push({
            durationInSeconds: { $gte: query.minMissionDuration }
        });
    }

    if (query.maxMissionDuration) {
        mongoQuery.$and.push({
            durationInSeconds: { $lte: query.maxMissionDuration }
        });
    }

    if (query.sourceId) {
        mongoQuery.$and.push({
            sourceId: query.sourceId
        });
    }

    if (query.missionName) {
        mongoQuery.$and.push({
            missionName: query.missionName
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

module.exports.updateMission = function (id, permissions, body) {
    var updateParams = {};

    if (body.tag) {
        return findOrCreateTagByTitle(body.tag)
            .then(function (tag) {
                console.log('Found / Created tag:', tag.title);
                updateParams.$addToSet = {
                    tags: tag._id
                };

                var updateQuery = {
                    $and: [
                        Mission.buildPermissionsQueryCondition(permissions),
                        { _id: id }
                    ]
                }
                return updateMission(updateQuery, updateParams);
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

function updateMission(query, updateParams) {
    console.log('Update query:', JSON.stringify(query));
    console.log('Update params:', JSON.stringify(updateParams));
    return Mission.findOneAndUpdate(query, updateParams);
}
