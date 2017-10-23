import { nosync } from "colyseus";

export class Ball {
    x: number;
    y: number;

    @nosync vx: number = Math.round(Math.random()) ? 1 : -1;
    @nosync vy: number = Math.random() * 4 - 2;

    @nosync radius = 25;
    @nosync maxSpeed = 5;
    @nosync multiplier = .2;

    constructor () {
    }

    update () {
    }

}
