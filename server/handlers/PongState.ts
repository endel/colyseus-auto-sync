import { EntityMap, nosync } from "colyseus";
import ClockTimer from "@gamestdio/timer";

import { Player } from "../entities/Player";
import { Ball } from "../entities/Ball";

const MARGIN = 4;
const PLAYER_SPEED = 10;
const BALL_SPEED = 5;

export class PongState {
    players: EntityMap<Player> = {};

    boundaries = {
        x: MARGIN,
        y: MARGIN,
        width: 800 - MARGIN,
        height: 600 - MARGIN
    };

    ball: Ball = new Ball();

    countdown: number = 5;

    @nosync timer = new ClockTimer(false);
    @nosync started: boolean = false;

    addPlayer (sessionId: string, numClients: number) {
        let player = new Player();
        player.x = (numClients === 1) ? MARGIN : this.boundaries.width - player.width;
        player.y = this.boundaries.y;

        this.players[ sessionId ] = player;
    }

    removePlayer (sessionId: string) {
        // TODO: show abandoned status on client-side
        this.started = false;

        delete this.players[ sessionId ];
    }

    movePlayer (sessionId: string, direction) {
        this.players[ sessionId ].direction = direction;
    }

    start () {
        this.resetBall();
        this.timer.start();
        this.started = true;
    }

    update () {
        // let moveAmount = this.timer.elapsedTime > 0 ? this.timer.elapsedTime / 10 : 1;
        let moveAmount = 3;

        if (this.started) {
            /* Change direction of ball when hitting a wall */
            if (
                this.ball.y + this.ball.radius > this.boundaries.height ||
                this.ball.y - this.ball.radius < 0
            ) {
                if(this.ball.y <= this.ball.radius) {
                    this.ball.y = this.ball.radius;

                } else {
                    this.ball.y = this.boundaries.height - this.ball.radius;
                }

                this.ball.vy *= -1;
            }

            /* checking collision between ball and player */
            let playerIds = Object.keys(this.players);

            let player1 = this.players[ playerIds[1] ];
            let player2 = this.players[ playerIds[0] ];

            if (this.ball.x + this.ball.radius >= this.boundaries.width - player1.width) {
                if (
                    this.ball.y >= player1.y &&
                    this.ball.y <= player1.y + player1.height
                ) {
                    if (this.ball.vx <= this.ball.maxSpeed) {
                        this.ball.vx += this.ball.multiplier;
                    }

                    this.changeBallDirection(player1);

                } else {
                    player2.score++;
                    this.resetBall();
                    this.ball.vx = -1;

                    // TODO: reset ball
                    // this.ball.reset();
                }

            } else if (this.ball.x - this.ball.radius <= player2.width) {
                /* checking collision between ball and cpu */
                if (
                    this.ball.y >= player2.y &&
                    this.ball.y <= player2.y + player1.height
                ) {
                    if(this.ball.vx >= -this.ball.maxSpeed) {
                        this.ball.vx -= this.ball.multiplier;
                    }

                    this.changeBallDirection(player2);

                } else {
                    player1.score++;
                    this.resetBall();
                    this.ball.vx = 1;

                    // this.ball.reset();
                }
            }

            this.ball.x += this.ball.vx * moveAmount;
            this.ball.y += this.ball.vy * moveAmount;
        }

        // move players to direction from input
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

    changeBallDirection (player) {
        if (player.y + player.height / 2 > this.ball.y) {
            this.ball.vy -= ((player.y + player.height / 2) - this.ball.y) / player.height * this.ball.maxSpeed;

        } else if(player.y + player.height / 2 < this.ball.y) {
            this.ball.vy += (this.ball.y - (player.y + player.height / 2)) / player.height * this.ball.maxSpeed;
        }

        this.ball.vx *= -1;
    }

    resetBall () {
        this.ball.reset();
        this.ball.x = this.boundaries.width / 2;
        this.ball.y = this.boundaries.height / 2;
    }

}
