import * as PIXI from "pixi.js";
import { sync } from "./helpers";
import { lerp } from "@gamestdio/mathf";

export class Player extends PIXI.Graphics {
    @sync('x') nextX: number = 0;
    @sync('y') nextY: number = 0;

    constructor () {
        super();

        this.beginFill(0xffffff);
        this.drawCircle(25, 25, 25);
        this.endFill();
    }

    updateTransform (...args) {
        this.x = lerp(this.x, this.nextX, 0.1);
        this.y = lerp(this.y, this.nextY, 0.1);

        super.updateTransform.apply(this, args);
    }

}

function MySprite() {
    this.autoUpdate = true;
    PIXI.Sprite.apply(this, arguments);
}
