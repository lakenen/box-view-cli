var output = require('../lib/output');

module.exports = function (prog) {
    function requestList(cmd, callback) {
        var params = {};

        if (cmd.number) {
            params.limit = cmd.number;
        }
        if (cmd.before) {
            params['created_before'] = cmd.expires;
        }
        if (cmd.after) {
            params['created_after'] = cmd.after;
        }

        prog.client.documents.list({ params: params }, function (err, res) {
            if (err) {
                output.error(err.message || err);
            } else {
                output.log(JSON.stringify(res, true, 2));
                if (typeof callback === 'function') {
                    callback(res);
                }
            }
        });
    }

    return {
        description: 'request a list of documents from the View API',
        options: [
            ['-n, --number [limit]', 'the maximum number of documents to request'],
            ['-b, --before [date]', 'the latest document to request'],
            ['-a, --after [date]', 'the earliest document to request']
        ],
        actions: [
            requestList
        ],
        // exposed here for other commands to use easily
        requestList: requestList
    };
};
