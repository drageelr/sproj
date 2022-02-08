// Load ENV vars
const path = require('path');

if (require('dotenv').config({ path: path.join(__dirname, '.env') })) {
    console.log('ENV Vars loaded!');
} else {
    console.log('Failed to load ENV Vars!');
}

// Dependancies
const db = require('./services/mysql');
const io = require('socket.io-client');
// Initialize socket IO client
const socket = io("ws://localhost:" + process.env.DSP_PORT + '/?type=tool&password=' + process.env.TOOL_ID + '&toolId=' + process.env.TOOL_PASSWORD);
// Connect with the databse
db.con.connect();
