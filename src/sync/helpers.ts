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

        let variable: string | symbol = propertyKey;

        if (typeof(type) === "string") {
            variable = propertyKey;
            propertyKey = type;
            type = undefined;
        }

        target.constructor.properties[propertyKey] = {
            type,
            holderType,
            addCallback,
            removeCallback,
            variable: variable
        };
    }
}

export function listen (path: string): MethodDecorator {
    return function (target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
        if (!target.constructor.listeners) {
            target.constructor.listeners = {};
        }
        target.constructor.listeners[ path ] = propertyKey;
    }
}

let listenersMap: any = {};

export function createBindings (
    room: Room,
    synchable: any & Synchable,
    synchableRoot?: any & Synchable,
    parentSegment?: string
) {
    bindProperties(synchable.constructor.properties || synchable.properties, room, synchable, synchableRoot, parentSegment);
    bindListeners(synchable.constructor.listeners, room, synchable);
}

function bindProperties (
    properties: { [id: string]: Property },
    room: Room,
    synchable: any & Synchable,
    synchableRoot?: any & Synchable,
    parentSegment?: string
) {
    // no properties to sync
    if (!properties) return;

    // create bindings for properties
    for (let segment in properties) {
        let property: Property = properties[ segment ];

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

export function bindListeners (
    listeners: { [path: string]: any },
    room: Room,
    synchable: any & Synchable
) {
    if (!listeners) {
        return;
    }

    for (let path in listeners) {
        room.listen(path, synchable[ listeners[ path ] ].bind(synchable));
    }
}
