"use strict";
// const { MAX_TIMEOUT_SECONDS } = require('firebase-functions');
// const { ref } = require('firebase-functions/lib/providers/database');
const { admin } = require("../database");
const M_user = require("../models/forMatching");
const Paired = require("../models/Paired");
const { io } = require("../websocket");

const db = admin.firestore();

const makeid = function(length) {
    var result = [];
    var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result.push(
            characters.charAt(Math.floor(Math.random() * charactersLength))
        );
    }
    return result.join("");
};

module.exports = { makeid };