const io = require('socket.io-client');


let connect = () => {
    let socket = io("ws://localhost:" + process.env.DSP_PORT + '/?type=server&password=' + process.env.API_SERVER_PASS);
    socket.on('connect', () => {
        console.log('Dispatcher Connected!')
    })
    return socket
}

let socket = connect();

module.exports.socket = socket;