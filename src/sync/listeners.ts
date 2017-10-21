import { Room } from "colyseus.js";
import { DataChange } from "delta-listener";
import { Property, Synchable } from "./types";

export function objectListener (room: Room, property: Property, synchable: Synchable, synchableRoot?: Synchable, parentSegment?: string) {
    return function (change: DataChange) {
        if (change.operation === "add") {
            let newType = new property.type();

            // assign all variables to new instance type
            for (let prop in change.value) {
                newType[ prop ] = change.value[ prop ];
            }

            synchable[ property.variable ] = newType;
            property.addCallback.call(synchableRoot, synchableRoot, newType);

        } else if (change.operation === "replace") {
            synchableRoot[ this.rawRules[0] ][ property.variable ] = change.value;

        } else if (change.operation === "remove") {
            property.removeCallback.call(synchableRoot, synchableRoot, synchable[ property.variable ][ change.path.id ]);
            delete synchable[ property.variable ];
        }
    }
}

export function mapListener (room: Room, property: Property, synchable: Synchable, synchableRoot?: Synchable, parentSegment?: string) {
    return function (change: DataChange) {
        console.log("map:", change);
        if (change.operation === "add") {
            let newType = new property.type();

            // assign all variables to new instance type
            for (let prop in change.value) {
                newType[ prop ] = change.value[ prop ];
                console.log("set:", prop, change.value[ prop ]);
            }

            synchable[ property.variable ][ change.path.id ] = newType;
            property.addCallback.call(synchableRoot, synchableRoot, newType);

        } else if (change.operation === "replace") {
            synchableRoot[ this.rawRules[0] ][ change.path.id ][ property.variable ] = change.value;

        } else if (change.operation === "remove") {
            property.removeCallback.call(synchableRoot, synchableRoot, synchable[ property.variable ][ change.path.id ]);
            delete synchable[ property.variable ][ change.path.id ];
        }
    }
}

export function varListener (room: Room, property: Property, synchable: Synchable, synchableRoot?: Synchable, parentSegment?: string) {
    return function (change: DataChange) {
        //
        // TODO:
        // support deeper entities, with paths like: `entities/:id/items/:id`
        //
        let target = (change.path.id)
            ? synchableRoot[ this.rawRules[0] ][ change.path.id ]
            :  synchable;

        if (change.operation === "add") {
            target[ property.variable ] = change.value;

        } else if (change.operation === "replace") {
            target[ property.variable ] = change.value;

        } else if (change.operation === "remove") {
            delete target[ property.variable ];
        }
    }
}
