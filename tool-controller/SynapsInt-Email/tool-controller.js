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

const attrIdMap = {
    "blacklist": 1,
    "malicious activity": 2,
    "recent malicious activity": 3,
    "leaked credentials": 4,
    "recent leaked credentials": 5,
    "data breach": 6,
    "first seen": 7,
    "last seen": 8,
    "domain exists": 9,
    "domain reputation": 10,
    "new domain": 11,
    "days since domain creation": 12,
    "suspicios tld": 13,
    "spam": 14,
    "free provider": 15,
    "disposable": 16,
    "deliverable": 17,
    "accept all": 18,
    "valid mx": 19,
    "spoofable": 20,
    "spf strict": 21,
    "dmarc enforced": 22
}

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

    exec('python3 ../../tool-scripts/synapsint.py ' + reqValue[0].value + ' email', async (error, stdout, stderr) => {
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
            if (attrIdMap[attr]) {
                await db.query('INSERT INTO Pass_Result (passId, requestId, value, toolOutId, toolId) VALUES (' + res.passId + ', ' + res.requestId + ', "' + result[attr] + '", ' + attrIdMap[attr] + ', ' + process.env.TOOL_ID + ');');
            }
            i++;
        }
        
        /**
         * Notify server when job is done
         */
        socket.emit('REQ|job-completed', res);
    });

})

