import * as PIXI from "pixi.js";
import { sync } from "../sync/helpers";
import { lerp } from "@gamestdio/mathf";

export class Ball extends PIXI.Graphics {
    @sync('x') nextX: number = 400;
    @sync('y') nextY: number = -100;

    constructor () {
        super();

        this.beginFill(0xffffff);
        this.drawCircle(0, 0, 25);
        this.endFill();
    }

    updateTransform (...args) {
        this.x = lerp(this.x, this.nextX, 0.25);
        this.y = lerp(this.y, this.nextY, 0.25);

        super.updateTransform.apply(this, args);
    }

}
