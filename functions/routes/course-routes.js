const express = require('express');
const  {addCourse , addEvent_toCourse}  = require('../controlllers/Course_ctrl');

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

router.get('/EventToCourse/:courseId/:userId', async(req, res, next) => {

    
    try {
        console.log('Adding Event to Course')
        await addEvent_toCourse(req.params.courseId,req.params.userId)
        res.send('Added successfullly')
    } catch (error) {
        res.status(400).send(error);
    }
})



module.exports = {
    routs: router
    
}