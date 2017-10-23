import { Room } from "colyseus.js";
import { DataChange } from "delta-listener";
import { Property, Synchable } from "./types";

function assign (instance: any, property: Property, propName: string, value: any) {
    if (property.holderType === "var") {
        instance[ propName ] = value;

    } else if (property.holderType === "map") {
        for (let entityId in value) {
            instance[ propName ][ entityId ] = new property.type();
            // assignMultiple (instance[ propName ][ entityId ], property.type.properties, value[ entityId ])
        }
    }
}

// function assignMultiple (instance: any, properties: Property[], value: any) {
//     for (let prop in properties) {
//         assign(instance, properties[ prop ], prop, value[ prop ]);
//     }
// }

function getInstanceContainer (root: any, path: string[], offset = 0) {
    let instance = root;

    for (var i = 0, len = path.length; i < len + offset; i++) {
        if (typeof(instance[ path[i] ]) !== "object") {
            break;
        }
        instance = instance[ path[i] ];
    }

    return instance;
}

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
        let instance = getInstanceContainer(synchableRoot, change.rawPath);

        if (change.operation === "add") {
            let newType = new property.type();
            newType.__mapParent = getInstanceContainer(synchableRoot, change.rawPath, -2);

            // assign all variables to new instance type
            // assignMultiple(newType, property.type.properties, change.value);

            instance[ change.path.id ] = newType;

            if (property.addCallback) {
                property.addCallback.call(newType.__mapParent, newType.__mapParent, newType);
            }

        } else if (change.operation === "replace") {
            assign(instance, property, property.variable, change.value);

        } else if (change.operation === "remove") {
            if (property.removeCallback) {
                property.removeCallback.call(instance.__mapParent, instance.__mapParent, instance);
            }

            delete synchable[ property.variable ][ change.path.id ];
        }
    }
}

export function varListener (room: Room, property: Property, synchable: Synchable, synchableRoot?: Synchable, parentSegment?: string) {
    return function (change: DataChange) {
        let target = getInstanceContainer(synchableRoot, change.rawPath);

        if (change.operation !== "remove") {
            assign(target, property, property.variable, change.value);

        } else if (change.operation === "remove") {
            delete target[ property.variable ];
        }
    }
}
