const functions = require("firebase-functions");
const express = require("express");
const app = express();
const admin = require("firebase-admin");
const cors = require('cors')
var uid = "";
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }
app.use(cors(corsOptions))

app.get("/", function (req, res) {
    console.log("root page");
    res.send("Hello matafakar");
});

// app.get("/users", function (req, res) {
//     let users = [
//         { name : "John Doe", age : 22},
//         { name : "Jane Smith", age : 23},
//     ]
//     res.send(users);
//   });

app.post('/post-test', (req, res) => {
    uid = req;
    console.log('POST method');
    console.log('request:', req.body);
    console.log('response:', res.body);
    res.sendStatus(200);
});
console.log("wtf");
// app.get('/post-test', (req, res) => {
//     console.log('request:', req);
//     console.log('response:', res);
//     res.send('uid:', req);
//     //res.sendStatus(200);
// });

exports.api = functions.region("asia-east2").https.onRequest(app);
