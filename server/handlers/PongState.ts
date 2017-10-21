import { EntityMap, nosync } from "colyseus";
import ClockTimer from "@gamestdio/timer";

import { Player } from "../entities/Player";
import { Ball } from "../entities/Ball";

const MARGIN = 4;
const PLAYER_SPEED = 10;
const BALL_SPEED = 1;

export class PongState {
    players: EntityMap<Player> = {};

    boundaries = {
        x: MARGIN,
        y: MARGIN,
        width: 800 - MARGIN,
        height: 600 - MARGIN
    };

    ball: Ball = new Ball(this.boundaries.width / 2, this.boundaries.height / 2);

    countdown: number = 5;

    @nosync timer = new ClockTimer();

    addPlayer (sessionId: string, numClients: number) {
        let player = new Player();
        player.x = (numClients === 1) ? MARGIN : this.boundaries.width - player.width;
        player.y = this.boundaries.y;

        this.players[ sessionId ] = player;
    }

    removePlayer (sessionId: string) {
        delete this.players[ sessionId ];
    }

    movePlayer (sessionId: string, direction) {
        this.players[ sessionId ].direction = direction;
    }

    start () {
        // start game after 5 seconds
        // this.timer.setTimeout(() => {
            this.ball.angle = Math.random();
        // }, 5000);
    }

    update () {
        if (this.ball.angle !== undefined) {
            this.ball.x += Math.sin(this.ball.angle) * BALL_SPEED;
            this.ball.y += Math.cos(this.ball.angle) * BALL_SPEED;

            // TODO: collide with player
        }

        for (let sessionId in this.players) {
            let player = this.players[ sessionId ];

            if (player.direction !== 0) {
                let nextY = player.y + player.direction * PLAYER_SPEED;

                // player cannot run out of the bounds
                if (nextY > 0 && nextY < this.boundaries.height - player.height) {
                    player.y = nextY
                }
            }
        }
    }

}
