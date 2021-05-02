const express = require('express');
const { getLogByUID,getAllLogs, saveLog ,saveNoti,getAllNoti} = require('../controlllers/chatLog_ctrl')

const router = express.Router()


router.get('/getAllLogs/:myId',async (req, res,next) =>{
    try {
        data =  await getAllLogs(req.params.myId)
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
router.put('/saveLog',async(req,res,next)=>{
    try{
        /*{            
            "sender": "BdB1sFR5JxLA6Ov7FfvY",
            "LogRef": "dsw6bcWzPXvYoNjA",
            "msg": "So cool Bro",
            "date": "1923-12-12"
            }*/
        console.log("Routes")
        console.log(req.body)
        data  = await saveLog(req.body.LogRef,req.body.sender,req.body.msg,req.body.date)
        res.send(data)

    }catch(error){
        res.status(400).send(error.message)
    }
})
router.put('/saveNoti',async(req,res,next)=>{
    try{
        /*{ "userId" : jfsadlkjfdfs           
            "sender": "BdB1sFR5JxLA6Ov7FfvY",            
            "msg": "So cool Bro",
            "date": "1923-12-12"
            }*/
        console.log("Routes")
        console.log(req.body)
        data  = await saveNoti(req.body.userId,req.body.sender,req.body.msg,req.body.date)
        res.send(data)

    }catch(error){
        res.status(400).send(error.message)
    }
})
router.get('/getAllNoti/:userId',async (req, res,next) =>{
    try {
        data =  await getAllNoti(req.params.userId)
        res.send(data)
    }catch(error){
        res.status(400).send(error.message)
    }
})


module.exports = {
    routs: router

}