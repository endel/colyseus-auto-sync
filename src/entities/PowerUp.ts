import { sync } from "../sync/helpers";

export class PowerUp {
    @sync() count: number;

    constructor () {
        console.log("construct PowerUp!");
    }

}
