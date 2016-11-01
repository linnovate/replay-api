var path = require('path'),
    fs = require('fs');

var _configFileName = 'default.json';

module.exports = {
    // prepare the config file in /config directory for swagger-combined module
    prepareConfigFile: function () {
        console.log('Preparing config file for swagger-combined...')
        var data = JSON.stringify(sails.config.swaggerCombined);
        var confFilePath = path.join(process.cwd(), '/config', _configFileName);
        // By default, open file for writing. The file is created (if it does not exist) or truncated (if it exists).
        // writeFileSync always returns undefined
        fs.writeFileSync(confFilePath, data);
        console.log('Done preparing config file for swagger-combined.');
        return;
    }
}