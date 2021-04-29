const express = require('express');
const { getLogByUID,getAllLogs } = require('../controlllers/chatLog_ctrl')

const router = express.Router()


router.get('/getAllLogs/:myId',async (req, res,next) =>{
    try {
        data = await getAllLogs(req.params.myId)
        res.send(data)
    }catch(error){
        res.status(400).send(error.message)
    }
})
router.get('/getLogByUID/:myId_FriendUID', async (req, res, next) => {
    try {
        let tempString = req.params.myId_FriendUID
        const word = tempString.split('&')
        let myId = word[0]
        let FriendUID = word[1]

        data = await getLogByUID(myId,FriendUID)
        res.send(data)

    } catch (error) {
        res.status(400).send(error.message)
    }
})


module.exports = {
    routs: router

}