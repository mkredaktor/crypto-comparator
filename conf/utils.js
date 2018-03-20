var path = require('path');

var log4js = require('log4js');
var logger = log4js.getLogger('utils.js');
logger.level = 'info';


module.exports.requireUncached = function (module){
    delete require.cache[require.resolve(module)]
    console.debug('"' + path.basename(module) + '" was loaded');
    return require(module)
}

function calcDifference(value1, value2) {
    if (typeof value1 === 'undefined' || typeof value2 === 'undefined') {
        logger.info('Not all data are ready for calculation');
        return 'undefined';
    }

    logger.debug('value1 == ' + value1 + ' ; value2 = ' + value2);

    let diffPrice = value1 - value2;

    let diffPercent = diffPrice / value2 * 100

    let calc = {};

    calc.diffPrice = diffPrice;
    calc.diffPercent = diffPercent;

    return calc;
}

function formatPercent(value1) {
    const conf = require('./conf')
    return value1.toFixed(conf.getConfig().precision) + '%';
}

module.exports.calcDifference = calcDifference
module.exports.formatPercent = formatPercent