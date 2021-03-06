var fs = require('fs'),
    debug = require('../lib/debug'),
    output = require('../lib/output');

module.exports = function (prog) {

    function requestContent(cmd) {
        var width, height;

        if (cmd.width) {
            width = cmd.width;
        } else {
            throw new Error('--width (-w) is required');
        }

        if (cmd.height) {
            height = cmd.height;
        } else {
            throw new Error('--height (-h) is required');
        }

        if (!cmd.output) {
          throw new Error('--output (-o) file required');
        }

        if (cmd.documentId) {
            debug('thumbnail requested with document id "%s"', cmd.documentId);
            prog.client.documents.getThumbnail(
                cmd.documentId,
                width,
                height,
                { retry: true },
                function (err, res) {
                    if (err) {
                        output.error(res);
                    } else {
                        debug('got thumbnail (size %sx%s)', width, height);
                        debug('writing to file %s', cmd.output);
                        var file = fs.createWriteStream(cmd.output);
                        file.on('finish', function() {
                            debug('finished writing to file %s', cmd.output);
                            file.close();
                        });
                        res.pipe(file);
                    }
                }
            );
        } else {
            throw new Error('--document-id (-d) option required');
        }
    }

    return {
        description: 'request document content from the View API',
        options: [
            ['-i, --document-id [id]', 'the document ID'],
            ['-o, --output [file]', 'the name of the file to output data to'],
            ['-w, --width [width]', 'the desired width of the thumbnail'],
            ['-h, --height [height]', 'the desired height of the thumbnail']
        ],
        actions: [
            requestContent
        ],
        // exposed here for other commands to use easily
        requestContent: requestContent
    };
};
