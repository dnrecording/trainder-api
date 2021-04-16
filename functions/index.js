'use strict';
const { admin } = require('./database.js');
const express = require("express");
const app = express();
const http = require("http").Server(app);

const bodyParser = require('body-parser');

const cors = require('cors')
const M_userRoutes = require('./routes/forMathing-routes');
const studentRoutes = require('./routes/student-routes');
const { ResultStorage } = require('firebase-functions/lib/providers/testLab');
//const { getAllM_user } = require('./controlllers/forMathing_ctrl.js');


var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions))

app.use(express.json());

app.use('', studentRoutes.routs);
app.use('', M_userRoutes.routs);

app.get("/", function(req, res) {
    console.log("roots page")

    res.send("Hello Matha Fucker");

});

// exports.api = functions.region("asia-east2").https.onRequest(app);
http.listen(5000, function() {
    console.log("serve @  http://localhost:" + 5000);
});