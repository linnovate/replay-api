var elasticsearch = require('elasticsearch');

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

    }).then(callback, function (err, res) {
      console.trace("err", err.message);
      console.log("res", res)
    });
  },

  searchByDistance: function (latitude, longitude, distance, callback) {
    var query = {};
    query.filter = {};
    query.filter.geo_distance = {};
    query.filter.geo_distance.locations = {};
    query.filter.geo_distance.distance = distance; //"100km"
    query.filter.geo_distance.locations.lat = latitude; //32.100981
    query.filter.geo_distance.locations.lon = longitude; //34.811919
    this.search(null, "metadata", query, function (resp) {
      callback(resp.hits.hits);
    });
  }
};
