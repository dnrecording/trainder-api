"use strict";
const { admin } = require("../database");

const { Course, myEvent } = require("../models/Course");
const logModel = require("../models/log_Model");

const db = admin.firestore();

const getAllLogs = async(myId) => {
    let allLogs = [];
    var DocRef = [];
    const FriendList = await db
        .collection("userData")
        .doc(myId)
        .collection("FriendList");
    const Friend = await FriendList.get();
    Friend.forEach((f) => {
        DocRef.push(f.data().logs);
        //console.log(DocRef)

        //console.log(DocRef)
        //logs is DocRef
    });
    for (const docref of DocRef) {
        if (docref == null || docref == undefined) {
            continue;
        }
        const Logs = await (
            await db.collection("chat-logs").doc(docref).get()
        ).data().logs;
        if (Logs == null || Logs == undefined) return "There no Logs";
        Logs.forEach((log) => {
            if (log.msg != null) {
                let newLog = new logModel(log.sender, log.msg, log.date);
                allLogs.push(newLog);
            }
        });
    }

    return allLogs;
};

const getLogByUID = async(myId, Friend_UID) => {
    let allLogs = [];
    var DocRef;
    const FriendList = await db
        .collection("userData")
        .doc(myId)
        .collection("FriendList");
    const Friend = await FriendList.where("id", "==", Friend_UID).get();

    Friend.forEach((f) => {
        // has only one Id but where function get it bundle
        DocRef = f.data().logs;
        //console.log(DocRef)
        //logs is DocRef
    });
    console.log(DocRef);
    const Logs = await (await db.collection("chat-logs").doc(DocRef).get()).data()
        .logs;
    if (Logs == null || Logs == undefined) return "There no Logs";
    Logs.forEach((log) => {
        if (log.msg != null) {
            let newLog = new logModel(log.sender, log.msg, log.date);
            allLogs.push(newLog);
        }
    });

    return {
        logId: DocRef,
        logs: allLogs,
    };
};
const saveLog = async(LogRef, senderId, msg, date) => {
    //const data = new logModel(senderId,msg,date)
    const data = {
        sender: senderId,
        msg: msg,
        date: date,
    };
    const Logs = await db.collection("chat-logs").doc(LogRef).get();
    const oldLog = await Logs.data().logs;
    var newLog = [];
    if (oldLog != null) {
        newLog.push(...oldLog);
    }
    newLog.push(data);
    console.log(newLog);
    await db.collection("chat-logs").doc(LogRef).update({
        logs: newLog,
    });

    return "Save Chat Log successfully ";
};
const findLogRef = async(person1, person2) => {
    const friend = await db
        .collection("userData")
        .doc(person1)
        .collection("FriendList")
        .doc(person2);
    const data = await friend.get();
    const uid = data.data().uid;
    var DocRef;
    const FriendList = await db
        .collection("userData")
        .doc(person1)
        .collection("FriendList");
    const Friend = await FriendList.where("uid", "==", uid).get();
    Friend.forEach((f) => {
        // has only one Id but where function get it bundle
        DocRef = f.data().logs;
        //console.log(DocRef)
        //logs is DocRef
    });
    return DocRef;
};
const saveNoti = async(userId, senderId, msg, date, type) => {
    //const data = new logModel(senderId,msg,date)
    const sender = await db.collection("userData").doc(senderId).get();
    if (!sender.exists && senderId != "system") {
        throw "sender doesn't exists.";
    }
    var data;
    if (senderId == "system") {
        data = {
            sender: "system",
            img: "",
            msg: msg,
            date: date,
            type: type,
        };
    } else
        data = {
            sender: sender.data().fullName,
            img: sender.data().profilePic,
            msg: msg,
            date: date,
            type: type,
        };
    const user = await db.collection("userData").doc(userId).get();
    const oldNoti = await user.data().notification;
    var newNoti = [];
    if (oldNoti != null) newNoti.push(...oldNoti);
    newNoti.push(data);
    console.log(newNoti)
    await db.collection("userData").doc(userId).update({
        notification: newNoti,
    });

    return "Save Notification successfully ";
};
const getAllNoti = async(myId) => {
    const user = await db.collection("userData").doc(myId).get();
    const Noti = await user.data().notification;
    var allNoti = [];
    if (Noti == null || Noti == undefined) return "There no notification";
    Noti.forEach((ele) => {
        allNoti.push(ele);
    });
    return allNoti;
};
const clearNoti = async(myId) => {
    await db.collection("userData").doc(myId).update({
        notification: [],
    });
    return "All notification has been delete";
};
const updateAllNoti = async(userId, noti) => {
    console.log(userId);
    console.table(noti);
    await db.collection("userData").doc(userId).update({
        notification: noti,
    });
    return "All notification has been update";
};

module.exports = {
    getLogByUID,
    getAllLogs,
    saveLog,
    saveNoti,
    getAllNoti,
    clearNoti,
    updateAllNoti,
};