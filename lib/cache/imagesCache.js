var NodeCache = require('node-cache');

const imagesCache = new NodeCache({
    stdTTL: 60 * 60 * 24, // 1 day of timeout for all keys. More info can be found here - https://www.npmjs.com/package/node-cache
});

module.exports = imagesCache;
