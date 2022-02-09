const db = require('../mysql');
const customError = require('../../errors/errors');
const hFuncs = require('../helper-funcs');
const { initReqPass, jobCompleted } = require('../jobmanager');

function emitToSocket(socketId, event, data = undefined) {
    var { io } = require('../../dispatcher');
    let sockets = io.of().sockets;
    let socket = sockets.get(socketId);
    let resEvent = "RES|" + event;
    if (socket) {
        if (data) {
            socket.emit(resEvent, data);
        } else {
            socket.emit(resEvent);
        }
    }
}

exports.handleRequestSubmit = async (socket, params, event) => {
    try {
        
        if (!initReqPass(params.requestId, params.passId)) {
            await db.query('UPDATE Request SET completed = TRUE WHERE id = ' + params.requestId + ';');
            throw new customError.BadRequestError('unable to start request');
        }

        return [undefined, undefined];
    } catch(err) {
        return [{}, err];
    }
}

exports.handleJobCompleted = async (socket, params, event) => {
    try {
        // Toggle the service's completed function here
        let nodeObj = socket.nodeObj;

        jobCompleted(params.requestId, params.passId, params.passResultId, nodeObj.toolId);
    } catch(err) {
        return [{}, err];
    }
}

exports.handleNetPing = async (socket, params, event) => {
    try {
        let node = socket.nodeObj;

        let res = {
            timestamp: hFuncs.parseDate()
        };

        return [res, undefined];
    } catch(err) {
        return [{}, err];
    }
}