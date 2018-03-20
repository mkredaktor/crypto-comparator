var mocha = require('mocha')
var assert = require('assert')

const utils = require('../conf/utils');
const conf = require('../conf/conf')

const log4js = require('log4js');
const logger = log4js.getLogger("testDiff.js");
logger.level = 'info'

describe("DIFF", function () {
    it('Calc diff price in currency and percent', function () {
        this.timeout(100000);
        var calc = utils.calcDifference(8659, 8598.7)
        assert.equal(calc.diffPrice, 60.29999999999927, "Error calculation in utils.calcDifference()")
        assert.equal(calc.diffPercent, 0.7012687964459658, "Error calculation in utils.calcDifference()")
        assert.equal(utils.formatPercent(calc.diffPercent), "0.7013%", "Error formatPercent() in utils")
    });

    afterEach(function () {
        logger.debug('FINISH')
        conf.unwatch()
    });
})

