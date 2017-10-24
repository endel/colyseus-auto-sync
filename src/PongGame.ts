import * as PIXI from "pixi.js";

import { syncMap, syncObject, listen, EntityMap } from "./sync/helpers";
import { Player } from "./entities/Player";
import { Ball } from "./entities/Ball";

import { DataChange } from "delta-listener";

export class PongGame extends PIXI.Application {

    @syncMap(Player, PongGame.onPlayerAdded, PongGame.onPlayerRemoved)
    players: EntityMap<Player> = {};

    @syncObject(Ball, PongGame.onBallAdded, PongGame.onBallRemoved)
    ball: Ball;

    scores: EntityMap<PIXI.Text> = {};

    constructor () {
        super();
    }

    static onPlayerAdded (app: PongGame, player: Player, change: DataChange) {
        let text = new PIXI.Text("0", { fill: 0xffffff });
        text.x = (player.x < 10) ? 200 : 600;
        text.y = 10;

        app.scores[ change.path.id ] = text;

        app.stage.addChild(text);
        app.stage.addChild(player);
    }

    static onPlayerRemoved (app: PongGame, player: Player) {
        app.stage.removeChild(player);
    }

    static onBallAdded (app: PongGame, ball: Ball) {
        app.stage.addChild(ball);
    }

    static onBallRemoved (app: PongGame, ball: Ball) {
        app.stage.removeChild(ball);
    }

    @listen("players/:id/score")
    onChangeScore (change: DataChange) {
        this.scores[ change.path.id ].text = change.value;
    }

}
