"use strict";
const e = require("express");
const { _topicWithOptions } = require("firebase-functions/lib/providers/pubsub");
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
const {
    makeid
} = require("./misc")

const db = admin.firestore();

function findPaired(ref, list) {
    // Pair similar people together

    let nowmax = -999999;
    let tempList = [...list];
    let maxId = null;

    let refBd = ref.birth_day.split("-"); // BirthDay

    let refBy = parseInt(refBd[0]); // BirhtYear

    while (tempList.length) {
        let head = tempList.shift();

        let headBd = head.birth_day.split("-");

        let headBy = parseInt(headBd[0]);
        let score = 0;
        if (ref.genre === head.genre) {
            score += 1.5;
        }
        if (ref.purpose === head.purpose) {
            score += 1.5;
        }
        let dif_age = Math.abs(refBy - headBy);
        if (dif_age <= 3) {
            score += 1;
        } else if (dif_age > 3 && dif_age < 8) {
            score += 0.75;
        } else {
            score += 0.25;
        }
        if (ref.ever_met.find((element) => element == head.id)) {
            score -= 15;
        }
        if (score > nowmax) {
            nowmax = score;
            maxId = head.id;
        }
    }

    return maxId;
}

const Match = async function () {
    console.log("------------------------------------------");
    console.log("Matching");
    var paired_arr = [];
    //get data form database collection waitForMatch keep in User_Array
    const users = await db.collection("WaitForMatch");
    const data = await users.get();
    const User_Array = [];
    if (data.empty) {
        throw "userData collection on database is empty"
    } else {
        data.forEach((doc) => {
            if (doc.data().ever_met == null) {
                var met_list = [];
            } else {
                var met_list = doc.data().ever_met;
            }
            const user = new M_user(
                doc.id,
                doc.data().EC_skill,
                doc.data().Purpose,
                doc.data().Birthday,
                met_list
            );
            if (
                user.genre == null ||
                user.purpose == null ||
                user.birth_day == null
            ) {
                db.collection("WaitForMatch").doc(user.id).delete();
                console.log(
                    "Invalid  information for matching form user Id :" + user.id
                );
            } else User_Array.push(user);
        });

        while (User_Array.length > 1) {
            //Paring
            let ref = User_Array.shift();

            let ref_pair = findPaired(ref, User_Array);

            let this_pair = new Paired(ref.id, ref_pair);
            // remove ones that got matched form database in WaitForMatch Collection
            await db.collection("WaitForMatch").doc(ref.id).delete();
            await db.collection("WaitForMatch").doc(ref_pair).delete();

            // update that these user ever met each other.
            // it works two way.
            let ref_met = []

            ref_met = [...ref.ever_met];
            if (!ref_met.find(ele => ele == ref_pair)) { ref_met = [...ref_met, ref_pair] }

            let met = {
                ever_met: ref_met,
            };
            const ref_data = db.collection("userData").doc(ref.id);
            await ref_data.update(met);

            const person2 = db.collection("userData").doc(ref_pair); // it's ref_pair
            const ref_pair_data = await person2.get();

            if (ref_pair_data.data().ever_met == null) {
                var met2_list = [ref.id];
            } else {
                if (!met2_list.find(ele => ele == ref.id))
                    var met2_list = [...ref_pair_data.data().ever_met, ref.id];
            }
            let met2 = {
                ever_met: met2_list,
            };
            await person2.update(met2);

            paired_arr.push(this_pair);
            for (var i = 0; i < User_Array.length; i++) {
                if (User_Array[i].id === ref_pair) {
                    User_Array.splice(i, 1);
                    //remove who got match
                }
            }
        }

        if (!paired_arr || paired_arr.length <= 0) {
            throw "No matched";
        }
        console.log("All Pair");
        console.table(paired_arr);
        console.log("Remain In Queue");
        console.table(User_Array);


        for (let i = 0; i < paired_arr.length; ++i) {
            let roomid = `${i}-${makeid(3)}`
            paired_arr[i].roomid = roomid
            io.sockets.emit('found-room', paired_arr[i].first, roomid)
            io.sockets.emit('found-room', paired_arr[i].second, roomid)
        }
        return paired_arr
    }
};

const pushToQ = async (id) => {
    console.log('pushing')
    //get dataform userData and Post into WaitForMatch collection
    const user = await db.collection("userData").doc(id);
    const data = await user.get();

    if (!data.exists) {
        throw "user with the given ID not found";
    } else {
        await db.collection("WaitForMatch").doc(id).set(data.data());
        try {
            await Match();
        } catch (err) {
            console.log(err)
        }
        return data.data();
    }
};


const findTrainer = async (userId) => {

    let trainers = await getAllTrainers()

    let top10 = []
    const user = await db.collection("userData").doc(userId).get()
    //console.log('All trainers')
    //console.table(trainers)
    let met_trainer = []
    if (user.data().met_trainer != null)
        met_trainer.push(...user.data().met_trainer)

    let ref = new M_user(user.id,
        user.data().EC_skill,
        user.data().Purpose,
        user.data().Birthday,
        met_trainer)

    console.log('Finding Trainer ')

    while(top10.length <10 && top10.length < trainers.length) {
        console.log('...')
        let trainerId = findPaired(ref, trainers)

        if (!met_trainer.find(ele => ele == trainerId)){
            met_trainer.push(trainerId)
            
        }
        let uid = userIdtoUID(trainerId)
        if(!top10.find(ele => ele == uid)){
        top10.push(await userIdtoUID(trainerId))
        //console.log(trainerId,await userIdtoUID(trainerId))
        }
            

        
        for (let j = 0; j < trainers.length; j++) {
            if (trainers[j].id == trainerId)
                trainers.splice(j, 1)
            //remove who get in queue
        }
    }
    //console.table(met_trainer)

    console.log('Top 10 ')
    console.table(top10)
    await db.collection("userData").doc(userId).update({ met_trainer: met_trainer })
    return top10


}
const userIdtoUID = async (userId) => {
    const user = await db.collection("userData").doc(userId)
    const data = await user.get()
    if(data.data().uid==null|| data.data().uid == undefined)
        console.log('Something Wrong')
    return data.data().uid
}

const getAllTrainers = async () => {

    let trainers = []
    const user_D = await db.collection("userData");
    const trainders = await user_D.where("role", "==", "trainer").get();


    if (trainders.empty) {
        console.log('There are no trainer ')
        return null
    }

    trainders.forEach(trainer => {

        // M_user class push
        const user = new M_user(
            trainer.id,
            trainer.data().EC_skill,
            trainer.data().Purpose,
            trainer.data().Birthday

        );
        if (
            user.genre == null ||
            user.purpose == null ||
            user.birth_day == null
        ) {

            console.log(
                "Invalid  information for Trainer  form  Id :" + user.id
            );
        } else trainers.push(user);


    });

    return trainers



}








module.exports = {
    Match,
    pushToQ,
    findTrainer
};