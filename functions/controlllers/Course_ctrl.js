'use strict';
const { admin } = require('../database');
const { Course, myEvent } = require('../models/Course');
const Student = require('../models/student')
const db = admin.firestore();
// addCoures and addEvent_toCourse just a prototype
const addCourse = async (creator_id) => {
    // Just PROTOTYPE 
    // for trainer only  
    console.log('In ctrl')
    const data = {
        creator: creator_id,
        genre: 'Weight',
        purpose: 'So good',
        members: [],
        events: []

    }
    console.log(data)


    await db.collection('Course').doc().set(data);


}
const getEvents = async (userId) => {
    console.log('Getting all Events')
    //let user = firebase.auth().currentUser;
    let uid = userId

    let tableRef = await db.collection("Table");
    let userData = await tableRef.where("uid", "==", uid).get();






    userData.forEach(doc => {
        this.userDocid = doc.id;
        //console.log(doc.id, '=>', doc.data());
    });

    let userEvent = await tableRef.doc(this.userDocid).collection("Event").get();
    const Events = [];
    userEvent.forEach(doc => {
        // console.log(doc.id, " => ", doc.data());
        if (JSON.stringify(doc.data()) != "{}") {

            let EventData = new myEvent(doc.id, doc.data().name, doc.data().creator, doc.data().start, doc.data().end, doc.data().color, doc.data().details)


            Events.push(EventData)



        }
    });


    return Events;
}
const addEvent_toCourse = async (CourseId,userId) => {
    // copy even from userTable to Course events
   
   
    let arr = await getEvents(userId)
    let Events = [...arr]


    //console.log('Pass get Event')
    // console.table(Events)
    const course = await db.collection('Course').doc(CouresId)
    //console.log('Before')
    const data = await course.get()
    // console.log(data.data())

    if (data.data().events == null) {
        console.log('It is empty')
        var list = []
        list.push(...Events)

    }
    else {
        var list = []

        list.push(...data.data().events)
        list.push(...Events)
    }

    //console.table(list)
    //console.log('above')
    const courseEvent = course.collection("Event")
    var i =0
    for (const event of list) {
        i++;
        await courseEvent.doc(event.id).set({
            id : event.id,
            name : event.name,
            creator : event.creator,
            start : event.start ,
            end   : event.end,
            color : event.color ,
            details : event.details

        })
        console.log(i)
    }
    



   


    //await course.update(newData)
    console.log('complete')
    res.send('Complete')



 







}

module.exports = {
    addCourse, addEvent_toCourse
}