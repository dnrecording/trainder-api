const express = require('express');
const { getLogByUID, getAllLogs, saveLog, saveNoti, getAllNoti, clearNoti, updateAllNoti } = require('../controlllers/chatLog_ctrl')

const router = express.Router()


router.get('/getAllLogs/:myId', async(req, res, next) => {
    try {
        data = await getAllLogs(req.params.myId)
        res.status(200).send(data)
    } catch (error) {
        res.status(400).send(error.message)
    }
})
router.get('/getLogByUID/:myId_FriendUID', async(req, res, next) => {

    try {

        let tempString = req.params.myId_FriendUID
        const word = tempString.split('&')
        let myId = word[0]
        let FriendUID = word[1]

        data = await getLogByUID(myId, FriendUID)
        res.status(200).send(data)

    } catch (error) {
        res.status(400).send(error.message)
    }
})
router.put('/saveLog', async(req, res, next) => {
    try {
        /*{            
            "sender": "BdB1sFR5JxLA6Ov7FfvY",
            "LogRef": "dsw6bcWzPXvYoNjA",
            "msg": "So cool Bro",
            "date": "1923-12-12"
            }*/
        console.log("Routes")
        console.log(req.body)
        data = await saveLog(req.body.LogRef, req.body.sender, req.body.msg, req.body.date)
        res.status(200).send(data)

    } catch (error) {
        res.status(400).send(error.message)
    }
})
router.put('/pushNoti', async(req, res, next) => {
    try {
        /*{ "userId" : jfsadlkjfdfs           
            "sender": "BdB1sFR5JxLA6Ov7FfvY",            
            "msg": "So cool Bro",
            "date": "1923-12-12"
            }*/
        console.log("Routes")
        console.log(req.body)
        data = await saveNoti(req.body.userId, req.body.sender, req.body.msg, req.body.date, req.body.type)
        res.status(200).send(data)

    } catch (error) {
        console.log(error)
        res.status(400).send(error.message)
    }
})
router.get('/getAllNoti/:userId', async(req, res, next) => {
    try {
        data = await getAllNoti(req.params.userId)
        res.status(200).send(data)
    } catch (error) {
        res.status(400).send(error.message)
    }
})
router.put('/clearNoti/:userId', async(req, res, next) => {
    try {
        data = await clearNoti(req.params.userId)
        res.status(200).send(data)
    } catch (error) {
        res.status(400).send(error.message)
    }
})
router.put('/updateNoti', async(req, res, next) => {
    try {

        data = await updateAllNoti(req.body.userId, req.body.notification)
        res.status(200).send(data)
    } catch (error) {
        res.status(400).send(error.message)
    }
})


module.exports = {
    routs: router

}