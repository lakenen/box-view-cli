
module.exports = {
    error: function (err) {
        if (typeof err === 'string') {
            err = { error: err };
        }
        console.error(JSON.stringify(err, true, 2));
    },
    log: function (msg) {
        if (typeof msg === 'string') {
            msg = { message: msg };
        }
        console.log(JSON.stringify(msg, true, 2));
    }
};
