import * as PIXI from "pixi.js";

import { Client, Room } from "colyseus.js";
import { Player } from "./Player";

import { Application } from "./Application";
import { setup } from "./helpers";

let client = new Client("ws://localhost:2657");
let room = client.join("game");

let app = new Application();
setup(room, app);

document.body.appendChild(app.view);

function render () {
    app.render();
    window.requestAnimationFrame(render);
}

render();
