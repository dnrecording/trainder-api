const express = require('express');
const {
    addFriend, getAllFriend,removeFriend
} = require('../controlllers/FriendList')

const router = express.Router()


router.get('/addFriend/:id1/:id2', async(req, res, next) => {
    try {
        await addFriend(req.params.id1,req.params.id2);
        
    } catch (error) {
        res.status(400).send(error);
    }
})
router.get('/allFriend/:id' , async(req, res, next) => {
    try {
        data = await getAllFriend(req.params.id)
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

module.exports = {
    routs: router
    
}