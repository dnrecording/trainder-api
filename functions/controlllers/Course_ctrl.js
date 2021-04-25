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
const getEventsfromUser = async (userId) => {
    console.log('Getting all Events')
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
        if (JSON.stringify(doc.data()) != "{}") {
            let EventData = new myEvent(doc.id, doc.data().name, doc.data().creator, doc.data().start, doc.data().end, doc.data().color, doc.data().details)
            Events.push(EventData)
        }
    });


    return Events;
}
const addEvent_toCourse = async (CourseId, userId) => {
    // copy even from userTable to Course events


    let arr = await getEventsfromUser(userId)
    let Events = [...arr]


    //console.log('Pass get Event')
    // console.table(Events)
    const course = await db.collection('Course').doc(CourseId)
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
    var i = 0
    for (const event of list) {
        i++;
        await courseEvent.doc(event.id).set({
            id: event.id,
            name: event.name,
            creator: event.creator,
            start: event.start,
            end: event.end,
            color: event.color,
            details: event.details

        })
        console.log(i)
    }
}
const getEventsfromCourse = async (courseId) => {
    console.log('Going in')
    const course = await db.collection('Course').doc(courseId)
    const courseEvents = await course.collection('Event').get()
    
    let Events  =[]
    courseEvents.forEach(doc => {
        let EventData = new myEvent(doc.id, doc.data().name, doc.data().creator, doc.data().start, doc.data().end, doc.data().color, doc.data().details)
        Events.push(EventData)

    })

    return Events



}
const addEvent_toUser = async (courseId,uid) => {
    // caution : uid base on Film
    let Events =  await getEventsfromCourse(courseId)    
    const Table = await db.collection("Table")
    const userTable_baseUID = await Table.where("uid", "==", uid).get()    
    var table_id 
    userTable_baseUID.forEach(doc =>{ 
        // User always has one table       
         table_id = doc.id
    })
    const userEvent  =await Table.doc(table_id).collection("Event")
    
    
    for (const event of Events) {
        
        await userEvent.doc(event.id).set({
            id: event.id,
            name: event.name,
            creator: event.creator,
            start: event.start,
            end: event.end,
            color: event.color,
            details: event.details

        })

    }




   
    
    
   
    

    
    
    
    console.log('Fuck UId')
    // for (const event of Events) {
        
    //     await userEvents.doc(event.id).set({
    //         id: event.id,
    //         name: event.name,
    //         creator: event.creator,
    //         start: event.start,
    //         end: event.end,
    //         color: event.color,
    //         details: event.details

    //     })
        
    // }



}
module.exports = {
    addCourse, addEvent_toCourse, addEvent_toUser
}