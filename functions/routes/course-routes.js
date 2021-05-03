const express = require('express');
const {
    addCourse,
    addEvent_toCourse,
    addEvent_toUser,
    isTableCollision,
    addCourseMember,
    joinCourse,
    getCourseData
} = require('../controlllers/Course_ctrl');

const router = express.Router()

router.get('/addCourse/:creatorid', async(req, res, next) => {


    try {
        console.log('Adding Course')
        await addCourse(req.params.creatorid);
        res.send('Added course Success fully')
    } catch (error) {
        res.status(400).send(error);
    }
})

router.get('/EventToCourse/:courseId/:uid', async(req, res, next) => {
    // caution: uid base on Film 

    try {
        console.log('Adding Event to Course')
        await addEvent_toCourse(req.params.courseId, req.params.uid)
        res.send('Added successfullly')
    } catch (error) {
        res.status(400).send(error);
    }
})
router.post('/EventToUser', async(req, res, next) => {
    //caution : uid base on Film
    try {
        console.log('Adding events to user table')
        data = await addEvent_toUser(req.body.courseId, req.body.uid)
        res.send(data)
    } catch (error) {
        res.status(400).send(error);
    }
})
router.get('/isCollision/:courseId/:uid', async(req, res, next) => {
    //caution : uid base on Film
    try {
        let ch = await isTableCollision(req.params.courseId, req.params.uid)
        console.log(ch)
        res.send('Check Collsion')
    } catch (error) {
        res.status(400).send(error);
    }
})
router.get('/addMember/:courseId/:userId', async(req, res, next) => {
    //caution : uid base on Film
    try {
        console.log('Adding member')
        await addCourseMember(req.params.courseId, req.params.userId)
        res.send('Added member successfullly')
    } catch (error) {
        res.status(400).send(error);
    }
})
router.post('/joinCourse', async(req, res, next) => {
    //caution : uid base on Film
    try {
        console.log('Joining Course')
        let result = await joinCourse(req.body.courseId, req.body.userId)
        res.send(result)
    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }
})

router.get('/getCourseData/:courseId', async(req, res, next) => {

    try {
        data = await getCourseData(req.params.courseId)
        res.send(data)
    } catch (error) {
        res.status(400).send(error);
    }
})


module.exports = {
    routs: router

}