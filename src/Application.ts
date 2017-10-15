import * as PIXI from "pixi.js";

import { sync, EntityMap } from "./sync/helpers";
import { Player } from "./Player";

export class Application extends PIXI.Application {

    @sync(Player, "map",
        (app, player) => app.stage.addChild(player),
        (app, player) => app.stage.removeChild(player)
    )
    players: EntityMap<Player> = {};

}
