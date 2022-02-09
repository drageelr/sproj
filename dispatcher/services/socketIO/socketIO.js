const { errorHandler } = require('./socketIOerrorhandler');
const { validate } = require('./socketIOvalidator');
const { validateAccess } = require('./socketIOaccessvalidator');
const IOreqhandlers = require('./socketIOreqhandlers');

const reqEvents = {
    // Request Management
    'req-submit': IOreqhandlers.handleRequestSubmit,

    // Job Management
    'job-completed': IOreqhandlers.handleJobCompleted,

    //Network Management
    'net-ping': IOreqhandlers.handleNetPing,
};

function generateEventListener(socket, event) {
    let tempFunc = async (params) => {
        try {
            let accErr = validateAccess(event, socket.nodeObj.type);
            if (accErr) { throw accErr; }

            let valErr = validate(event, params);
            if (valErr) { throw valErr; }

            let [ res, procErr ] = await reqEvents[event](socket, params, event);
            if (procErr) { throw procErr; }

            if (res) {
                socket.emit('RES|' + event, res);
            }
        } catch (err) {
            errorHandler(socket, err);
        }
    }
    return tempFunc;
}

function attachEventListeners(socket) {
    for (let e in reqEvents) {
        socket.on('REQ|' + e, generateEventListener(socket, e));
    }
}

module.exports.attachEventListeners = attachEventListeners;