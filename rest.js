'use strict'

const request = require('request');
const rp = require('request-promise');

const conf = require('./conf/conf');
const util = require('util')
const events = require('events');
const {EventEmitter} = require('events')

const log4js = require('log4js');
const logger = log4js.getLogger("rest.js");
logger.level = 'info';

const Rest = function () {
    EventEmitter.call(this);
}

util.inherits(Rest, EventEmitter);

Rest.prototype.ON = function(callback) {
    this.on('ready', callback);
};

Rest.prototype.removeOn = function(callback) {
    this.removeAllListeners('ready');
    if (typeof callback !== 'undefined' && callback === 'function')
        callback();
};

var data;

/**
 * @function Request with Promise
 * @return Request promise
 */
Rest.prototype.getRequestP = function() {
  var obj1 = this;
   return rp({
            url: conf.getConfig().url,
            json: true
        },
        function (error, response, body) {
            if (error || response.statusCode !== 200) {
                logger.error('error:', error); // Print the error if one occurred
                logger.error('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                throw error || new Error("Invalid status code"); //Something to do
            }
            data = body[0];
            //notify all listeners to ready data
            obj1.emit('ready');
        }
    )
}

/**
 * @function Request with callback function
 */
Rest.prototype.getRequest = function(callback) {
    var obj1 = this;
    request({
            url: conf.getConfig().url,
            json: true
        },
        function (error, response, body) {
            if (error || response.statusCode !== 200) {
                logger.error('error:', error); // Print the error if one occurred
                logger.error('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                throw error || new Error("Invalid status code"); //Something to do
            }
            data = body[0];
            obj1.emit('ready');
            if (typeof callback !== 'undefined' && callback)
                callback(body[0]);
        });
}

Rest.prototype.getData = function() {
    return data;
};

module.exports = Rest;