import * as PIXI from "pixi.js";
import { Client, Room } from "colyseus.js";
import Keycode from "@gamestdio/keycode";
import { initializeSync } from "./sync/helpers";

import { PongGame } from "./PongGame";

// use 2657 port on localhost.
let port = (window.location.hostname.indexOf("localhost")) >= 0 ? ":2657" : "";
let client = new Client(`${ window.location.protocol.replace("http", "ws") }//${ window.location.hostname }${ port }`);
let pongRoom = client.join("pong");

let game = new PongGame();
initializeSync(pongRoom, game);

document.body.appendChild(game.view);

function render () {
    game.render();
    window.requestAnimationFrame(render);
}

render();

// player controls
window.onkeydown = function(e) {
    if (e.which === Keycode.UP || e.which === Keycode.W) {
        pongRoom.send(-1);

    } else if (e.which === Keycode.DOWN || e.which === Keycode.S) {
        pongRoom.send(1);

    }
}

window.onkeyup = function(e) {
    if (
        e.which === Keycode.UP ||
        e.which === Keycode.W ||
        e.which === Keycode.DOWN ||
        e.which === Keycode.S
    ) {
        pongRoom.send(0);
    }
}
