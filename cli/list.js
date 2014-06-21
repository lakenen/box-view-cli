
module.exports = function (prog) {
    function requestList(cmd, callback) {
        var options = {};

        if (cmd.number) {
            options.number = cmd.number;
        }
        if (cmd.before) {
            options['created_before'] = cmd.expires;
        }
        if (cmd.after) {
            options['created_after'] = cmd.after;
        }

        prog.client.documents.list(options, function (err, res) {
            if (err) {
                console.error(err);
            } else {
                console.log(JSON.stringify(res, true, 2));
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
