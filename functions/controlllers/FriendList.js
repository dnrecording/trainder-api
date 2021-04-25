
"use strict";
const e = require("express");
// const { MAX_TIMEOUT_SECONDS } = require('firebase-functions');
// const { ref } = require('firebase-functions/lib/providers/database');
const {
    admin
} = require("../database");
const db = admin.firestore();



const addFriend = async (person1_id,person2_id) => {
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
    if (data_1.data().friendList == null) {
        var friends1 = [];
    } else {
        var friends1 = [...data_1.data().friendList];
    }
    if (data_2.data().friendList == null) {
        var friends2 = [];
    } else {
        var friends2 = [...data_2.data().friendList];
    }
    if (!friends1.find(ele => ele == data_2.id)) {
        friends1.push(data_2.id);
    }
    if (!friends2.find(ele => ele == data_1.id)) {
        friends2.push(data_1.id);
    }
    let f1 = {  friendList : friends1 }
    let f2  = { friendList : friends2 }
    user1.update(f1);
    user2.update(f2);
    console.log('Add Friend ',person1_id, ' And ',person2_id)
    



};
const getAllFriend_id = async(myId) =>{
    console.log('Almost')
    const user = await db.collection('userData').doc(myId);
    console.log('good')
    const data = await user.get();
    if(!data.exists){
        console.log('There no Friend in list')

    }else {
        return data.data().friendList

    }
};
const removeFriend = async (person1_id,person2_id) => {
    
    console.log(person1_id);
    console.log('pull');
    const user1 = await db.collection("userData").doc(person1_id);    
    const user2 = await db.collection("userData").doc(person2_id);
    console.log('yep')
    const data_1 = await user1.get();    
    const data_2 = await user2.get();
    
    
    if (!data_1.exists || !data_2.exists) {
        throw "user with the given ID not found";
        return null;
    }
    if (data_1.data().friendList == null
    ||data_2.data().friendList ==null
    || !data_2.data().friendList.find(ele=> ele == person1_id)
    || !data_1.data().friendList.find(ele => ele == person2_id)) {
        throw "Not even a friend at first place"
        return null;
    } 
    var friends1  = [...data_1.data().friendList]
    var friends2 =  [...data_2.data().friendList]

    friends1 = friends1.filter(ele => ele != person2_id)
    friends2 =friends2.filter(ele => ele != person1_id)
        
    let f1 = {  friendList : friends1 }
    let f2  = { friendList : friends2 }
    user1.update(f1);
    user2.update(f2);
    console.log('UnFriend ',person1_id, ' And ',person2_id)
    
    



};
const getFriends_name = async (myId)=>{
    
    const user = await db.collection('userData').doc(myId);
   
    const data = await user.get();
    if(!data.exists){
        console.log('There no Friend in list')

    }else {
        var friends_name = []
        var  friends_id = data.data().friendList
        
        for (const friend_id of friends_id){
            try{const myFriend = await db.collection('userData').doc(friend_id)
            const myFriend_data = await myFriend.get()
            console.log(myFriend_data.data().fullName)
            friends_name.push(myFriend_data.data().fullName)
            console.log(friends_name)
            }catch(error){
                console.log('your freind deleted the account')
            }
        }
        
        
        return friends_name

    }

}
module.exports = { addFriend ,getAllFriend_id,removeFriend,getFriends_name};