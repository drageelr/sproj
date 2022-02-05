const Joi = require('express-validation').Joi;

exports.fetchReconAttributeList = {
    body: Joi.object({

    })
};

exports.fetchReconRequestList = {
    body: Joi.object({

    })
};

exports.fetchReconRequest = {
    body: Joi.object({
        requestId: Joi.number().integer().required()
    })
};

exports.fetchReconRequestPass = {
    body: Joi.object({
        requestId: Joi.number().integer().required(),
        passId: Joi.number().integer().required()
    })
};

exports.submitReconRequest = {
    body: Joi.object({
        attribute: Joi.object({
            id: Joi.number().integer().required(),
            value: Joi.string().required()
        }).required(),
        maxPasses: Joi.number().integer().required()
    })
};
