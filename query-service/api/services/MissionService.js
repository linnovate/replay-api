var Mission = require('replay-schemas/Mission'),
	Tag = require('replay-schemas/Tag')
VideoMetadata = require('replay-schemas/VideoMetadata');

module.exports.buildMongoQuery = function(query, permissions) {
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

module.exports.performMongoQuery = function(mongoQuery) {
	console.log('Performing mongo query:', JSON.stringify(mongoQuery));

	return Mission.find(mongoQuery).populate('tags');
}

module.exports.fillBoundingPolygonIntersectionTimes = function(query, results) {
	if (!query.boundingShape) {
		return Promise.resolve(results);
	} else {
		return prepareVideoIdsArray(results)
			.then(videos => getMissionTimesInPolygon(query, videos))
			.then(aggregation => {
				return joinResultsToEmbedded(
					results, 'videoId', 'videoCompartments',
					aggregation, '_id', 'polygonTimes');
			})
			.catch(function(err) {
				if (err) {
					Promise.reject(err);
				}
			});
	}
}

module.exports.updateMission = function(id, permissions, body) {
	var updateParams = {};

	if (body.tag) {
		return findOrCreateTagByTitle(body.tag)
			.then(function(tag) {
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

// Perform aggregation on the metadata collection to check
// the minimum and maximum time of video inside given polygon
function getMissionTimesInPolygon(mongoQuery, videos) {
	console.log('boundingShape ', mongoQuery.boundingShape);
	return VideoMetadata.aggregate([{
		$match: {
			$and: [{
				sensorTrace: {
					$geoIntersects: {
						$geometry: mongoQuery.boundingShape
					}
				}
			}, {
				videoId: { $in: videos }
			}]
		}
	}, {
		$group: {
			_id: "$videoId",
			polygonStartTime: { $min: "$timestamp" },
			polygonEndTime: { $max: "$timestamp" }
		}
	}]);
}

// help to merge the aggregation results with the missions json
// the join run a nested loop to find matches
// parameters: firstJson - the main result set
// firstKey - the field of the first json to compare
// secondJson - the second result set that will merge into the first documents
// secondKey - the field of the second json to compare
// newKey - the name of the nested field in the first json,
//			who holds the second json data according to the join match
function joinResultsToEmbedded(firstJson, firstKey, embeddedKey, secondJson, secondKey, newKey) {
	return new Promise(function(resolve, reject) {
		try {
			if (firstJson.length === 0 || secondJson.length === 0) {
				resolve(firstJson);
			} else {
				var results = [];
				var docProcessed = 0;
				var embeddedProcessed = 0;
				firstJson.forEach(function(document) {
					document = document.toObject();
					document[embeddedKey].forEach(function(embeddedDoc) {
						secondJson.every(function(element, index) {
							if (embeddedDoc[firstKey] == element[secondKey]) {
								embeddedDoc[newKey] = element;
								embeddedProcessed++;
								if (embeddedProcessed === document[embeddedKey].length) {
									docProcessed++;
									results.push(document);
									if (docProcessed === firstJson.length) {
										resolve(results);
									}
								}
								return false;
							} else {
								return true;
							}
						});
					});
				});
			}
		} catch (err) {
			if (err) {
				reject(err);
			}
		}
	});
}

function updateMission(query, updateParams) {
	console.log('Update query:', JSON.stringify(query));
	console.log('Update params:', JSON.stringify(updateParams));
	return Mission.findOneAndUpdate(query, updateParams);
}

function prepareVideoIdsArray(missions) {
	return new Promise(function(resolve, reject) {
		try {
			var ids = [];
			if (missions.length === 0) {
				resolve(ids);
			} else {
				var missionsProcessed = 0;
				var compartmentProcessed;
				missions.forEach(function(mission) {
					compartmentProcessed = 0;
					if (mission.videoCompartments.length === 0) {
						missionsProcessed++;
						if (missionsProcessed === missions.length) {
							resolve(ids);
						}
					} else {
						mission.videoCompartments.forEach(function(videoCompartment) {
							ids.push(videoCompartment.videoId.toString());
							compartmentProcessed++;
							if (compartmentProcessed === mission.videoCompartments.length) {
								missionsProcessed++;
								if (missionsProcessed === missions.length) {
									resolve(ids);
								}
							}
						});
					}
				});
			}
		} catch (err) {
			if (err) {
				reject(err);
			}
		}
	});
}
