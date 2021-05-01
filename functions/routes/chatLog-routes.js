const express = require('express');
const { getLogByUID,getAllLogs, saveLog } = require('../controlllers/chatLog_ctrl')

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
router.post('/saveLog',async(req,res,next)=>{
    try{
        /*{            
            "sender": "BdB1sFR5JxLA6Ov7FfvY",
            "reciever": "BLw6bcWzPXvYoNjiZkJA",
            "msg": "So cool Bro",
            "date": "1923-12-12"
            }*/
        console.log("Routes")
        console.log(req.body)
        data  = await saveLog(req.body.sender,req.body.msg,req.body.date)
        res.send(data)

    }catch(error){
        res.status(400).send(error.message)
    }
})


module.exports = {
    routs: router

}