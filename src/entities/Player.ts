import * as PIXI from "pixi.js";
import { sync } from "../sync/helpers";
import { lerp } from "@gamestdio/mathf";

export class Player extends PIXI.Graphics {
    @sync('x') x: number;
    @sync('y') nextY: number;

    constructor () {
        super();

        this.beginFill(0xffffff);
        this.drawRect(0, 0, 30, 200);
        this.endFill();
    }

    updateTransform (...args) {
        if (this.nextY) {
            this.y = lerp(this.y, this.nextY, 0.09);
        }

        super.updateTransform.apply(this, args);
    }

}

