const CEXIO = require('cexio-api-node')
const conf = require('./conf/conf')

const log4js = require('log4js');
const logger = log4js.getLogger('wsImpl.js');
logger.level = 'info'

var cexWS = new CEXIO(conf.getConfig().wsApiKey, conf.getConfig().wsApiSecret).ws
cexWS.WebSocketURI = conf.getConfig().ws_url;

var price;
var count = 1;
const eventName = 'ready';

cexWS.onReady = function (callback) {
    cexWS.removeAllListeners(eventName);
    if (typeof callback !== 'undefined' && typeof callback === 'function') {
        cexWS.on(eventName, callback);
    } else {cexWS.on(eventName, function() {logger.debug('catch ready in wsImpl.js')});}
};

cexWS.finished = function () {
    cexWS.finish = true;
    cexWS.close();
}

function connect() {
    logger.debug('WS try connect')

    // set listener 'ready' for catch data
    cexWS.onReady();

    /**
     * Open connection
     */
    cexWS.open()

    cexWS.on('open', function () {
        logger.debug('WebSocket connected')
        cexWS.auth()
        cexWS.subscribeTick()
    })

    cexWS.on('auth', function () {
        logger.debug('Websocket authenticated')
        //cexWS.authTicker('BTC-USD')
    })

    /**
     * Log messages
     */
    cexWS.on('message', function (msg) {
        /**
         * Keep authenticated.
         * Respond with pong
         */
        if (msg.e === 'ping') {
            pong();
            //cexWS.authTicker('BTC-USD')
            //cexWS.subscribeTick()
        }

        if (msg.e === 'tick') {
            //logger.debug(msg.data);
        }

        if (msg.e === 'tick' && msg.data.symbol1 === 'BTC' && msg.data.symbol2 === 'USD') {
            //logger.debug(count++ + ': ' + msg.e + ": " + msg.data.symbol1 + "-" + msg.data.symbol2 + " = " + msg.data.price)
            price = msg.data.price;
            this.emit(eventName);
        }
    })

    cexWS.on('error', function (error) {
        logger.error('error: \n', error)
    })

    cexWS.on('close', function () {
        logger.debug('WebSocket disconnected')
        logger.debug('cexWS.finish = ' + cexWS.finish)
        if (typeof cexWS.finish === 'undefined' || cexWS.finish !== true) {
            cexWS.open()
            return
        }

        logger.debug('conf.unwatch()')
        conf.unwatch()
    });

}

function pong() {
    var args = {
        e: 'pong'
    }
    cexWS.send(args)
}

cexWS.getPrice = function () {
    return price
}

connect();

module.exports = cexWS