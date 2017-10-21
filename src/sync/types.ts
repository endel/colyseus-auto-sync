export type EntityMap<T> = {[ entityId:string ]: T};

export interface Property {
    holderType: 'var' | 'object' | 'map' | 'list';
    type?: any;
    remap?: string;
    variable?: string;
    addCallback?: Function;
    removeCallback?: Function;
}

export interface Synchable {
    properties?: Property[];
}
