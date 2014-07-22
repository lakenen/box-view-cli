var open = require('open'),
    debug = require('../lib/debug');

module.exports = function (prog) {
    function requestSession(cmd) {
        var options = {};

        if (cmd.duration) {
            options.duration = cmd.duration;
        }
        if (cmd.expires) {
            options['expires_at'] = cmd.expires;
        }
        if (cmd.downloadable) {
            options['is_downloadable'] = cmd.downloadable;
        }
        if (cmd.disableText) {
            options['is_text_selectable'] = false;
        }

        if (cmd.documentId) {
            debug('session requested with document id "%s"', cmd.documentId);
            prog.client.sessions.create(cmd.documentId, options, function (err, res) {
                if (err) {
                    console.error(err.error);
                } else {
                    console.log(res);
                    if (cmd.open) {
                        open(prog.client.sessionsURL + '/' + res.id + '/view');
                    }
                }
            });
        } else {
            throw new Error('--session-id option required');
        }
    }

    return {
        description: 'create a viewing session on the View API',
        options: [
            ['-i, --document-id [id]', 'the document ID'],
            ['-d, --duration [duration]', 'the duration (in minutes) of the session'],
            ['-e, --expires [expires]', 'the timestamp at which this session should expire'],
            ['-D, --downloadable', 'allow downloads'],
            ['-T, --disable-text', 'disable text selection'],
            ['-o, --open', 'open the viewing session URL on success']
        ],
        actions: [
            requestSession
        ],
        // exposed here for other commands to use easily
        requestSession: requestSession
    };
};
