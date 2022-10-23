declare module 'bfj' {
    export type EventMap = {
        [key: string]: (...args: any[]) => void
    }

    interface TypedEventEmitter<Events extends EventMap> {
        addListener<E extends keyof Events> (event: E, listener: Events[E]): this
        on<E extends keyof Events> (event: E, listener: Events[E]): this
        once<E extends keyof Events> (event: E, listener: Events[E]): this
        prependListener<E extends keyof Events> (event: E, listener: Events[E]): this
        prependOnceListener<E extends keyof Events> (event: E, listener: Events[E]): this
      
        off<E extends keyof Events>(event: E, listener: Events[E]): this
        removeAllListeners<E extends keyof Events> (event?: E): this
        removeListener<E extends keyof Events> (event: E, listener: Events[E]): this
      
        emit<E extends keyof Events> (event: E, ...args: Parameters<Events[E]>): boolean
        // The sloppy `eventNames()` return type is to mitigate type incompatibilities - see #5
        eventNames (): (keyof Events | string | symbol)[]
        rawListeners<E extends keyof Events> (event: E): Events[E][]
        listeners<E extends keyof Events> (event: E): Events[E][]
        listenerCount<E extends keyof Events> (event: E): number
      
        getMaxListeners (): number
        setMaxListeners (maxListeners: number): this
    }
      
    interface MessageEvents<T extends MyAPpEvent> {
        // error: (error: Error) => void,
        // message: (body: string, from: string) => void
        // [Event.object]: () => void
        object: () => void

    }
      
    type MyAPpEvent = 'arr' | 'obj' | 'object'
      
    type WalkEmitter = TypedEventEmitter<MessageEvents>


const array =Symbol.for( 'arr');
const object =Symbol.for( 'obj');
const property= Symbol.for('pro');
const string= Symbol.for('str');
const number= Symbol.for('num');
const literal= Symbol.for('lit');
const endPrefix= Symbol.for('end-');
const end= Symbol.for('end');
const error= Symbol.for('err');

    // export enum events {
    //     array = array, //  = 'arr',
    //     object = object, //  = 'obj',
    //     property = property, // = 'pro',
    //     string = string, // = 'str',
    //     number = number, // = 'num',
    //     literal = literal, // = 'lit',
    //     endPrefix = endPrefix, // = 'end-',
    //     end = end, // = 'end',
    //     error = error, // = 'err'
    // }

    export const events: Record<string | 'object', string | symbol> = {
        array = 'arr',
        object = 'obj',
        property= 'pro',
        string= 'str',
        number= 'num',
        literal= 'lit',
        endPrefix= 'end-',
        end= 'end',
        error= 'err'
    }
    interface Options {yieldRate?: number, ndjson?: boolean }
    // events: Event
    export function walk(stream: Stream, option?: Options): TypedEventEmitter<MessageEvents>
}