const { admin } = require("./database.js");
const { express, app, http, io } = require("./websocket.js");

const bodyParser = require("body-parser");
const url = require('url');
const querystring = require('querystring');
const db = admin.firestore();

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
    origin: "https://api.evera.cloud",
    method: ["GET", "POST", "HEAD", "PUT", "PATCH", "DELETE"],
    //, "HEAD", "PUT", "PATCH", "DELETE"
    //preflightContinue: false,
    //credentials: true,
    //optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

function getCalScale(weight=60, sport='jogging') {
    function scaleValue(value, from, to) {
	    var scale = (to[1] - to[0]) / (from[1] - from[0]);
	    var capped = Math.min(from[1], Math.max(from[0], value)) - from[0];
	    return ~~(capped * scale + to[0]);
    }
    let scale=0;
    switch(sport) { //cal per 30 minutes
        case 'jogging':
            scale = scaleValue(weight,[240],[336]);
            break;
        case 'running':
            scale = scaleValue(weight,[375],[525]);
            break;
        case 'swimming_general':
            scale = scaleValue(weight,[180],[252]);
            break;
        case 'swimming_laps':
            scale = scaleValue(weight,[300],[420]);
            break;
        default:
            scale = 240;
        }
        //cal_burned_per_minute
    return scale /30;
}

//getDate 0000-00-00 year-month-date
function getStatDate() {
    let d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth()+1;
    month = (month<10)?'0'+month:month;
    let date = d.getDate();
    date = (date<10)?'0'+date:date;
    let myDate = `${year}-${month}-${date}`;
    return myDate;
}

//timer api <start> /timerStart?uid=<uid>
app.get('/timerStart', async function(req, res) { //this function works when people start exercise in live event
    let myuid = req.query.uid; //get uid from queryString (parameter) in url
    let myTime = Math.floor(Date.now() / 1000); //get time stamp in seconds
    let myQuery = db.collection('exTime').doc(myuid) //open exTime Collection with user's uid as doc's id
    await myQuery.set({ //record timestamp in the collection as startTime field
        startTime: myTime
    });
    //console.log("success timerStart")
    try {
        res.status(200).send('started');
    } catch (error) {
        res.status(400).send(error);
    }
});
//timer api <stop> /timerStop?uid=<uid>
app.get('/timerStop', async function(req, res) {
    let myuid = req.query.uid; //get uid from queryString (parameter) in url
    let myTime = Math.floor(Date.now() / 1000); //get time stamp in seconds
    let myQuery = db.collection('exTime').doc(myuid) //open exTime Collection with user's uid as doc's id
    let doc = await myQuery.get();
    //console.log('Start Time is : ', doc.data().startTime); //=======================
    let totalTime = myTime - doc.data().startTime;
    await myQuery.set({ //delete startTime
        startTime: 0
    })
    let totalTimeMin = parseFloat(totalTime / 60); //minute of exercised
    totalTimeMin = Math.round(totalTimeMin*10)/10;
    //year-month-date with 0 if 1 digit << must
    let myStatDate = getStatDate(); //get Date now in stat format
    myQuery = db.collection('userStats').doc(myuid); //query doc
    doc = await myQuery.get(); //get doc
    let weight;
    if (doc.exists){
        weight = doc.data().weight; //get user's weight
    } else{
        weight = 60;
    }
    myQuery = db.collection('userStats').doc(myuid).collection('history').doc(myStatDate); //query history of today
    doc = await myQuery.get(); //get doc
    if (!doc.exists) { //check doc if exists
        await myQuery.set({ //if not create new doc with preset data
            cal_burned : totalTimeMin * getCalScale(weight),
            cal_eaten : {
                morning : 0,
                noon : 0,
                evening : 0
            },
            date : myStatDate,
            exercise_time : totalTimeMin
        })
    } else { // if exist update doc with new data
        let prev_cal = parseFloat(doc.data().cal_burned);
        let prev_time = parseFloat(doc.data().exercise_time);
        await myQuery.update({
            cal_burned : prev_cal + (totalTimeMin * getCalScale(weight)),
            exercise_time : prev_time + totalTimeMin
        })
    }
    //console.log("success timerStop")
    try {
        res.status(200).send('stoped');
    } catch (error) {
        res.status(400).send(error);
    }
});

// exports.api = functions.region("asia-east2").https.onRequest(app);
http.listen(5000, function() {
    console.log("serve @  http://localhost:" + 5000);
});