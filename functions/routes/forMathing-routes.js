const express = require('express');
const {
    getAllM_user,
    getM_user,
    dequeue,
    Match,
    pushToQ
} = require('../controlllers/forMathing_ctrl')

const router = express.Router()

router.get('/Match', async(req, res, next) => {
    try {
        let matched = await Match();
        res.status(200).send(matched);
    } catch (error) {
        res.status(400).send(error);
    }
})
router.get('/pushQ/:id', async(req, res, next) => {
    try {
        const data = await pushToQ(req.params.id);
        res.status(200).send(data)
    } catch (error) {
        res.status(400).send(error);
    }
})
router.delete('/dequeue/:id', dequeue)
module.exports = {
    routs: router,
    pushToQ
}