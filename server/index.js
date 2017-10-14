"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var express = require("express");
var serveIndex = require("serve-index");
var http_1 = require("http");
var colyseus_1 = require("colyseus");
// Require ChatRoom handler
var game_1 = require("./rooms/game");
var port = Number(process.env.PORT || 2657);
var app = express();
// Create HTTP Server
var httpServer = http_1.createServer(app);
// Attach WebSocket Server on HTTP Server.
var gameServer = new colyseus_1.Server({ server: httpServer });
// Register room
gameServer.register("game", game_1.GameRoom);
app.use(express.static(path.join(__dirname, "static")));
app.use('/', serveIndex(path.join(__dirname, "static"), { 'icons': true }));
gameServer.listen(port);
console.log("Listening on http://localhost:" + port);
