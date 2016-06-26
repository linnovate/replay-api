/**
 * VideoController
 *
 * @description :: Server-side logic for managing videos
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

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
  }

};
