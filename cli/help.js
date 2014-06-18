
module.exports = function (prog) {
    function help(cmd) {
        if (typeof cmd === 'string') {
            prog.emit(cmd, null, ['--help']);
            process.exit();
        } else {
            prog.help();
        }
    }

    return {
        description: 'output usage information',
        options: [
            ['--verbose', 'output verbose help']
        ],
        actions: [
            help
        ]
    };
};
