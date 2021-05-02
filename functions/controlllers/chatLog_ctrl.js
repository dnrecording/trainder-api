'use strict';
const { admin } = require('../database');

const { Course, myEvent } = require('../models/Course');
const logModel = require('../models/log_Model');

const db = admin.firestore();

const getAllLogs = async(myId) => {
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
        if (docref == null || docref == undefined) { continue }
        const Logs = await (await db.collection("chat-logs").doc(docref).get()).data().logs

        Logs.forEach(log => {
            if (log.msg != null) {
                let newLog = new logModel(log.sender, log.msg, log.date)
                allLogs.push(newLog)
            }
        })
    }


    return allLogs
}

const getLogByUID = async(myId, Friend_UID) => {
    let allLogs = []
    var DocRef
    const FriendList = await db.collection("userData").doc(myId).collection("FriendList")
    const Friend = await FriendList.where("id", "==", Friend_UID).get()
    Friend.forEach(f => {
        // has only one Id but where function get it bundle
        DocRef = f.data().logs
            //console.log(DocRef)
            //logs is DocRef
    })
    console.log(DocRef)
    const Logs = await (await db.collection("chat-logs").doc(DocRef).get()).data().logs

    Logs.forEach(log => {
        if (log.msg != null) {
            let newLog = new logModel(log.sender, log.msg, log.date)
            allLogs.push(newLog)
        }
    })

    return { logId: DocRef, logs: allLogs }


}
const saveLog = async(LogRef,senderId, msg, date) => {

    
    
    //const data = new logModel(senderId,msg,date)
    const data = {
        sender : senderId,
        msg :msg,
        date :date
    }
    const Logs = await db.collection("chat-logs").doc(LogRef).get()
    const oldLog  = await Logs.data().logs
    var  newLog = []
    if(oldLog !=null){ newLog.push(...oldLog)}
    newLog.push(data)
    console.log(newLog)
    await db.collection("chat-logs").doc(LogRef).update({logs : newLog})



    return 'Save Chat Log successfully '
}
const findLogRef = async(person1, person2) => {
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
    getLogByUID,
    getAllLogs,
    saveLog
}