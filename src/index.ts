import * as PIXI from "pixi.js";
import { Client, Room } from "colyseus.js";
import Keycode from "@gamestdio/keycode";
import { setup } from "./sync/helpers";

import { Application } from "./Application";

let client = new Client("ws://localhost:2657");
let pongRoom = client.join("pong");

let app = new Application();
setup(pongRoom, app);

document.body.appendChild(app.view);

function render () {
    app.render();
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
