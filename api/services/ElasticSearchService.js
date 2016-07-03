var elasticsearch = require('elasticsearch');
var async = require('async');
var _ = require('lodash');

var client = new elasticsearch.Client({
  host: sails.config.settings.host + ':9200',
  log: null
});

//console.log('elastic: ', sails.config.settings.host + ':9200');

module.exports = {
  search: function (index, type, body, callback) {
    client.search({
      index: index || "*",
      type: type,
      body: body
    }, callback);
  },

  searchByDistance: function (latitude, longitude, distance, callback) {
    var query = {};
    query.filter = {};
    query.filter.geo_distance = {};
    query.filter.geo_distance.locations = {};
    query.filter.geo_distance.distance = distance;
    query.filter.geo_distance.locations.lat = latitude;
    query.filter.geo_distance.locations.lon = longitude;
    this.search(null, "metadata", query, function (resp) {
      callback(resp.hits.hits);
    });
  },

  searchByPolygon: function (polygon, callback) {
    var query = {
      "query": {
        "filtered": {
          "query": {
            "match_all": {}
          },
          "filter": {
            "geo_polygon": {
              "locations": {
                "points": polygon
              }
            }
          }
        }
      }
    };

    console.log('searchByPolygon', JSON.stringify(query, null, 4));
    this.search(sails.config.settings.elasticStreamIndex, "metadata", query, function (err, result) {
      err ? callback(err, result) : callback(err, _.map(result.hits.hits, '_source'));
    });
  },

  setStreamSamples: function (callback) {
    var indexName = sails.config.settings.elasticStreamIndex;

    async.waterfall([
      function(callback) {
        client.indices.delete({
          index: indexName,
          ignore: [404]
        }).then(function (body) {
          console.log('delete', JSON.stringify(body, null, 4));
          callback(null, body);
        }, function (error) {
          console.log('error delete', JSON.stringify(error, null, 4));
        });
      },
      function(body, callback) {
        client.indices.create({
          index: indexName,
          body: {
            mappings: {
              metadata: {
                properties: {
                  name: { type: "string" },
                  locations: { type: "geo_point" }
                }
              }
            }
          }
        }).then(function (body) {
          console.log('create', JSON.stringify(body, null, 4));
          callback(null, body);
        }, function (error) {
          console.log('error create', JSON.stringify(error, null, 4));
        });
      },
      function(body, callback) {
        client.create({
          index: indexName,
          type: 'metadata',
          id: '1',
          body: {
            name: 'Tel-aviv video 1',
            locations: [
              {
                "lon": 34.770162105560296,
                "lat": 32.085410709650304
              },
              {
                "lon": 34.77247953414917,
                "lat": 32.08482894244514
              },
              {
                "lon": 34.771084785461426,
                "lat": 32.08230184816697
              },
              {
                "lon": 34.77391719818115,
                "lat": 32.08173824207193
              },
              {
                "lon": 34.776062965393066,
                "lat": 32.083338147078095
              },
              {
                "lon": 34.7796893119812,
                "lat": 32.08152007103763
              },
              {
                "lon": 34.780097007751465,
                "lat": 32.080592838332066
              },
              {
                "lon": 34.780097007751465,
                "lat": 32.07944742023902
              },
              {
                "lon": 34.773831367492676,
                "lat": 32.079720140134455
              },
              {
                "lon": 34.7697114944458,
                "lat": 32.079865590412666
              }
            ]
          }
        }, function (error, response) {
          callback(null, error, response);
        });
      },
      function(pError, pResponse, callback) {
        client.create({
          index: indexName,
          type: 'metadata',
          id: '2',
          body: {
            name: 'Tel-aviv video 2',
            locations: [
              {
                "lon": 34.818313121795654,
                "lat": 32.03338245379325
              },
              {
                "lon": 34.81919288635254,
                "lat": 32.03390997706001
              },
              {
                "lon": 34.82011556625366,
                "lat": 32.03356435871129
              },
              {
                "lon": 34.82097387313842,
                "lat": 32.033127786300994
              },
              {
                "lon": 34.82191801071167,
                "lat": 32.03218187227192
              },
              {
                "lon": 34.8230767250061,
                "lat": 32.031909010640135
              },
              {
                "lon": 34.82348442077637,
                "lat": 32.030653836662495
              },
              {
                "lon": 34.82311964035034,
                "lat": 32.02974427955243
              },
              {
                "lon": 34.822068214416504,
                "lat": 32.03089032003148
              },
              {
                "lon": 34.82213258743286,
                "lat": 32.03034458825858
              },
              {
                "lon": 34.82249736785889,
                "lat": 32.02961694083619
              },
              {
                "lon": 34.82311964035034,
                "lat": 32.02823439480669
              },
              {
                "lon": 34.822540283203125,
                "lat": 32.026960978684954
              },
              {
                "lon": 34.82033014297485,
                "lat": 32.0281070539912
              },
              {
                "lon": 34.82013702392578,
                "lat": 32.02905301010748
              },
              {
                "lon": 34.81917142868042,
                "lat": 32.03034458825858
              },
              {
                "lon": 34.81895685195923,
                "lat": 32.03103584795505
              },
              {
                "lon": 34.818785190582275,
                "lat": 32.031945392238015
              }
            ]
          }
        }, function (error, response) {
          callback(null, error, response);
        });
      },
      function(pError, pResponse, callback) {
        client.create({
          index: indexName,
          type: 'metadata',
          id: '3',
          body: {
            name: 'Tel-aviv video 3',
            locations: [
              {
                "lon": 34.78666305541992,
                "lat": 32.09079188072853
              },
              {
                "lon": 34.79524612426758,
                "lat": 32.09122817800835
              },
              {
                "lon": 34.79576110839844,
                "lat": 32.0879558976284
              },
              {
                "lon": 34.795160293579094,
                "lat": 32.08577431227288
              },
              {
                "lon": 34.791555404663086,
                "lat": 32.086465153270275
              },
              {
                "lon": 34.78953838348389,
                "lat": 32.08566523163801
              },
              {
                "lon": 34.78919506072998,
                "lat": 32.08370175794645
              },
              {
                "lon": 34.78589057922363,
                "lat": 32.08431989310267
              }
            ]
          }
        }, function (error, response) {
          callback(null, error, response);
        });
      },
      function(pError, pResponse, callback) {
        client.create({
          index: indexName,
          type: 'metadata',
          id: '4',
          body: {
            name: 'Tel-aviv video 4',
            locations: [
              {
                "lon": 34.78288650512695,
                "lat": 32.06955622888426
              },
              {
                "lon": 34.78752136230469,
                "lat": 32.06919256174995
              },
              {
                "lon": 34.783637523651116,
                "lat": 32.06617406871815
              }
            ]
          }
        }, function (error, response) {
          callback(null, error, response);
        });
      },
      function(pError, pResponse, callback) {
        client.create({
          index: indexName,
          type: 'metadata',
          id: '5',
          body: {
            name: 'Tel-aviv video 5',
            locations: [
              {
                "lon": 34.77902412414551,
                "lat": 32.057263478112894
              },
              {
                "lon": 34.78447437286377,
                "lat": 32.05919114883896
              },
              {
                "lon": 34.79726314544678,
                "lat": 32.05919114883896
              },
              {
                "lon": 34.79691982269287,
                "lat": 32.056717903551835
              },
              {
                "lon": 34.79176998138428,
                "lat": 32.05686339041955
              },
              {
                "lon": 34.79142665863037,
                "lat": 32.05428096412614
              },
              {
                "lon": 34.78550434112549,
                "lat": 32.0543173368335
              },
              {
                "lon": 34.78262901306152,
                "lat": 32.05522664981892
              },
              {
                "lon": 34.781813621520996,
                "lat": 32.053553506942144
              },
              {
                "lon": 34.77679252624512,
                "lat": 32.05424459140428
              },
              {
                "lon": 34.77529048919678,
                "lat": 32.05493567064681
              },
              {
                "lon": 34.77717876434326,
                "lat": 32.057590821287896
              }
            ]
          }
        }, function (error, response) {
          callback(null, error, response);
        });
      },
      function(pError, pResponse, callback) {
        client.create({
          index: indexName,
          type: 'metadata',
          id: '6',
          body: {
            name: 'Tel-aviv video 6',
            locations: [
              {
                "lon": 34.78743553161621,
                "lat": 32.047078883222596
              },
              {
                "lon": 34.78468894958496,
                "lat": 32.050570872022476
              },
              {
                "lon": 34.78511810302734,
                "lat": 32.055081160348536
              },
              {
                "lon": 34.786062240600586,
                "lat": 32.05951848511664
              },
              {
                "lon": 34.78717803955078,
                "lat": 32.06264630603271
              },
              {
                "lon": 34.793100357055664,
                "lat": 32.06839248896371
              },
              {
                "lon": 34.79318618774413,
                "lat": 32.072538244831925
              },
              {
                "lon": 34.79352951049805,
                "lat": 32.07581107721859
              },
              {
                "lon": 34.797563552856445,
                "lat": 32.07508379125731
              },
              {
                "lon": 34.800910949707024,
                "lat": 32.07384739184529
              },
              {
                "lon": 34.80245590209961,
                "lat": 32.07050175666494
              },
              {
                "lon": 34.803571701049805,
                "lat": 32.06577401999612
              },
              {
                "lon": 34.80940818786621,
                "lat": 32.06577401999612
              },
              {
                "lon": 34.81498718261719,
                "lat": 32.06461023194615
              },
              {
                "lon": 34.82073783874512,
                "lat": 32.06133699866369
              },
              {
                "lon": 34.822797775268555,
                "lat": 32.05449920015355
              },
              {
                "lon": 34.82348442077637,
                "lat": 32.053771744704605
              },
              {
                "lon": 34.82193946838379,
                "lat": 32.051152857201714
              },
              {
                "lon": 34.815073013305664,
                "lat": 32.047078883222596
              },
              {
                "lon": 34.81361389160156,
                "lat": 32.04482356964478
              },
              {
                "lon": 34.806060791015625,
                "lat": 32.04322299081233
              },
              {
                "lon": 34.806060791015625,
                "lat": 32.03922142128952
              },
              {
                "lon": 34.809064865112305,
                "lat": 32.038712118075686
              },
              {
                "lon": 34.80700492858887,
                "lat": 32.03456482930134
              },
              {
                "lon": 34.80022430419922,
                "lat": 32.037329709356634
              },
              {
                "lon": 34.79687690734863,
                "lat": 32.03994899239455
              },
              {
                "lon": 34.791297912597656,
                "lat": 32.040676557717454
              }
            ]
          }
        }, function (error, response) {
          callback(null, 'done');
        });
      }
    ], function (err, result) {
      if (err) console.log('error', JSON.stringify(err, null, 4));
      else console.log('result', JSON.stringify(result, null, 4));
    });

    callback();
  }

};
