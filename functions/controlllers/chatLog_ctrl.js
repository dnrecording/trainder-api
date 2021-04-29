'use strict';
const { admin } = require('../database');

const { Course, myEvent } = require('../models/Course');
const logModel = require('../models/log_Model');

const db = admin.firestore();

const getAllLogs = async (myId) => {
    let allLogs = []
    var DocRef
    const FriendList = await db.collection("userData").doc(myId).collection("FriendList")
    const Friend = await FriendList.get()
    Friend.forEach(f => {
       
        DocRef = f.data().logs
        //console.log(DocRef)
        const Logs = await db.collection("chat-logs").doc(DocRef).collection("Logs").get()

        Logs.forEach(log => {
            if (log.data().msg != null) {
                let newLog = new logModel(log.data().sender, log.data().reciever, log.data().msg, log.data().date)
                allLogs.push(newLog)
            }
        })
        //console.log(DocRef)
        //logs is DocRef
    })


    return allLogs
}

const getLogByUID = async (myId, Friend_UID) => {
    let allLogs = []
    var DocRef
    const FriendList = await db.collection("userData").doc(myId).collection("FriendList")
    const Friend = await FriendList.where("uid", "==", Friend_UID).get()
    Friend.forEach(f => {
        // has only one Id but where function get it bundle
        DocRef = f.data().logs
        //console.log(DocRef)
        //logs is DocRef
    })
    console.log(DocRef)
    const Logs = await db.collection("chat-logs").doc(DocRef).collection("Logs").get()

    Logs.forEach(log => {
        if (log.data().msg != null) {
            let newLog = new logModel(log.data().sender, log.data().reciever, log.data().msg, log.data().date)
            allLogs.push(newLog)
        }
    })

    return allLogs


}

module.exports = {
    getLogByUID ,getAllLogs
}
