import { Room } from "colyseus";

import { PongState } from "./PongState";

export class PongRoom extends Room<PongState> {
    maxClients = 2;

    onInit (options) {
        this.setState(new PongState());
        this.setSimulationInterval(() => this.state.update());
    }

    onJoin (client) {
        this.state.addPlayer(client.sessionId, this.clients.length);

        if (this.clients.length === 2) {
            // prevent new players from joining
            this.lock();

            this.state.start();
        }
    }

    onLeave (client) {
        this.state.removePlayer(client.sessionId);
    }

    onMessage (client, data) {
        // skip invalid commands
        if (typeof(data) !== "number") {
            return;
        }

        console.log("onMessage:", client.sessionId, data);

        this.state.movePlayer(client.sessionId, data);
    }

    onDispose () {
        console.log("Dispose ChatRoom");
    }

}
