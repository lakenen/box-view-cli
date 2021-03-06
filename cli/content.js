var fs = require('fs'),
    debug = require('../lib/debug'),
    output = require('../lib/output');

module.exports = function (prog) {

    function requestContent(cmd) {
        var extension = cmd.extension || '';
        var outputFn;



        if (cmd.documentId) {
            debug('content requested with document id "%s"', cmd.documentId);
            prog.client.documents.getContent(
                cmd.documentId,
                { extension: extension, retry: true },
                function (err, res) {
                    if (err) {
                        output.error(res);
                    } else {
                        debug('got content (type %s)', extension);
                        if (cmd.output) {
                            debug('writing to file %s', cmd.output);
                            var file = fs.createWriteStream(cmd.output);
                            file.on('finish', function() {
                                debug('finished writing to file %s', cmd.output);
                                file.close();
                            });
                            res.pipe(file);
                        } else {
                            // just send it to stdout
                            debug('no output file given... writing to stdout');
                            res.pipe(process.stdout);
                        }
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
            ['-e, --extension [extension]', 'the type of content to request (zip, pdf); if empty, get the original document type'],
            ['-o, --output [file]', 'the name of the file to output data to (otherwise stdout)']
        ],
        actions: [
            requestContent
        ],
        // exposed here for other commands to use easily
        requestContent: requestContent
    };
};
