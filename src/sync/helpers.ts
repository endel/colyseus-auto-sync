import { Room } from "colyseus.js";
import { DataChange } from "delta-listener";
import { Synchable, EntityMap, Property } from "./types";
import * as listeners from "./listeners";

export { EntityMap };

export function initializeSync (room: Room, synchable: any & Synchable) {
    createBindings(room, synchable, synchable);
}

export function syncMap (type?: any, addCallback?: Function, removeCallback?: Function): PropertyDecorator {
    return sync(type, "map", addCallback, removeCallback);
}

export function syncObject (type?: any, addCallback?: Function, removeCallback?: Function): PropertyDecorator {
    return sync(type, "object", addCallback, removeCallback);
}

export function syncVar (type?: any, addCallback?: Function, removeCallback?: Function): PropertyDecorator {
    return sync(type, "var");
}

export function syncList (type?: any, addCallback?: Function, removeCallback?: Function): PropertyDecorator {
    return sync(type, "list", addCallback, removeCallback);
}

export function sync (type?: any, holderType: string = 'var', addCallback?: Function, removeCallback?: Function): PropertyDecorator {
    return function (target: any & Synchable, propertyKey: string | symbol) {
        if (!target.constructor.properties) {
            target.constructor.properties = {};
        }

        let remap: string;

        if (typeof(type) === "string") {
            remap = type;
            type = undefined;
        }

        target.constructor.properties[propertyKey] = {
            type,
            remap,
            holderType,
            addCallback,
            removeCallback
        };
    }
}

let listenersMap: any = {};

export function createBindings (
    room: Room,
    synchable: any & Synchable,
    synchableRoot?: any & Synchable,
    parentSegment?: string
) {
    let properties = synchable.constructor.properties || synchable.properties;

    // no properties to sync
    if (!properties) return;

    // create bindings for properties
    for (let segment in properties) {
        let property: Property = properties[ segment ];
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

        if (property.type) {
            createBindings(room, property.type, synchable, path);
        }
    }
}
