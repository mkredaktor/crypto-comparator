const conf = require('./conf/conf');

const log4js = require('log4js');
const logger = log4js.getLogger("restImpl.js");
logger.level = 'info'

var REST = require('./rest');
var rest = new REST();

//first call
rest.getRequest();

var timeouts = [];

//call by time interval in sec from config: updateTime
timeouts.push(setTimeout(function run() {
    rest.getRequestP()
        .then(function (data) {
            logger.debug('Update every ' + conf.getConfig().updateTime + ' sec');
            if (rest.listenerCount('ready') !== 0) {
                timeouts.push(setTimeout(run, conf.getConfig().updateTime * 1000));
            } else {
                clearAllTimeOuts();
                logger.debug("conf is unwatched");
                conf.unwatch()
            }
        });
}, conf.getConfig().updateTime * 1000));


function clearAllTimeOuts() {
    logger.debug('clearAllTimeOuts')
    for (var i = 0; i < timeouts.length; i++) {
        logger.debug('clear Timeout : ' + (i + 1))
        clearTimeout(timeouts[i]);
    }
    timeouts = [];
    logger.debug('timeouts is 0')
}

this.getPrice = function () {
    if (typeof rest.getData() === 'undefined' || typeof rest.getData().price_usd === 'undefined')
        return 'undefined'
    return rest.getData().price_usd;
}

this.onReady = function (callback) {
    rest.ON(callback)
}

this.removeOn = function (callback) {
    rest.removeOn(callback);
    clearAllTimeOuts();
}

module.exports = this;