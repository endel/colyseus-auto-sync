import * as PIXI from "pixi.js";
import { sync } from "../sync/helpers";
import { lerp } from "@gamestdio/mathf";

export class Ball extends PIXI.Graphics {
    @sync('x') nextX: number;
    @sync('y') nextY: number;

    constructor () {
        super();

        this.beginFill(0xffffff);
        this.drawCircle(0, 0, 25);
        this.endFill();
    }

    updateTransform (...args) {
        this.x = lerp(this.x, this.nextX, 0.1);
        this.y = lerp(this.y, this.nextY, 0.1);

        super.updateTransform.apply(this, args);
    }

}
