"use strict";
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

module.exports = { express, app, http, io }