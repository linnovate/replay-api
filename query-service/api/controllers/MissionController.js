/**
 * MissionController
 *
 * @description :: Server-side logic for managing Missions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Promise = require('bluebird'),
    _ = require('lodash'),
    mongoose = require('mongoose'),
    Query = require('replay-schemas/Query'),
    Mission = require('replay-schemas/Mission'),
    Tag = require('replay-schemas/Tag');

module.exports = {

    // validates request, saves the query, fetches permissions of user,
    // and then building and performing a mongo query.
    // at last, it returns the mission results.
    find: function (req, res, next) {
        console.log('In mission controller');
        var _parsedQuery;
        validateFindRequest(req)
            .then(() => QueryService.saveQuery(req.query))
            .then(query => {
                _parsedQuery = query;
                return PermissionsService.findPermissionsByUserId(req.userId);
            })
            .then(permissions => {
                return MissionService.buildMongoQuery(_parsedQuery, permissions);
            })
            .then(MissionService.performMongoQuery)
            .then(function (results) {
                return res.json(results);
            })
            .catch(function (err) {
                return res.serverError(err);
            });
    },

    // validates request, fetches permissions of user, and then performing the update
    // and returns HTTP 200.
    update: function (req, res, next) {
        validateUpdateRequest(req)
            .then(() => PermissionsService.findPermissionsByUserId(req.userId))
            .then(permissions => MissionService.updateMission(req.params.id, permissions, req.body))
            .then(mission => {
                if (mission) {
                    return res.ok();
                }
                else {
                    return res.badRequest('No such mission was found.');
                }
            })
            .catch(function (err) {
                return res.serverError(err);
            });
    }
};

function validateFindRequest(req) {
    return new Promise(function (resolve, reject) {
        // validate we get both boundingShapeType and boundingShapeCoordinates
        if ((req.query.boundingShapeType || req.query.boundingShapeCoordinates) &&
            !(req.query.boundingShapeType && req.query.boundingShapeCoordinates)) {
            return reject(new Error('boundingShapeType and boundingShapeCoordinates must be provided together.'));
        }

        // validate boundingShapeCoordinates is JSON parsable (since the array would be passed as string)
        if (req.query.boundingShapeCoordinates) {
            try {
                JSON.parse(req.query.boundingShapeCoordinates);
            } catch (e) {
                return reject(new Error('boundingShapeCoordinates is not parsable.'));
            }
        }

        if (req.query.tagsIds) {
            try {
                var tagsIds = JSON.parse(req.query.tagsIds);
                tagsIds.forEach(function (tagId) {
                    mongoose.Types.ObjectId(tagId);
                });
            } catch (e) {
                return reject(new Error('tagsIds is not array of ids.'));
            }
        }

        resolve();
    });
}

function validateUpdateRequest(req) {
    return new Promise(function (resolve, reject) {
        // make sure we have at least one attribute
        if (!req.query) {
            return reject(new Error('Empty update is not allowed.'));
        }

        // validate id is a mongoose id
        if (req.params.id) {
            try {
                mongoose.Types.ObjectId(req.params.id);
            } catch (e) {
                return reject(new Error('Id provided is not in a correct format'));
            }
        } else {
            // here just for code completion; should not reach this function without id
            return reject(new Error('No id provided.'));
        }

        // validate there is request body
        if (!req.body) {
            return reject(new Error('No request body was found.'));
        }

        if (Object.keys(req.body).length !== 1 || !req.body.tag) {
            // allow update of specific fields only
            return reject(new Error('Update is not allowed for the specified fields.'));
        }

        resolve();
    });
}

