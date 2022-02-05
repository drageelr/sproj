const db = require('../services/mysql');
const customError = require('../errors/errors');

exports.fetchReconAttributeList = async (req, res, next) => {
    try {
        let result = await db.query('SELECT * FROM In_Attr;');

        if (!result.length) { throw new customError.NotFoundError('no attribute(s) found'); }

        res.json({
            statusCode: 200,
            message: 'Recon Attribute List Fetched Successfully!',
            data: {
                attributes: result
            }
        });
    } catch (err) {
        next(err);
    }
}

exports.fetchReconRequestList = async (req, res, next) => {
    try {
        let result = await db.query('SELECT * FROM Request;');

        if (!result.length) { throw new customError.NotFoundError('no request(s) found'); }

        res.json({
            statusCode: 200,
            message: 'Request List Fetched Successfully!',
            data: {
                requests: result
            }
        });
    } catch (err) {
        next(err);
    }
}

exports.fetchReconRequest = async (req, res, next) => {
    try {
        let params = req.body;

        let reqRequset = await db.query('SELECT * FROM Request WHERE id = ' + params.requestId + ';');

        if (!reqRequset.length) { throw new customError.NotFoundError('no request found'); }

        let reqPasses = await db.query('SELECT id, createdAt, completedAt FROM Pass WHERE requestId = ' + params.requestId + ';');

        res.json({
            statusCode: 200,
            message: 'Request List Fetched Successfully!',
            data: {
                maxPasses: reqRequset.maxPasses,
                passes: reqPasses
            }
        });
    } catch (err) {
        next(err);
    }
}

exports.fetchReconRequestPass = async (req, res, next) => {
    try {
        let params = req.body;
        
        let reqPassResult = await db.query('SELECT * FROM Pass_Result WHERE requestId = ' + params.requestId + ' AND passId  = ' + params.passId + ';');

        if (!reqPassResult.length) { throw new customError.NotFoundError('no data for pass found'); }

        // let reqTools = await db.query('SELECT DISTINCT id, name FROM Tool WHERE id IN (SELECT toolId FROM Pass_Result WHERE requestId = ' + params.requestId + ' AND passId  = ' + params.passId + ');');

        // let reqToolOutAttrs = await db.query('SELECT DISTINCT id, name, type, toolId FROM Tool_Out_Attr WHERE toolId IN (SELECT toolId FROM Pass_Result WHERE requestId = ' + params.requestId + ' AND passId  = ' + params.passId + ');');

        let reqToolInfo = await Promise.all([db.query('SELECT DISTINCT id, name FROM Tool WHERE id IN (SELECT toolId FROM Pass_Result WHERE requestId = ' + params.requestId + ' AND passId  = ' + params.passId + ');'), db.query('SELECT DISTINCT id, name, type, toolId FROM Tool_Out_Attr WHERE toolId IN (SELECT toolId FROM Pass_Result WHERE requestId = ' + params.requestId + ' AND passId  = ' + params.passId + ');')]);
        
        let toolMap = {};
        // Map tools
        for (let i = 0; i < reqToolInfo[0].length; i++) {
            toolMap[reqToolInfo[0][i].id] = {
                id: reqToolInfo[0][i].id,
                name: reqToolInfo[0][i].name,
                attrs: {},
                result: []
            }
        };

        // Map tool_out_attrs
        for (let i = 0; i < reqToolInfo[1].length; i++) {
            toolMap[reqToolInfo[1][i].toolId].attrs[reqToolInfo[1][i].toolOutId] = {
                id: reqToolInfo[1][i].toolOutId,
                name: reqToolInfo[1][i].name,
                type: reqToolInfo[1][i].type
            }
        }

        // Map result
        for (let i = 0; i < reqPassResult.length; i++) {
            let attr = toolMap[reqPassResult[i].toolId].attrs[reqPassResult[i].toolOutId];
            toolMap[reqPassResult[i].toolId].result.append({
                name: attr.name,
                type: attr.type,
                value: reqPassResult[i].value
            });
        }

        // Convert to array
        let tools = [];
        for (let i of toolMap) {
            tools.append({
                id: toolMap[i].id,
                name: toolMap[i].name,
                result: toolMap[i].result
            });
        }

        res.json({
            statusCode: 200,
            message: 'Request List Fetched Successfully!',
            data: {
                tools: tools
            }
        });
    } catch (err) {
        next(err);
    }
}

exports.submitReconRequest = async (req, res, next) => {
    try {
        let params = req.body;

        if (!(await db.query('SELECT id FROM In_Attr WHERE id = ' + params.attribute.id + ';')).length) { throw new customError.NotFoundError('attribute not found'); }

        let reqRequest = await db.query('INSERT INTO Request (maxPasses, createdAt) VALUES (' + params.maxPasses + ', NOW());');

        let reqPass = await db.query('INSERT INTO Pass (id, requestId, createdAt) VALUES (0, ' + reqRequest.insertId + ', NOW());');

        await db.query('INSERT INTO Pass_Result (id, passId, requestId, value, inAttrId) VALUES (1, ' + reqPass.insertId + ', ' + reqRequest.insertId + ', ' + params.attribute.value + ', ' + params.attribute.id + ');');
        
        // Fetch the relevant tool apis and initiate them by sending them requestId and passId - TODO
        // Note this logic will also be repeated in docker. But would have to apply number of passes constraint in order to restrict infinite loop - TODO

        res.json({
            statusCode: 200,
            message: 'Recon Request Successfully Submitted!',
            data: {
                id: reqRequest.insertId
            }
        });
    } catch (err) {
        next(err);
    }
}