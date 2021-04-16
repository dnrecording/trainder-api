'use strict';
const { admin } = require('./database.js');
const express = require("express");
const app = express();
const http = require("http").Server(app);
var io = require("socket.io")(http, {
    cors: {
        // origin: "https://webrtc-test-8bef3.web.app",
        // origin: "http://localhost:8080",
        origin: "https://trainder.evera.cloud",
        methods: ["GET", "POST"],
        credentials: true,
    },
    // origins: "*:*"
});

const bodyParser = require('body-parser');

const cors = require('cors')
const M_userRoutes = require('./routes/forMathing-routes');
const studentRoutes = require('./routes/student-routes');
const { ResultStorage } = require('firebase-functions/lib/providers/testLab');
//const { getAllM_user } = require('./controlllers/forMathing_ctrl.js');


var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions))

app.use(express.json());

app.use('', studentRoutes.routs);
app.use('', M_userRoutes.routs);

app.get("/", function(req, res) {
    console.log("roots page")

    res.send("Hello Matha Fucker");

});

io.on("connection", function(socket) {
    console.log("a user connected ", socket.id);

    socket.emit("connected", socket.id);

    socket.on("deliver-info", (data) => {
        sessionClient[data] = socket.id
    })

    socket.on("disconnect", function() {
        console.log("user disconnected ", socket.id);
    });

    // chat
    socket.on("chat message", (room, msg) => {
        console.log("socket by : ", socket.id, "to : " + room + " message: " + msg);
        // ส่งข้อมูลกลับไปหาผู้ส่งมา
        io.in(room).emit("chat messaged", socket.id, msg);
    });

    // vdo_call
    socket.on("join-room", (name) => {
        console.log(`user ${socket.id} joining room : ${name}`);
        socket.join(name);
        socket.to(name).emit("user-joined-room", socket.id);
        const clients = io.sockets.adapter.rooms.get(name);
        // for (const clientId of clients) {

        //     //this is the socket of each client in the room.
        //     const clientSocket = io.sockets.sockets.get(clientId);
        //     console.log(clientId)
        //         //you can do whatever you need with this
        //         // clientSocket.leave('Other Room')

        // }
        socket.emit("joined", {
            roomName: name,
            users: [...clients.values()]
        });
    });

    socket.on("leave-room", (name) => {
        console.log(`user ${socket.id} leaving room : ${name}`);
        socket.to(name).emit("user-leaved-room", socket.id)
        socket.leave(name)
    })

    socket.on("offer", (id, to, message) => {
        console.log(`${socket.id} offer to ${to}`)
        socket.to(id).emit("offer", socket.id, to, message);
    });
    socket.on("answer", (id, to, message) => {
        console.log(`${socket.id} answer to ${to}`)
        socket.to(id).emit("answer", socket.id, to, message);
    });
    socket.on("candidate", (id, to, message) => {
        console.log("candidate : " + socket.id)
        socket.to(id).emit("candidate", socket.id, to, message);
    });
});

// exports.api = functions.region("asia-east2").https.onRequest(app);
http.listen(5000, function() {
    console.log("serve @  http://localhost:" + 5000);
});