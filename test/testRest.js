var mocha = require('mocha')
var assert = require('assert')
var utils = require('../conf/utils')
const conf = require('../conf/conf')


const log4js = require('log4js');
const logger = log4js.getLogger("testRest.js");
logger.level = 'info'

describe("REST", function () {
    it('Get data from rest api by Promise', function (done) {
        this.timeout(10000);
        var REST = utils.requireUncached('../rest');
        const rest = new REST();
        rest.getRequestP().then(function () {
            logger.debug("rest.getData().price_usd = " + rest.getData().price_usd)
            assert(typeof rest.getData() !== 'undefined' && rest.getData() !== 'undefined')
            assert(typeof rest.getData().price_usd !== 'undefined')
            done()
        })
    });

    it('Get data from rest api Impl by on event "ready"', function (done) {
        this.timeout(10000);
        const restImpl = utils.requireUncached('../restImpl')
        restImpl.onReady(function () {
            logger.debug("restImpl.getPrice() = " + restImpl.getPrice())
            restImpl.removeOn();
            assert(typeof restImpl.getPrice() !== 'undefined')
            assert(restImpl.getPrice() > 0)
            done()
        });
    });

    it('Compare time interval from Rest API with updateTime from config file', function (done) {
        var restImpl = utils.requireUncached('../restImpl')
        var moment = require('moment')

        this.timeout(conf.getConfig().updateTime * 100000);

        var sec = 0, times = 2

        restImpl.onReady(function () {
            let prevsec = sec;
            sec = parseInt(moment().format('X'));

            if (prevsec !== 0) {
                let interval = (moment.unix(sec) - moment.unix(prevsec)) / 1000
                logger.debug('interval: ' + interval + ' sec')
                if (parseInt(conf.getConfig().updateTime) === interval) {
                    times--;
                    logger.debug('times--: ' + times)
                    if (times === 0) {
                        restImpl.removeOn();
                        done();
                    }
                } else {
                    if (times === 4) {
                        restImpl.removeOn();
                        assert(false);
                    }
                    times++;
                    logger.debug('times++: ' + times)
                }
            }
        })
    });

    afterEach(function () {
        logger.debug('FINISH')
        conf.unwatch()
    });
})

