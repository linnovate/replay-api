/**
 * VideoController
 *
 * @description :: Server-side logic for managing videos
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var _ = require('lodash');

module.exports = {
  find: function (req, res, next) {
    Video.find({}, function (err, videos) {
      if (err) next(err);

      res.ok(videos);
    });
  },

  findOne: function (req, res, next) {
    Video.findOne({id: req.params.id}, function (err, video) {
      if (err) next(err);

      res.ok(video);
    });
  },

  searchByDistance: function (req, res, next) {
    ElasticSearchService.searchByDistance(32.100981, 34.811919, '40km', function (searchRes) {
      res.ok(searchRes);
    })
  },

  searchByPolygon: function (req, res, next) {
    var polygon = JSON.parse(req.param('polygon'));
    ElasticSearchService.searchByPolygon(polygon, function (err, result) {
      console.log('searchByPolygon', JSON.stringify(result, null, 4));
      err ? res.send(err.status, { error: err.message }) : res.ok(result);
    });
  },

  getMovieLocations: function (req, res, next) {
    ElasticSearchService.search(sails.config.settings.elasticStreamIndex, "metadata", {}, function (err, result) {
      err ? res.send(err.status, { error: err.message }) : res.ok(_.map(result.hits.hits, '_source'));
    });
  },

  setStreamSamples: function (req, res, next) {
    ElasticSearchService.setStreamSamples(function () {
      res.ok();
    });
  }

};
