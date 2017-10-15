import { nosync } from "colyseus";

export class Player {
    x: number;
    y: number;

    @nosync direction: number = 0;

    @nosync width = 30;
    @nosync height = 200;

    // constructor (x: number, y: number) {
    //     this.x = x;
    //     this.y = y;
    // }
}
