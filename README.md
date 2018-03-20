# Crypto Comparator Test task for CEX.IO on Node.js.
Crypto Comparator gets:

1)Crypto BTC-USD price from coinmarketcap API <https://coinmarketcap.com/api/> by JSON REST and update this price every n secs(sets in config file)

2)Crypto BTC-USD price from CEX.IO API at <https://cex.io/cex-api> by WebSocket API. Subscribe and gets price every time when price was changed

Crypto Comparator calculate difference beetween those prices and print it to console in percent by template:</br>
<Current time (mm:ss)> - <difference price in percent with precision (set in config)>  

## Installation
```bash
  git clone https://github.com/mkredaktor/crypto-comparator.git
  npm install
```

## Configuration
Configuration module (conf.js) automatically reloads the config file (config.json or config.js) at runtime if the config file has been changed.

The configuration module tries to load the config.json file, and if it could not load it, it tries to load the config.js file.

### config.json structure
```{
    "url" : "https://api.coinmarketcap.com/v1/ticker/bitcoin",
    "ws_url": "wss://ws.cex.io/ws/",
    "wsApiKey": "API_KEY",
    "wsApiSecret": "API_SECRET",
    "updateTime": "10",
    "precision": "4",
    "dateFormat": "mm:ss"
}
```

## Test
npm run test

## Usage
npm run start
