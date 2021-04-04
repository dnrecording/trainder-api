'use strict';
const { functions , admin } = require('./db.js');
const express = require("express");
const app = express();

const bodyParser =require('body-parser');

const cors = require('cors')

const studentRoutes  = require('../routes/student-routes');

var uid = "";

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }
app.use(cors(corsOptions))

app.use(express.json());

app.use('',studentRoutes.routs);

app.get("/", function (req, res) {
    console.log("root page");
    res.send("Hello matafakar");
});

exports.api = functions.region("asia-east2").https.onRequest(app);