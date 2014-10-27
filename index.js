'use strict';

var prog = require('commander'),
    fs = require('fs'),
    debug = require('./lib/debug'),
    BoxView = require('box-view');

function readJSON(file) {
    return JSON.parse(fs.readFileSync(file));
}

function getVersion() {
    var cliVersion = readJSON(__dirname + '/package.json').version,
        boxViewVersion = readJSON(__dirname + '/node_modules/box-view/package.json').version;
    return 'box-view-cli@' + cliVersion + '\nbox-view@' + boxViewVersion;
}

function init(cmd) {
    var client;
    prog.token = prog.token || process.env.BOX_VIEW_API_TOKEN;
    debug('started with token %s', prog.token);
    client = BoxView.createClient(prog.token);
    if (process.env.BOX_VIEW_DOCUMENTS_URL) {
        client.documentsURL = process.env.BOX_VIEW_DOCUMENTS_URL;
    }
    if (process.env.BOX_VIEW_DOCUMENTS_UPLOAD_URL) {
        client.documentsUploadURL = process.env.BOX_VIEW_DOCUMENTS_UPLOAD_URL;
    }
    if (process.env.BOX_VIEW_SESSIONS_URL) {
        client.sessionsURL = process.env.BOX_VIEW_SESSIONS_URL;
    }
    prog.client = client;
    prog.currentCommand = cmd;
    prog.commandInitialized = true;
}

function addCommand(name) {
    var command = require('./cli/' + name)(prog);
    var cmd = prog.command(name)
        .description(command.description)
        .action(init);
    command.options.forEach(function (options) {
        cmd.option.apply(cmd, options);
    });
    command.actions.forEach(function (action) {
        cmd.action(action);
    });
}

addCommand('help');
addCommand('options');
addCommand('upload');
addCommand('session');
addCommand('content');
addCommand('thumbnail');
addCommand('view');
addCommand('status');
addCommand('list');

process.on('uncaughtException', function (e) {
    console.error('Error: ' + e.message);
    // TODO: come up with a cleaner way to do this
    require('./cli/help')(prog).help(prog.currentCommand._name);
});


prog.version(getVersion(), '-v, --version')
    .option('-t, --token [token]', 'Box View API Token (default: $BOX_VIEW_API_TOKEN)')
    .option('--completion [type]', 'Print bash completion script')
    .parse(process.argv);

if (prog.completion) {
    var filename = __dirname + '/completion/' + prog.completion;
    fs.stat(filename, function (err) {
        if (err) {
            console.error(err);
            process.exit();
        } else {
            fs.createReadStream(filename).pipe(process.stdout);
        }
    });
}

if (!prog.commandInitialized) {
    if (prog.args.length) {
        console.error('Unrecognized command ' + prog.args.join(' '));
    }
    prog.help();
}
