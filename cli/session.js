var open = require('open'),
    debug = require('../lib/debug'),
    output = require('../lib/output');

module.exports = function (prog) {

    function validateParams(cmd) {
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
        if (cmd.annotations) {
            params['is_annotatable'] = true;
            if (!cmd.authorName) {
              throw new Error('--author-name is required when annotations are enabled');
            }
            if (!cmd.authorId) {
              throw new Error('--author-id is required when annotations are enabled');
            }
            params['author_name'] = cmd.authorName || 'Test User';
            params['author_external_id'] = cmd.authorId || 1;
        }

        return params;
    }

    function requestSession(cmd) {
        var params = validateParams(cmd);

        if (cmd.documentId) {
            debug('session requested with document id "%s"', cmd.documentId);
            prog.client.sessions.create(
                cmd.documentId,
                { params: params, retry: true },
                function (err, res) {
                  if (err) {
                      output.error(res);
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
            ['-a, --annotations', 'enable annotations'],
            ['-N, --author-name [authorName]', 'annotation author name'],
            ['-A, --author-id [authorId]', 'annotation author id'],
            ['-o, --open', 'open the viewing session URL on success']
        ],
        actions: [
            requestSession
        ],
        // exposed here for other commands to use easily
        requestSession: requestSession
    };
};
