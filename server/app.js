const express = require('express');
const cookieParser = require('cookie-parser');

const { errorHandler } = require('./errors/errorhandler');
const db = require('./services/mysql');
const { connect, socket } = require('./services/socketIO');

const reconRouter = require('./routes/recon.route');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/recon', reconRouter);

app.use(errorHandler);

db.con.connect();
connect();

module.exports = app;
