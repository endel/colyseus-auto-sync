"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var colyseus_1 = require("colyseus");
var GameRoom = /** @class */ (function (_super) {
    __extends(GameRoom, _super);
    function GameRoom() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.maxClients = 10;
        return _this;
    }
    GameRoom.prototype.onInit = function (options) {
        var _this = this;
        this.setState({
            messages: [],
            players: {}
        });
        this.setSimulationInterval(function () { return _this.update(); });
    };
    GameRoom.prototype.onJoin = function (client) {
        this.state.players[client.sessionId] = {
            x: 0,
            y: 0
        };
    };
    GameRoom.prototype.onLeave = function (client) {
        delete this.state.players[client.sessionId];
    };
    GameRoom.prototype.onMessage = function (client, data) {
        this.state.messages.push(data.message);
    };
    GameRoom.prototype.update = function () {
        for (var sessionId in this.state.players) {
            this.state.players[sessionId].x += 0.5;
        }
    };
    GameRoom.prototype.onDispose = function () {
        console.log("Dispose ChatRoom");
    };
    return GameRoom;
}(colyseus_1.Room));
exports.GameRoom = GameRoom;
