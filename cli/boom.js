
module.exports = function (prog) {
    var upload = require('./upload')(prog),
        session = require('./session')(prog);

    function boom(cmd) {
        upload.requestUpload(cmd, function (doc) {
            cmd.documentId = doc.id;
            session.requestSession(cmd);
        });
    }

    return {
        description: 'upload a document and create a session all in one fancy command',
        options: session.options.concat(upload.options),
        actions: [
            boom
        ]
    };
};
