import { Room } from "colyseus";

export class GameRoom extends Room {
    maxClients = 10;

    onInit (options) {
        this.setState({
            messages: [],
            players: {}
        });

        this.setSimulationInterval(() => this.update());
    }

    onJoin (client) {
        this.state.players[ client.sessionId ] = {
            x: 0,
            y: 0
        };
    }

    onLeave (client) {
        delete this.state.players[ client.sessionId ];
    }

    onMessage (client, data) {
        this.state.messages.push(data.message);
    }

    update () {
        for (let sessionId in this.state.players) {
            this.state.players[sessionId].x += 0.5;
        }
    }

    onDispose () {
        console.log("Dispose ChatRoom");
    }

}
