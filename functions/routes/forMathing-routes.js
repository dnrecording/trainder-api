const express = require('express');
const {
    getAllM_user,
    getM_user,
    dequeue,
    Match,
    pushToQ,
    findTrainer
} = require('../controlllers/forMathing_ctrl')

const router = express.Router()

router.get('/Match', async(req, res, next) => {
    try {
        console.log('Mathcing.....')
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
router.get('/findTrainer/:id', async(req, res, next) => {
    try {
        console.log('In Routes')
        const data = await findTrainer(req.params.id);
        res.status(200).send(data)
    } catch (error) {
        res.status(400).send(error.message);
    }
})


module.exports = {
    routs: router,
    pushToQ
}