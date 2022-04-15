// Load ENV vars
const path = require('path');

if (require('dotenv').config({ path: path.join(__dirname, '.env') })) {
    console.log('ENV Vars loaded!');
} else {
    console.log('Failed to load ENV Vars!');
}

// Dependancies
const db = require('./services/mysql');
const customError = require('./errors/errors');
const { errorHandler } = require('./services/socketIO/socketIOerrorhandler');
const { addServer, addTool, removeServer, removeTool } = require('./services/socketIO/socketIOnodes');
const { attachEventListeners } = require('./services/socketIO/socketIO');
// Initialize socket IO server
const io = require('socket.io')(process.env.PORT);
// Connect with the databse
db.con.connect();

// Attach event listeners to socket IO server
io.on('connection', async socket => {
    try {
        socket.on('disconnect', reason => {
            let node = socket.nodeObj;
            if (node) {
                if (node.type == 'server') {
                    removeServer();
                } else if (node.type == 'tool') {
                    removeTool(node.toolId);
                }
            }
            console.log(socket.id, "DISCONNECTED:", reason);
        });

        // Authenticate node & Add Node - [socketIONodes.js]
        //   Based on query params sent in the connection route
        //   Server: password, Tool(s): Id + password
        const conType = socket.handshake.query.type;
        const password = socket.handshake.query.password;
        const toolId = socket.handshake.query.toolId;
        if (!conType) { throw new customError.AuthenticationError('connection type not specified'); }
        
        let nodeObj = {
            type: conType
        }

        if (conType == 'server') {
            console.log('REQ PASS:', password)
            if (password != process.env.API_SERVER_PASS) { throw new customError.AuthenticationError('invalid password for api server'); }
            if (!addServer(socket.id)) { throw new customError.DuplicateResourceError('duplicate connection error'); }
        } 
        else if (conType == 'tool') {
            if (toolId == undefined) { throw new customError.AuthenticationError('toolId not specified'); }
        
            let reqTool = await db.query('SELECT * FROM Tool WHERE id = ' + toolId + ' AND password = "' + password + '";');
            if (!reqTool.length) { throw new customError.AuthenticationError('invalid toolId or password'); }
            
            nodeObj.toolId = reqTool[0].id;

            if (!addTool(socket.id, nodeObj.toolId)) { throw new customError.DuplicateResourceError('duplicate connection error'); }
        }

        // Attach Node Obj with socket
        socket.nodeObj = nodeObj;

        // Attach Event Listeners - [socketIOreqhandlers.js]
        attachEventListeners(socket);

        socket.join('/')

        // Send back an acknowledgement
        socket.emit('RES|net-connected');

        console.log(socket.id, socket.nodeObj.type, "CONNECTED!");
    } catch (err) {
        errorHandler(socket, err);
        socket.disconnect(true);
    }
});

module.exports.io = io;