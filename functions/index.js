const { admin } = require("./database.js");
const { express, app, http, io } = require("./websocket.js");

const bodyParser = require("body-parser");

const cors = require("cors");
const M_userRoutes = require("./routes/forMathing-routes");
const studentRoutes = require("./routes/student-routes");
const FriendListRoutes = require("./routes/FriendList-routes");
const CourseRoutes = require("./routes/course-routes");
const ChatRoutes = require("./routes/chatLog-routes");
const { ResultStorage } = require("firebase-functions/lib/providers/testLab");
const { pushToQ } = require("./controlllers/forMathing_ctrl");
//const { getAllM_user } = require('./controlllers/forMathing_ctrl.js');

var corsOptions = {
    origin: true,
    method: ["GET", "POST"],
    //, "HEAD", "PUT", "PATCH", "DELETE"
    //preflightContinue: false,
    //optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

app.use(express.json());

app.use("", studentRoutes.routs);
app.use("", M_userRoutes.routs);
app.use("", FriendListRoutes.routs);
app.use("", CourseRoutes.routs);
app.use("", ChatRoutes.routs);
app.get("/", function(req, res) {
    console.log("roots page");

    res.send("Trainder Api Right Here.");
});

var sessionClient = {};

io.on("connection", function(socket) {
    console.log("a user connected ", socket.id);

    socket.on("deliver-info", (data) => {
        // remove existed user
        if (!data) return;
        console.log(`info delivered from ${socket.id} : `);
        console.log(data);
        // check by uid
        let Existed = Object.keys(sessionClient).find(
            (id) => sessionClient[id].uid == data.uid
        );
        if (Existed) {
            delete sessionClient[Existed];
        }
        sessionClient[socket.id] = {
            ...data,
            room: "",
        };
        pushToQ(data.uid);
        socket.emit("connected", socket.id);
    });

    socket.on("deliver-info-custom", (data) => {
        // remove existed user
        if (!data) return;
        console.log(`info delivered from ${socket.id} : `);
        console.log(data);
        // check by uid
        let Existed = Object.keys(sessionClient).find(
            (id) => sessionClient[id].uid == data.uid
        );
        if (Existed) {
            delete sessionClient[Existed];
        }
        sessionClient[socket.id] = {
            ...data,
            room: "",
        };
        socket.emit("connected", socket.id);
    });

    // chat
    socket.on("chat message", (room, msg, date) => {
        console.log("socket by : ", socket.id, "to : " + room + " message: " + msg);
        // ส่งข้อมูลกลับไปหาผู้ส่งมา
        io.in(room).emit(
            "chat messaged",
            socket.id,
            sessionClient[socket.id],
            msg,
            date
        );
    });

    // vdo_call
    socket.on("join-room", (name) => {
        console.log(`user ${socket.id} joining room : ${name}`);
        sessionClient[socket.id].room = name;
        socket.join(name);
        socket
            .to(name)
            .emit("user-joined-room", socket.id, sessionClient[socket.id]);
        const clients = io.sockets.adapter.rooms.get(name);
        socket.emit("joined", {
            roomName: name,
            users: [...clients.values()].map((id) => sessionClient[id]),
        });
    });

    socket.on("disconnect", () => {
        console.log(`user ${socket.id} disconnected`);
        if (sessionClient[socket.id]) {
            io.to(sessionClient[socket.id].room).emit(
                "user-leaved-room",
                socket.id,
                sessionClient[socket.id]
            );

            delete sessionClient[socket.id];
        }
    });

    socket.on("leave-room", (name) => {
        console.log(`user ${socket.id} leaving room : ${name}`);
        sessionClient[socket.id].room = "";
        socket
            .to(name)
            .emit("user-leaved-room", socket.id, sessionClient[socket.id]);
        socket.leave(name);
    });

    socket.on("offer", (id, to, message) => {
        console.log(`${socket.id} offer to ${to}`);
        socket.to(id).emit("offer", socket.id, to, message);
    });
    socket.on("answer", (id, to, message) => {
        console.log(`${socket.id} answer to ${to}`);
        socket.to(id).emit("answer", socket.id, to, message);
    });
    socket.on("candidate", (id, to, message) => {
        console.log("candidate : " + socket.id);
        socket.to(id).emit("candidate", socket.id, to, message);
    });
});

// exports.api = functions.region("asia-east2").https.onRequest(app);
http.listen(5000, function() {
    console.log("serve @  http://localhost:" + 5000);
});