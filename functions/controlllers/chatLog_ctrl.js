'use strict';
const { admin } = require('../database');

const { Course, myEvent } = require('../models/Course');
const logModel = require('../models/log_Model');

const db = admin.firestore();

const getAllLogs = async (myId) => {
    let allLogs = []
    var DocRef = []
    const FriendList = await db.collection("userData").doc(myId).collection("FriendList")
    const Friend = await FriendList.get()
    Friend.forEach(f => {

        DocRef.push(f.data().logs)
        //console.log(DocRef)



        //console.log(DocRef)
        //logs is DocRef
    })
    for (const docref of DocRef) {
        if(docref == null || docref == undefined ){ continue}
        const Logs = await db.collection("chat-logs").doc(docref).collection("Logs").get()
        
        Logs.forEach(log => {
            if (log.data().msg != null) {
                let newLog = new logModel(log.data().sender, log.data().reciever, log.data().msg, log.data().date)
                allLogs.push(newLog)
            }
        })
    }


    return allLogs
}

const getLogByUID = async (myId, Friend_UID) => {
    let allLogs = []
    var DocRef
    console.log("in")
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
const saveLog = async (senderId, recieverId, msg, date) => {

    let LogRef = await findLogRef(senderId, recieverId)
    console.log(LogRef)
    await db.collection("chat-logs").doc(LogRef).collection("Logs").doc().set({
        sender: senderId,
        reciever: recieverId,
        msg: msg,
        date: date
    })

    return 'Save Chat Log successfully '
}
const findLogRef = async (person1, person2) => {
    const friend = await db.collection("userData").doc(person1).collection("FriendList").doc(person2)
    const data = await friend.get()
    const uid = data.data().uid
    var DocRef
    const FriendList = await db.collection("userData").doc(person1).collection("FriendList")
    const Friend = await FriendList.where("uid", "==", uid).get()
    Friend.forEach(f => {
        // has only one Id but where function get it bundle
        DocRef = f.data().logs
        //console.log(DocRef)
        //logs is DocRef
    })
    return DocRef


}

module.exports = {
    getLogByUID, getAllLogs, saveLog
}
