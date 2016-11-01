var Query = require('replay-schemas/Query');

module.exports.saveQuery = function (userId, query) {
    var coordinates, tagsIds, boundingShape;

    // parse some specific fields if they exist
    if (query.boundingShapeCoordinates) {
        coordinates = JSON.parse(query.boundingShapeCoordinates);
    }

    if (query.tagsIds) {
        tagsIds = JSON.parse(query.tagsIds);
    }

    if (query.boundingShapeType && query.boundingShapeCoordinates) {
        var boundingShape = {
            type: query.boundingShapeType,
            coordinates: coordinates
        };
    }

    return Query.create({
        userId: userId,
        missionName: query.missionName,
        fromMissionTime: query.fromMissionTime,
        toMissionTime: query.toMissionTime,
        minMissionDuration: query.minMissionDuration,
        maxMissionDuration: query.maxMissionDuration,
        copyright: query.copyright,
        minTraceHeight: query.minTraceHeight,
        minTraceWidth: query.minTraceWidth,
        minMinutesInsideShape: query.minMinutesInsideShape,
        sourceId: query.sourceId,
        tagsIds: tagsIds,
        boundingShape: boundingShape
    });
}

module.exports.getQueries = function (userId, query) {
    var limitAmount = parseInt(query.limit);

    // fetch all queries and sort by descending order
    var mongoQuery = Query.find({ userId: userId }).sort({ createdAt: -1 });
    // if limitAmount is set, limit the amount returned.
    if (limitAmount) {
        mongoQuery = mongoQuery.limit(limitAmount);
    }
    return mongoQuery.exec();
}