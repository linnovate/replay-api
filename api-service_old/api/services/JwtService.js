var moment = require('moment');
var jwt = require('jwt-simple');

module.exports = {
  createJWT: function (user) {
    var payload = {
      sub: user.id,
      iat: moment().unix(),
      exp: moment().add(14, 'days').unix()
    };
    return jwt.encode(payload, sails.config.settings.token_secret);
  }
};
