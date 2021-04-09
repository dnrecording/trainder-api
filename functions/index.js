const functions = require("firebase-functions");
const express = require("express");
const app = express();
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
app.get("/", function (req, res) {
  res.send("Hello World!");
});

app.get("/users", function (req, res) {
    let users = [
        { name : "John Doe", age : 22},
        { name : "Jane Smith", age : 23},
    ]
    res.send(users);
  });
 
  // Test pushing
exports.api = functions.region("asia-east2").https.onRequest(app);
