/**
 * Config
  */
const utils = require('./utils')
var fs = require('fs');
var path = require('path');

var conf;
var pathConfig = '';

function init() {
    try {
        pathConfig = './config.json';
        conf = utils.requireUncached(pathConfig);
    } catch (err) {
        if (err.code === 'MODULE_NOT_FOUND') {
            pathConfig = './config.js';
            conf = utils.requireUncached(pathConfig);
        } else {
            console.error('config loading failed\n' + err);
            throw err;
        }
    }
}

init();

var watcher = fs.watch(require.resolve(pathConfig), function(event, filename) {
    if(event === 'change') {
        init();
    }
});

module.exports.getConfig = function () {
    return conf;
};
module.exports.unwatch = function() {watcher.close()}
