import * as PIXI from "pixi.js";

import { syncMap, syncObject, EntityMap } from "./sync/helpers";
import { Player } from "./entities/Player";
import { Ball } from "./entities/Ball";

let addToStage = (app, player) => app.stage.addChild(player);
let removeFromStage = (app, player) => app.stage.removeChild(player);

export class PongGame extends PIXI.Application {

    @syncMap(Player, addToStage, removeFromStage)
    players: EntityMap<Player> = {};

    @syncObject(Ball, addToStage, removeFromStage)
    ball: Ball;

}
