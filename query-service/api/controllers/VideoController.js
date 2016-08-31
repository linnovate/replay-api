/**
 * VideoController
 *
 * @description :: Server-side logic for managing videos
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Promise = require('bluebird'),
    _ = require('lodash'),
    mongoose = require('mongoose'),
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
            .then(function (video) {
                if(video){
                    return res.ok();
                }
                else{
                    return res.notFound();
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
        }
        
        // validate id is a mongoose id
        if(req.params.id) {
            try {
                mongoose.Types.ObjectId(req.params.id);
            } catch(e) {
                return reject(new Error('Id provided is not in a correct format'));
            }
        } else {
            // here just for code completion; should not reach this function without id
            return reject(new Error('No id provided.'));
        }
        
        if (Object.keys(req.body).length !== 1 || !req.body.tag) {
            // allow update of specific fields only
            return reject(new Error('Update is not allowed for the specified fields.'));
        }

        resolve();
    });
}

