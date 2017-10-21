import { Room } from "colyseus.js";
import { DataChange } from "delta-listener";
import { Synchable, EntityMap, Property } from "./types";
import * as listeners from "./listeners";

export { EntityMap };

export function sync (type?: any, holderType: string = 'var', addCallback?: Function, removeCallback?: Function): PropertyDecorator {
    return function (target: any & Synchable, propertyKey: string | symbol) {
        if (!target.properties) {
            target.properties = {};
        }

        let remap: string;

        if (typeof(type) === "string") {
            remap = type;
            type = undefined;
        }

        target.properties[propertyKey] = {
            type,
            remap,
            holderType,
            addCallback,
            removeCallback
        };
    }
}

export function setup (room: Room, synchable: any & Synchable) {
    createBindings(room, synchable, synchable);
}

let listenersMap: any = {};

export function createBindings (
    room: Room,
    synchable: any & Synchable,
    synchableRoot?: any & Synchable,
    parentSegment?: string
) {
    // no properties to sync
    if (!synchable.properties) return;

    // create bindings for properties
    for (let segment in synchable.properties) {
        let property: Property = synchable.properties[ segment ];
        let variable = segment.concat();

        if (property.remap) {
            segment = property.remap;
        }

        property.variable = variable;

        let path = (parentSegment)
            ? `${ parentSegment }/${ segment }`
            : segment;

        if (property.holderType === "map") {
            path += "/:id";
        }

        // skip if duplicate listenersMap
        if (listenersMap[path]) {
            return;

        } else {
            listenersMap[path] = true;
        }

        let listener = listeners[ `${ property.holderType }Listener` ];
        room.listen(path, listener(room, property, synchable, synchableRoot, path));
    }
}
