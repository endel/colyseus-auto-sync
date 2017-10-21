import * as PIXI from "pixi.js";
import { sync, syncMap, EntityMap } from "../sync/helpers";
import { lerp } from "@gamestdio/mathf";

import { PowerUp } from "./PowerUp";

export class Player extends PIXI.Graphics {
    @sync('x') x: number;
    @sync('y') nextY: number;

    @syncMap(PowerUp) powerUps: EntityMap<PowerUp> = {};

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
