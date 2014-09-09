var open = require('open'),
    debug = require('../lib/debug'),
    output = require('../lib/output');

module.exports = function (prog) {
    function requestSession(cmd) {
        var params = {};

        if (cmd.duration) {
            params.duration = cmd.duration;
        }
        if (cmd.expires) {
            params['expires_at'] = cmd.expires;
        }
        if (cmd.downloadable) {
            params['is_downloadable'] = cmd.downloadable;
        }
        if (cmd.disableText) {
            params['is_text_selectable'] = false;
        }

        if (cmd.documentId) {
            debug('session requested with document id "%s"', cmd.documentId);
            prog.client.sessions.create(
                cmd.documentId,
                { params: params, retry: true },
                function (err, res) {
                  if (err) {
                      output.error(err.message || err);
                  } else {
                      output.log(res);
                      if (cmd.open) {
                          open(prog.client.sessionsURL + '/' + res.id + '/view');
                      }
                  }
                }
            );
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
