const ValidationError = require('express-validation').ValidationError;
const customError = require('./errors');

exports.errorHandler = (err, req, res, next) => {
    console.log(err);
    if (err instanceof customError.AuthenticationError ||
        err instanceof customError.ForbiddenAccessError ||
        err instanceof customError.NotFoundError ||
        err instanceof customError.DuplicateResourceError ||
        err instanceof customError.BadRequestError) {
        res.json({
            statusCode: err.statusCode,
            message: err.message,
            err: {
                name: err.name,
                details: err.details
            }
        });
    } else if (err instanceof ValidationError) {
        res.json({
            statusCode: 400,
            message: "Request object validation failed!",
            error: {
                name: "ValidationError",
                details: err.details
            }
        });
    } else {
        res.json({
            statusCode: 500,
            message: "Internal Server Error!"
        });
    }
}