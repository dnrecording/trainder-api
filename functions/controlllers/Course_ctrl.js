'use strict';
const { admin } = require('../database');
const { Course, myEvent } = require('../models/Course');

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
const getEventsfromUser = async (uid) => {
    console.log('Getting all Events')
   
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
const uidToUserId = async(uid) =>{
    const user = await db.collection("userData").where("uid","==",uid).get()
    var userId
    user.forEach(doc=>{
        userId = doc.id
    })
    return userId
}
const addEvent_toCourse = async (CourseId, uid) => {
    // copy even from userTable to Course events
    // cuation : uid base on Film
  

    let arr = await getEventsfromUser(uid)
    let Events = [...arr]


    const course = await db.collection('Course').doc(CourseId)
   
    const data = await course.get()


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
const getCourseData= async (courseId) =>{
    
    var data =  await (await db.collection("Course").doc(courseId).get()).data()
    if(data ==null) {
        return 'No Member'
    }
    return data
}
const addEvent_toUser = async (courseId,uid) => {
    let userId = await uidToUserId(uid)
    
    
    if(await isTableCollision(courseId,userId)){
        
        return 'Collission can not merge table '
    }
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
    return 'Added successfully'





}
const isTableCollision  = async(courseId,userId) =>{
    let uid = await userIdtoUID(userId)
    let CourseEvents = await getEventsfromCourse(courseId)
    let UserEvents  = await getEventsfromUser(uid)

    // console.log('Course Table')
    // console.table(CourseEvents)
    // console.log('User table before Merge')
    // console.table(UserEvents)
    if(UserEvents ==[] || CourseEvents==[]){
        
        return false
    }
    for( const userEvent of UserEvents){
        for( const courseEvent of CourseEvents){
            
            
            var newEvent_start = courseEvent.start
            var newEvent_end = courseEvent.end
            var oldEvent_start = userEvent.start
            var oldEvent_end  = userEvent.end

          if((newEvent_start >= oldEvent_start  && newEvent_start <= oldEvent_end)
          || (newEvent_end >=oldEvent_start && newEvent_end <= oldEvent_end)
          || (oldEvent_start >=newEvent_start&& oldEvent_start <= newEvent_end )
          || (oldEvent_end >= newEvent_start && oldEvent_end <= newEvent_end)){
            console.log('%c Collide', 'background: #222 ;color: #bada55')
            console.log(' at',courseEvent.id,' <<<<>>>>>>',userEvent.id)
            
            return true
          }

        }
     


        
    }
    return false
 


}
const userIdtoUID = async(userId)=>{
    const user = await db.collection("userData").doc(userId)
    const data = await user.get()
    return data.data().uid
}
const addCourseMember  = async(courseId,userId)=>{
    const  course = await db.collection("Course").doc(courseId)
    const course_data = await course.get()
    var member = []
    if(course_data.data().member !=null){
        member.push(...course_data.data().member)
    }
    member.push(userId)
    await course.update({member : member})
    

   
    

   

}
const joinCourse = async(courseId,userId)=>{
    console.log(userId)
    const uid  = await userIdtoUID(userId)
    
    if(await isTableCollision(courseId,userId)){
        return 'Your schedule is not ready for this course please re ararage'
    }
    
    await addEvent_toUser(courseId,uid)
    await addCourseMember(courseId,userId)

    return 'You are member of this course now '

}
module.exports = {
    addCourse, addEvent_toCourse, addEvent_toUser,isTableCollision, addCourseMember,joinCourse,getCourseData
}