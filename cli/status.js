var debug = require('../lib/debug');

module.exports = function (prog) {

    function requestStatus(cmd, callback) {
        var fields = cmd.fields || '';

        if (cmd.documentId) {
            debug('status requested with document id "%s"', cmd.documentId);
            prog.client.documents.get(cmd.documentId, fields, function (err, response) {
                if (err) {
                    console.error(err);
                } else {
                    console.log(response);
                    if (typeof callback === 'function') {
                        callback(response);
                    }
                }
            });
        } else {
            throw new Error('--document-id (-d) option required');
        }
    }

    return {
        description: 'request document content from the View API',
        options: [
            ['-i, --document-id [id]', 'the document ID'],
            ['--fields [fields]', 'the fields to request (comma-separated)']
        ],
        actions: [
            requestStatus
        ],
        // exposed here for other commands to use easily
        requestStatus: requestStatus
    };
};
