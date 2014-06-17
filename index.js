'use strict';

var prog = require('commander'),
    fs = require('fs'),
    path = require('path'),
    util = require('util'),
    open = require('open'),
    BoxView = require('box-view');

function debug() {
    if (/box-view-cli/.test(process.env.NODE_DEBUG)) {
        console.error('BOX VIEW CLI: %s', util.format.apply(util, arguments));
    }
}

function readJSON(file) {
    return JSON.parse(fs.readFileSync(file));
}

function getVersion() {
    var cliVersion = readJSON(path.resolve('package.json')).version,
        boxViewVersion = readJSON(path.resolve('node_modules/box-view/package.json')).version;
    return 'box-view-cli@' + cliVersion + '\nbox-view@' + boxViewVersion;
}

function init() {
    prog.token = prog.token || process.env.BOX_VIEW_API_TOKEN;
    debug('started with token %s', prog.token);
    prog.client = BoxView.createClient(prog.token);
}

function upload(cmd, callback) {
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
        prog.client.documents.uploadURL(cmd.url, options, function (err, res) {
            if (err) {
                console.error(err);
            } else {
                console.log(res);
                callback(res);
            }
        });
    } else if (cmd.file) {
        cmd.file = path.resolve(cmd.file);
        debug('upload requested with file "%s"', cmd.file);
        prog.client.documents.uploadFile(cmd.file, options, function (err, res) {
            if (err) {
                console.error(err);
            } else {
                console.log(res);
                callback(res);
            }
        });
    } else {
        throw new Error('--file or --url option required');
    }
}

function session(cmd) {
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

    if (cmd.documentId) {
        debug('session requested with document id "%s"', cmd.documentId);
        prog.client.sessions.create(cmd.documentId, options, function (err, res) {
            if (err) {
                console.error(err);
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

function boom(cmd) {
    upload(cmd, function (doc) {
        cmd.documentId = doc.id;
        session(cmd);
    });
}

function addUploadOptions(cmd) {
    cmd.option('-u, --url [url]', 'specify document by URL')
       .option('-f, --file [file]', 'specify document by filename')
       .option('-n, --name [name]', 'the name of the document')
       .option('--thumbnails [sizes]', 'request thumbnails (format: comma-separated {width}x{height})')
       .option('--non-svg', 'request non-svg version');
}

function addSessionOptions(cmd) {
    cmd.option('-i, --document-id [id]', 'the document ID')
       .option('-d, --duration [duration]', 'the duration (in minutes) of the session')
       .option('-e, --expires [expires]', 'the timestamp at which this session should expire')
       .option('-D, --downloadable', 'allow downloads')
       .option('-o, --open', 'open the viewing session URL on success');
}

prog.command('help [command]')
    .description('output usage information')
    .action(function(cmd) {
        if (typeof cmd === 'string') {
            prog.emit(cmd, null, ['--help']);
            process.exit();
        } else {
            prog.outputHelp();
        }
    });

var uploadCmd = prog.command('upload')
    .description('upload a document to the View API')
    .action(init)
    .action(upload);
addUploadOptions(uploadCmd);

var sessionCmd = prog.command('session')
    .description('create a viewing session on the View API')
    .action(init)
    .action(session);
addSessionOptions(sessionCmd);

var boomCmd = prog.command('boom')
    .description('upload a document and create a session all in one fancy command')
    .action(init)
    .action(boom);
addSessionOptions(boomCmd);
addUploadOptions(boomCmd);

prog.version(getVersion(), '-v, --version')
    .option('-t, --token [token]', 'Box View API Token (default: $BOX_VIEW_API_TOKEN)')
    .parse(process.argv);
