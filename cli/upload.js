var path = require('path'),
    debug = require('../lib/debug');

module.exports = function (prog) {
    function createResponseHandler(done) {
        return function (err, res) {
            if (err) {
                console.error(err.error);
            } else {
                console.log(res);
                if (typeof done === 'function') {
                    done(res);
                }
            }
        };
    }

    function requestUpload(cmd, done) {
        var options = {};

        if (cmd.name) {
            options.name = cmd.name;
        }
        if (cmd.thumbnails) {
            options.thumbnails = cmd.thumbnails;
        }
        if (cmd.nonSvg) {
            options['non_svg'] = cmd.nonSvg;
        }

        if (cmd.url) {
            debug('upload requested with URL "%s"', cmd.url);
            prog.client.documents.uploadURL(cmd.url, options, createResponseHandler(done));
        } else if (cmd.file) {
            cmd.file = path.resolve(cmd.file);
            debug('upload requested with file "%s"', cmd.file);
            prog.client.documents.uploadFile(cmd.file, options, createResponseHandler(done));
        } else {
            throw new Error('--file (-f) or --url (-u) option required');
        }
    }

    return {
        description: 'upload a document to the View API',
        options: [
            ['-u, --url [url]', 'specify document by URL'],
            ['-f, --file [file]', 'specify document by filename'],
            ['-n, --name [name]', 'the name of the document'],
            ['--thumbnails [sizes]', 'request thumbnails (format: comma-separated {width}x{height})'],
            ['--non-svg', 'request non-svg version']
        ],
        actions: [
            requestUpload
        ],
        // exposed here for other commands to use easily
        requestUpload: requestUpload
    };
};
