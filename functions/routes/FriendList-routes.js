const express = require('express');
const {
    addFriend, getAllFriend_id,removeFriend ,getFriends_name
} = require('../controlllers/FriendList')

const router = express.Router()


router.get('/addFriend/:id1/:id2', async(req, res, next) => {
    try {
        await addFriend(req.params.id1,req.params.id2);
        
    } catch (error) {
        res.status(400).send(error);
    }
})
router.get('/allFriend_id/:id' , async(req, res, next) => {
    try {
        data = await getAllFriend_id(req.params.id)
        res.send(data)
        
    } catch (error) {
        res.status(400).send(error);
    }
})
router.get('/unFriend/:id1/:id2', async(req, res, next) => {
    try {
        await removeFriend(req.params.id1,req.params.id2);
        
    } catch (error) {
        res.status(400).send(error);
    }
})
router.get('/allFriend_name/:id' , async(req, res, next) => {
    try {
        
        data = await getFriends_name(req.params.id)
        res.send(data)
        
    } catch (error) {
        res.status(400).send(error);
    }
})

module.exports = {
    routs: router
    
}