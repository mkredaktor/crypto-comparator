const wsImpl = require('./wsImpl')
const restImpl = require('./restImpl')
const conf = require('./conf/conf')
const utils = require('./conf/utils')
var moment = require('moment')

var log4js = require('log4js');
var logger = log4js.getLogger('diff.js');
logger.level = 'info';

var diffPrice
var count = 1

wsImpl.onReady(function () {
    calcDiff();
});

restImpl.onReady(function () {
    calcDiff();
})

function calcDiff() {
    let calc = utils.calcDifference(wsImpl.getPrice(), restImpl.getPrice())

    if (calc === 'undefined') return

    logger.debug('calc.diffPrice == ' + calc.diffPrice + ' ; calc.diffPercent = ' + calc.diffPercent);

    if (calc.diffPrice !== diffPrice) {
        logger.debug(count + ':' + ' PRICE DIFF: ' + calc.diffPrice);
        let dateString = moment().format(conf.getConfig().dateFormat)
        console.log(count++ + ') ' + dateString + ' - ' + utils.formatPercent(calc.diffPercent))
        diffPrice = calc.diffPrice
    }
}
