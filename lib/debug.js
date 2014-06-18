var util = require('util');

module.exports = function debug() {
    if (/box-view-cli/.test(process.env.NODE_DEBUG)) {
        console.error('BOX VIEW CLI: %s', util.format.apply(util, arguments));
    }
};
