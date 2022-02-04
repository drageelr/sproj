const mysql = require('mysql');
const util = require('util');

const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

con.on('connect', (err) => {
    if (err) throw err;
    console.log("MYSQL DB Connected!");
    
})

module.exports.con = con;
module.exports.query = async (q) => {
    let query = util.promisify(con.query).bind(con);
    let result = await query(q);
    return result;
}