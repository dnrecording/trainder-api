'use strict';
// const { MAX_TIMEOUT_SECONDS } = require('firebase-functions');
// const { ref } = require('firebase-functions/lib/providers/database');
const { admin } = require('../database');
const M_user = require('../models/forMatching');
const Paired = require('../models/Paired');


const db = admin.firestore();



function findPaired(ref, list) {
    // Pair similar people together
    let nowmax = -1;
    let tempList = [...list]
    let maxId = null;

    let refBd = ref.birth_day.split('-'); // BirthDay
    let refBy = parseInt(refBd[0]); // BirhtYear

    while (tempList.length) {
        let head = tempList.shift();

        let headBd = head.birth_day.split('-');
        let headBy = parseInt(headBd[0]);
        let score = 0;
        if (ref.genre === head.genre) {
            score += 0.75;

        }
        if (ref.purpose === head.purpose) {
            score += 0.75;
        }
        let dif_age = Math.abs(refBy - headBy);
        if (dif_age <= 3) {
            score += 0.75
        } else if (dif_age > 3 && dif_age < 8) {
            score += 0.5;
        } else {
            score += 0.25;
        }
        if (score > nowmax) {
            nowmax = score;
            maxId = head.id

        }



    }

    return maxId;
}



const getAllM_user = async(req, res, next) => {
    try {
        const users = await db.collection('userData');
        const data = await users.get();
        const User_Array = [];
        if (data.empty) {
            res.status(404).send('userData collection on database is empty');

        } else {

            data.forEach(doc => {
                //const user = new M_user(doc.id,doc.data().EC_skill,doc.data().Purpose,calAge(doc.data().Birhtday));
                const user = new M_user(doc.id, doc.data().EC_skill, doc.data().Purpose, doc.data().Birthday);
                User_Array.push(user);
            })
            console.table(User_Array);
            res.send(User_Array);

        }

    } catch (error) {
        res.status(400).send(error.message);
    }
}
const getM_user = async(req, res, next) => {
    try {
        const id = req.params.id;
        const user = await db.collection('userData').doc(id);
        const data = await user.get();
        if (!data.exists) {
            res.status(404).send('user with the given ID not found');

        } else {
            res.send(data.data());

        }
    } catch (error) {
        res.status(400).send(error.message)
    }
}

const Match = async(req, res, next) => {
    console.log('------------------------------------------');
    console.log('Matching');
    var paired_arr = [];
    //get data form database collection waitForMatch keep in User_Array
    try {
        const users = await db.collection('WaitForMatch');
        const data = await users.get();
        const User_Array = [];
        if (data.empty) {

            res.status(404).send('userData collection on database is empty');


        } else {

            data.forEach(doc => {
                const user = new M_user(doc.id, doc.data().EC_skill, doc.data().Purpose, doc.data().Birthday);
                User_Array.push(user);
            })





            while (User_Array.length > 1) {

                //Paring
                let ref = User_Array.shift();

                let ref_pair = findPaired(ref, User_Array);

                let this_pair = new Paired(ref.id, ref_pair);



                paired_arr.push(this_pair);
                for (var i = 0; i < User_Array.length; i++) {
                    if (User_Array[i].id === ref_pair) {
                        User_Array.splice(i, 1);
                        //remove who got match
                    }
                }



            }
            console.log("All Pair");
            console.table(paired_arr);
            console.log('Remain In Queue');
            console.table(User_Array);


            res.send('Open Console to see process');

        }

    } catch (error) {
        res.status(400).send(error.message);
        console.log(error.message);
    }
}

const pushToQ = async(req, res, next) => {
    // push to queue waiting for mathcing to database
    // Red flag : Might not have to push ?
    try {
        const data = req.body // this  front end has to integrate here

        await db.collection('WaitForMatch').doc().set(data);
        res.send('Record saved successfully');

    } catch (error) {
        res.status(400).send(error.message);

    }
}
const dequeue = async(req, res, next) => {
    //delete this use when user get paired or user get out
    try {
        const id = req.params.id;
        await db.collection('WaitForMatch').doc(id).delete();
        res.send('Record deleted successfully ');

    } catch (error) {
        res.status(400).send(error.message);
    }
}
module.exports = {

    getAllM_user,
    getM_user,
    Match,
    pushToQ,
    dequeue


}