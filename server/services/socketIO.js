const io = require('socket.io-client');

let socket = undefined;

exports.connect = () => {
    socket = io("ws://localhost:" + process.env.DSP_PORT + '/?type=server&password=' + process.env.API_SERVER_PASS);
    socket.on('connect', () => {
        console.log('Dispatcher Connected!');
    })
}

module.exports.socket = socket;