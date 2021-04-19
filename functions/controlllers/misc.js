"use strict";
// const { MAX_TIMEOUT_SECONDS } = require('firebase-functions');
// const { ref } = require('firebase-functions/lib/providers/database');
const {
    admin
} = require("../database");
const M_user = require("../models/forMatching");
const Paired = require("../models/Paired");
const {
    io
} = require("../websocket")

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
}

const pushtoQ = async function(uid) {
    try {
        const id = uid;
        const user = await db.collection("userData").doc(id);
        const data = await user.get();

        if (!data.exists) {
            return
        } else {
            await db.collection("WaitForMatch").doc(id).set(data.data());
            return data.data()
        }
    } catch (error) {
        return error.message;
    }
}

module.exports = { makeid, pushtoQ }