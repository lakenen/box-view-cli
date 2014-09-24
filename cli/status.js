var debug = require('../lib/debug'),
    output = require('../lib/output');

module.exports = function (prog) {

    function requestStatus(cmd, callback) {
        var fields = cmd.fields || '';

        if (cmd.documentId) {
            debug('status requested with document id "%s"', cmd.documentId);
            prog.client.documents.get(cmd.documentId, { fields: fields }, function (err, res) {
                if (err) {
                    output.error(res);
                } else {
                    output.log(res);
                    if (typeof callback === 'function') {
                        callback(res);
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
