const express = require('express');
const {getAllM_user, getM_user, dequeue,Match,pushToQ} = require('../controlllers/forMathing_ctrl')

const router  = express.Router()

router.get('/Match',Match)
router.get('/pushQ/:id',pushToQ)
router.delete('/dequeue/:id',dequeue)
module.exports = {
    routs : router
}