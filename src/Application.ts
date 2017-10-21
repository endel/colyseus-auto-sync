import * as PIXI from "pixi.js";

import { sync, EntityMap } from "./sync/helpers";
import { Player } from "./entities/Player";
import { Ball } from "./entities/Ball";

let addToStage = (app, player) => app.stage.addChild(player);
let removeFromStage = (app, player) => app.stage.removeChild(player);

export class Application extends PIXI.Application {

    @sync(Player, "map", addToStage, removeFromStage)
    players: EntityMap<Player> = {};

    // @sync(Ball, "object", addToStage, removeFromStage)
    // ball: Ball;

}
