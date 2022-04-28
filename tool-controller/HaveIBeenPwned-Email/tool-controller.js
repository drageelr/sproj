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
const { exec } = require('child_process');
// Initialize socket IO client
const socket = io("ws://localhost:" + process.env.DSP_PORT + '/?type=tool&password=' + process.env.TOOL_PASSWORD + '&toolId=' + process.env.TOOL_ID);
// Connect with the databse
db.con.connect();

socket.on('RES|job-dispatched', async (res) => {
    /**
     * res = {requestId: Int, passId: Int, passResultId: Int}
     */
    console.log(res);

    let reqValue = await db.query('SELECT value FROM Pass_Result WHERE id = ' + res.passResultId + ' AND passId = ' + (res.passId - 1) + ' AND requestId = ' + res.requestId + ';');

    if (reqValue.length == 0) { throw new Error("no input value"); }

    /**
     * Write implementation here for Tool Script integration
     */

    exec('python3 ../../tool-scripts/HaveIBeenPwned.js ' + reqValue[0].value, async (error, stdout, stderr) => {
        console.log(stdout);
        const result = JSON.parse(stdout);
        console.log(result);
        
        if (!((await db.query('SELECT id FROM Pass WHERE id = ' + res.passId + ';')).length)) {
            try {
                await db.query('INSERT INTO Pass (id, requestId, createdAt) VALUES (' + res.passId + ', ' + res.requestId + ', NOW());')
            } catch(err) {
                console.log(err)
            }
        }

        let i = 1;
        for (let attr in result) {
            console.log('attr', i, attr)
            await db.query('INSERT INTO Pass_Result (passId, requestId, value, toolOutId, toolId) VALUES (' + res.passId + ', ' + res.requestId + ', "' + result[attr] + '", ' + 1 + ', ' + process.env.TOOL_ID + ');');
            i++;
        }
        
        /**
         * Notify server when job is done
         */
        socket.emit('REQ|job-completed', res);
    });

})

