const db = require('./mysql');
const customError = require('../errors/errors');
const { fetchServer, fetchTool } = require('./socketIO/socketIOnodes');

/**
 * let jobs = {requestId-passId: {passResultId: {toolId: Int}}}
 * requestId-passId: Identifies the unique ReqPass
 * passResultId: Identifies the unique ReqPassInput
 * toolId: Identifies the complete Job
 * INT: -1 -> Unable to connect to the tool, 0 -> Job not completed, 1-> Job completed
 */
let jobs = {};

function reqPassExists(requestId, passId) {
    if (jobs[requestId + '-' + passId])
        return true;
    return false;
}

function addReqPass(requestId, passId) {
    if (jobs[requestId + '-' + passId] === undefined) {
        jobs[requestId + '-' + passId] = {}
    }
}

function addPassResult(requestId, passId, passResultId, toolJobIds) {
    if (jobs[requestId + '-' + passId] === undefined)
        return false;
    let toolJobsObj = {};
    for (let i = 0; i < toolJobIds.length; i++) {
        toolJobsObj[toolJobIds[i]] = 0;
    }
    jobs[requestId + '-' + passId][passResultId] = toolJobsObj;
    return true;
}

function removeReqPass (requestId, passId) {
    if (jobs[requestId + '-' + passId] !== undefined) {
        jobs[requestId + '-' + passId] = undefined;
    }
}

function updateToolJob(requestId, passId, passResultId, toolId, status) {
    if (jobs[requestId + '-' + passId] === undefined)
        return false;
    if (jobs[requestId + '-' + passId][passResultId] === undefined)
        return false;
    if (jobs[requestId + '-' + passId][passResultId][toolId] === undefined)
        return false;
    jobs[requestId + '-' + passId][passResultId][toolId] = status;
    return true;
}

function allReqPassCompleted(requestId, passId) {
    for (let passResultId in jobs[requestId + '-' + passId]) {
        for (let toolId in jobs[requestId + '-' + passId][passResultId]) {
            const status = jobs[requestId + '-' + passId][passResultId][toolId]
            if (!status) { return false; }
        }
    }
    return true;
}

function emitToSocket(socketId, event, data = undefined) {
    const { io } = require('../dispatcher');
    let sockets = io.of('/').sockets;
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

exports.initReqPass = async (requestId, passId) => {
    try {
        let reqValidate = await Promise.all([
            db.query('SELECT id FROM Request WHERE completed = FALSE AND id = ' + requestId + ' AND maxPasses >= ' + passId + ';'),
            db.query('SELECT id FROM Pass WHERE completed = TRUE AND id = ' + passId + ' AND requestId = ' + requestId + ';')
        ]);

        if (!reqValidate[0].length || !reqValidate[1].length) { throw new customError.BadRequestError('request already completed or pass is incomplete'); }
    
        if (reqPassExists(requestId, passId)) { throw new customError.BadRequestError('request pass already in progress'); }

        let reqInputs = await db.query('SELECT id, inAttrId FROM Pass_Result WHERE passId = ' + passId + ' AND requestId = ' + requestId + ' AND (inAttrId IS NOT NULL);');

        if (!reqInputs.length) { throw new customError.BadRequestError('not enough pass inputs'); }

        let noToolsFound = true;
        let newPassId = passId + 1;
        let newPassCreated = false;
        addReqPass(requestId, newPassId);
        for (let i = 0; i < reqInputs.length; i++) {
            let reqTools = await db.query('SELECT id FROM Tool WHERE inAttrId = ' + reqInputs[i].inAttrId + ' AND active = TRUE;');
            let toolJobIds = reqTools.map((tool) => {
                return tool.id;
            });
            if (reqTools.length) {
                noToolsFound = false;
                if (!newPassCreated) {
                    await db.query('INSERT INTO Pass (id, requestId, createdAt, completed) VALUES (' + newPassId + ', ' + requestId + ', NOW(), FALSE);');
                    newPassCreated = true;
                }
            }
            addPassResult(requestId, newPassId, reqInputs[i].id, toolJobIds);
            for (let j = 0; j < toolJobIds.length; j++) {
                // Dispatch job via socket io
                let toolSocketId = fetchTool(toolJobIds[j]);
                if (toolSocketId === undefined) {
                    updateToolJob(requestId, newPassId, reqInputs[i].id, toolJobIds[j], -1);
                } else {
                    emitToSocket(toolSocketId, 'job-dispatched', {requestId: requestId, passId: newPassId, passResultId: reqInputs[i].id});
                }
            }
        }

        if (noToolsFound) {
            removeReqPass(requestId, newPassId);
            throw new customError.BadRequestError('not enough active tools according to input attributes'); 
        }

        return true;
    } catch(err) {
        console.log('initReqPass Error:');
        console.log(err);
        return false;
    }
}

exports.jobCompleted = async (requestId, passId, passResultId, toolId) => {
    try {
        if (!updateToolJob(requestId, passId, passResultId, toolId, 1)) { throw new customError.BadRequestError('something went wrong while completing the job'); }

        if (allReqPassCompleted(requestId, passId)) {
            await db.query('UPDATE Pass SET completed = TRUE, completedAt = NOW() WHERE id = ' + passId + ' AND requestId = ' + requestId + ';');
            removeReqPass(requestId, passId)
            if (await this.initReqPass(requestId, passId) == false) {
                await db.query('UPDATE Request SET completed = TRUE, completedAt = NOW() WHERE id = ' + requestId + ';');
            }
        }

        return true;
    } catch(err) {
        console.log('jobCompleted Error:');
        console.log(err);
        return false;
    }
}