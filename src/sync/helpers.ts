import { Room } from "colyseus.js";
import { DataChange } from "delta-listener";

export type EntityMap<T> = {[ entityId:string ]: T};

interface Property {
    holderType: 'var' | 'map' | 'list';
    type?: any;
    remap?: string;
    addCallback?: Function;
    removeCallback?: Function;
}

interface Synchable {
    properties?: Property[];
}

export function sync (type?: any, holderType: string = '', addCallback?: Function, removeCallback?: Function): PropertyDecorator {
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

let listeners: any = {};

function createBindings (
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

        let path = (parentSegment)
            ? `${ parentSegment }/${ segment }`
            : segment;

        if (property.holderType === "map") {
            path += "/:id";

        } else if (property.holderType === "var") {
            path += `/${ segment }`;
        }

        // skip if duplicate listeners
        if (listeners[path]) {
            return;

        } else {
            listeners[path] = true;
        }

        console.log("path:", path, "segment:", segment, "variable:", variable);

        let onChange = function (change: DataChange) {
            if (change.operation === "add") {
                let newType = new property.type();

                // assign all variables to new instance type
                for (let prop in change.value) {
                    newType[ prop ] = change.value[ prop ];
                }

                synchable[ variable ][ change.path.id ] = newType;
                property.addCallback.call(synchableRoot, synchableRoot, newType);

                createBindings(room, newType, synchable, path);

            } else if (change.operation === "replace") {
                synchableRoot[ this.rawRules[0] ][ change.path.id ][ variable ] = change.value;

            } else if (change.operation === "remove") {
                property.removeCallback.call(synchableRoot, synchableRoot, synchable[ variable ][ change.path.id ]);
                delete synchable[ variable ][ change.path.id ];

            }
        };

        room.onUpdate.addOnce(function (state) {
            for (let sessionId in state[ segment ]) {
                onChange({
                    operation: "add",
                    value: state[ segment ],
                    path: { id: sessionId }
                });
            }
        });

        room.listen(path, onChange);
    }
}
