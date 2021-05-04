const express = require("express");
const {
    addFriend,
    getAllFriend_id,
    removeFriend,
    getFriends_name,
    getAllFriends,
} = require("../controlllers/FriendList");

const router = express.Router();

router.post("/addFriend", async(req, res, next) => {
    try {
        await addFriend(req.body.id1, req.body.id2);
        res.status(200).send("Done");
    } catch (error) {
        res.status(400).send(error);
    }
});
router.get("/allFriend_id/:id", async(req, res, next) => {
    try {
        data = await getAllFriend_id(req.params.id);
        res.status(200).send(data);
    } catch (error) {
        res.status(400).send(error);
    }
});
router.delete("/unFriend", async(req, res, next) => {
    try {
        await removeFriend(req.body.id1, req.body.id2);
        res.status(200).send("Done");
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});
router.get("/allFriend_name/:id", async(req, res, next) => {
    try {
        data = await getFriends_name(req.params.id);
        res.status(200).send(data);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get("/allFriends/:id", async(req, res, next) => {
    try {
        data = await getAllFriends(req.params.id);
        res.status(200).send(data);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});

module.exports = {
    routs: router,
};