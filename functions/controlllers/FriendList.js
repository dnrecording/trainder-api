
"use strict";
const e = require("express");
// const { MAX_TIMEOUT_SECONDS } = require('firebase-functions');
// const { ref } = require('firebase-functions/lib/providers/database');
const {
    admin
} = require("../database");
const {makeid} =require("./misc")
const db = admin.firestore();



const addFriend = async (person1_id, person2_id) => {
    console.log('ADD')

    const user1 = await db.collection("userData").doc(person1_id);

    const user2 = await db.collection("userData").doc(person2_id);
    console.log('yep')
    const data_1 = await user1.get();

    const data_2 = await user2.get();


    if (!data_1.exists || !data_2.exists) {
        throw "user with the given ID not found";
        return null;
    }
   
    
    let log_id = makeid(15)
    const f1 = {
        id : data_1.id,
        uid: data_1.data().uid,
        name : data_1.data().fullName,
        logs : log_id
    }
    const f2 = {
        id : data_2.id,
        uid: data_2.data().uid,
        name : data_2.data().fullName,
        logs : log_id
    }
    
    await user1.collection("FriendList").doc(data_2.id).set(f2)
    await user2.collection("FriendList").doc(data_1.id).set(f1)
    console.log('Add Friend ', person1_id, ' And ', person2_id)

    await db.collection("chat-logs").doc(log_id).set({
        user1_Id: data_1.id,
        user2_Id: data_2.id,
        user1_uid : data_1.data().uid,
        user2_uid :data_2.data().uid,
        // It will have collection("logs")



    })
    await db.collection("chat-logs").doc(log_id).collection("logs").doc("Dummy").set({
        logModel : "Object"
    })



};


const getAllFriend_id = async (myId) => {
    let Friends_id  = []
    const FriendList = await db.collection("userData").doc(myId).collection("FriendList").get()
    FriendList.forEach(friend=>{
        if(friend.id != 'Dummy')
        Friends_id.push(friend.id) 
    })
    return Friends_id

};
const removeFriend = async (person1_id, person2_id) => {
   
    await db.collection("userData").doc(person1_id).collection("FriendList").doc(person2_id).delete()
    await db.collection("userData").doc(person2_id).collection("FriendList").doc(person1_id).delete()

};
const getFriends_name = async (myId) => {
    let Friends_name  = []
    const FriendList = await db.collection("userData").doc(myId).collection("FriendList").get()
    FriendList.forEach(friend=>{
        if(friend.id != 'Dummy')
        Friends_name.push(friend.data().name) 
    })
    return Friends_name

    

}
module.exports = { addFriend, getAllFriend_id, removeFriend, getFriends_name };