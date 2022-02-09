const { ValidationError } = require('../../errors/errors');
const Schema = require('validate');

const validations = {
    // Request Management
    'req-submit': new Schema({
        requestId: {
            type: Number,
            required: true
        },
        passId: {
            type: Number,
            required: true
        }
    }),

    // Job Management
    'job-completed': new Schema({
        requestId: {
            type: Number,
            required: true
        },
        passId: {
            type: Number,
            required: true
        },
        passResultId: {
            type: Number,
            required: true
        }
    }),

    'net-ping': undefined
}

exports.validate = (event, obj) => {
    let schema = validations[event];
    if (schema) {
        let errors = schema.validate(obj);
        if (errors.length) {
            return new ValidationError("'REQ|" + event + "': " + errors[0].message);
        }
    }
    return undefined;
}