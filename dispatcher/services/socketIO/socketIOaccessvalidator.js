const { ForbiddenAccessError } = require('../../errors/errors');

const eventAccess = {
    // Request Management
    'req-submit': ['server'],

    // Job Management
    'job-completed': ['tool'],
    
    // Network Management
    'net-ping': ['server', 'tool']
};

exports.validateAccess = (event, type) => {
    try {
        let userAccess = eventAccess[event];

        if (userAccess) {
            for (let u of userAccess) {
                if (u === type) {
                    return undefined;
                }
            }
        }

        throw new ForbiddenAccessError("you are not allowed to emit this event");

    } catch (err) {
        return err;
    }
}