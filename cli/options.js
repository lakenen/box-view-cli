
module.exports = function (prog) {
    function findCommand(name) {
        var i;
        for (i = 0; i < prog.commands.length; ++i) {
            if (prog.commands[i]._name === name) {
                return prog.commands[i];
            }
        }
        return null;
    }

    function options(cmd) {
        if (typeof cmd.command === 'string') {
            cmd = findCommand(cmd.command);
            console.log(cmd.options.map(function (o) {
                return (o.short ? o.short : '') +
                    (o.long ? (o.short ? ' ' : '') + o.long : '');
            }).join(' '));
        } else {
            // all commands
            console.log(cmd.parent.commands.map(function (c) {
                return c._name;
            }).join(' '));
        }
    }

    return {
        description: 'output concise command information',
        options: [
            ['-c, --command [command]', 'the command do print options for']
        ],
        actions: [
            options
        ]
    };
};
