var mocha = require('mocha')
var assert = require('assert')
const conf = require('../conf/conf')

const log4js = require('log4js');
const logger = log4js.getLogger("testWs.js");
logger.level = 'info'

describe("WS", function () {
    it('Get data from Websocket', function (done) {
        this.timeout(100000);
        var wsImpl = require('../wsImpl');

        wsImpl.onReady(function () {
            logger.debug("wsImpl.getPrice() = " +  wsImpl.getPrice())
            assert(typeof wsImpl.getPrice() !== 'undefined')
            wsImpl.finished()
            done()
        });

    });

    afterEach(function () {
        logger.debug('FINISH')
        conf.unwatch()
    });
})

