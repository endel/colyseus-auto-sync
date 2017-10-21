import { nosync, EntityMap, generateId } from "colyseus";
import { PowerUp } from "./PowerUp";

export class Player {
    x: number;
    y: number;
    powerUps: EntityMap<PowerUp> = {};

    @nosync direction: number = 0;

    @nosync width = 30;
    @nosync height = 200;

    constructor () {
        this.addPowerUp();
    }

    // just to demonstrate @sync on the client-side
    addPowerUp () {
        this.powerUps[ generateId() ] = new PowerUp();
    }
}
