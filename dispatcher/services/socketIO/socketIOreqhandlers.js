'use strict'

var db = require('../mysql');
var customError = require('../../errors/errors');
var hFuncs = require('../helper-funcs');
const { fetchServer, fetchTool } = require('./socketIOnodes');

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
        // let reqRequest = await db.query('SELECT * FROM Request WHERE id = ' + params.requestId + ';');
        // let reqPass = await db.query('SELECT * FROM Pass WHERE id = ' + params.passId + ' AND requestId = ' + params.requestId + ';');

        let reqData = await Promise.all([
            db.query('SELECT * FROM Request WHERE id = ' + params.requestId + ' AND completed = FALSE;'),
            db.query('SELECT * FROM Pass WHERE id = ' + params.passId + ' AND requestId = ' + params.requestId + ' AND completed = TRUE;')
        ]);

        if (!reqData[0].length || !reqData[0].length) { throw new customError.BadRequestError('request pass already completed or incomplete data in pass result'); }
        
        // Check the service here wether the job is ongoing or not

        let reqPassResult = await db.query('SELECT * FROM Pass_Result WHERE id = 0 AND passId = ' + params.passId + ' AND requestId = ' + params.requestId + ';');

        if (!reqPassResult.length) { throw new customError.NotFoundError('no pass result data found'); }

        // Only caters to a single input for now (but can be tweaked by tweaking the query) - TODO
        // let reqTools = await db.query('')

        // Toggle the service's new pass function here

        return [undefined, undefined];
    } catch(err) {
        return [{}, err];
    }
}

exports.handleJobCompleted = async (socket, params, event) => {
    try {
        // Toggle the service's completed function here
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