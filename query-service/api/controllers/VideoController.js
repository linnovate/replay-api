/**
 * VideoController
 *
 * @description :: Server-side logic for managing videos
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Promise = require('bluebird'),
    _ = require('lodash'),
    Query = require('replay-schemas/Query'),
    Video = require('replay-schemas/Video'),
    Tag = require('replay-schemas/Tag');

// trick sails to activate restful API to this controller
sails.models.video = {};

module.exports = {

    find: function (req, res, next) {
        validateFindRequest(req)
            .then(() => QueryService.saveQuery(req.query))
            .then(VideoService.buildMongoQuery)
            .then(VideoService.performMongoQuery)
            .then(function (results) {
                return res.json(results);
            })
            .catch(function (err) {
                return res.serverError(err);
            });
    },

    update: function (req, res, next) {
        validateUpdateRequest(req)
            .then(() => VideoService.performUpdate(req.params.id, req.body))
            .then(function () {
                return res.ok();
            })
            .catch(function (err) {
                return res.serverError(err);
            });
    }
};

function validateFindRequest(req) {
    return new Promise(function (resolve, reject) {
        // make sure we have at least one attribute
        if (!req.query) {
            return reject(new Error('Empty query is not allowed.'));
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
                JSON.parse(req.query.tagsIds);
            } catch (e) {
                return reject(new Error('tagsIds is not parsable.'));
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
        } else if (req.query && Object.keys(req.body).length === 1 && req.body.tag) {
            // allow update of specific fields only
            return resolve();
        }

        reject(new Error('Update is not allowed for the specified fields.'));
    });
}

