import * as PIXI from "pixi.js";
import { sync } from "../sync/helpers";
import { lerp } from "@gamestdio/mathf";

export class Ball extends PIXI.Graphics {
    _nextX: number = 400;
    _nextY: number = -100;

    constructor () {
        super();

        this.beginFill(0xffffff);
        this.drawCircle(0, 0, 25);
        this.endFill();
    }

    @sync('x')
    set nextX (value: number) {
        this._nextX = value;
    }

    @sync('y')
    set nextY (value: number) {
        this._nextY = value;
    }

    updateTransform (...args) {
        this.x = lerp(this.x, this._nextX, 0.25);
        this.y = lerp(this.y, this._nextY, 0.25);

        super.updateTransform.apply(this, args);
    }

}
