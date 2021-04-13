const express = require('express');
const {getAllM_user, getM_user, dequeue,Match,pushToQ} = require('../controlllers/forMathing_ctrl')

const router  = express.Router()

router.get('/M_users',getAllM_user)
router.get('/M_user/:id',getM_user)
router.get('/Match',Match)
router.post('/pushQ',pushToQ)
router.delete('/dequeue/:id',dequeue)
module.exports = {
    routs : router
}