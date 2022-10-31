declare module 'bfj' {
  export type EventMap = {
    [key: string]: (...args: any[]) => void;
  };

  interface TypedEventEmitter<Events extends EventMap> {
    addListener<E extends keyof Events>(event: E, listener: Events[E]): this;
    on<E extends keyof Events>(event: E, listener: Events[E]): this;
    once<E extends keyof Events>(event: E, listener: Events[E]): this;
    prependListener<E extends keyof Events>(event: E, listener: Events[E]): this;
    prependOnceListener<E extends keyof Events>(event: E, listener: Events[E]): this;

    off<E extends keyof Events>(event: E, listener: Events[E]): this;
    removeAllListeners<E extends keyof Events>(event?: E): this;
    removeListener<E extends keyof Events>(event: E, listener: Events[E]): this;

    emit<E extends keyof Events>(event: E, ...args: Parameters<Events[E]>): boolean;
    // The sloppy `eventNames()` return type is to mitigate type incompatibilities - see #5
    eventNames(): (keyof Events | string | symbol)[];
    rawListeners<E extends keyof Events>(event: E): Events[E][];
    listeners<E extends keyof Events>(event: E): Events[E][];
    listenerCount<E extends keyof Events>(event: E): number;

    getMaxListeners(): number;
    setMaxListeners(maxListeners: number): this;
  }

  interface MessageEvents {
    property: <T extends string>(value: T) => void;
    array: <T extends string | number | boolean>(value: T) => void;
    object: <T extends string | number | boolean>(value: T) => void;
    property: <T extends string | number | boolean>(value: T) => void;
    string: <T extends string | number | boolean>(value: T) => void;
    number: <T extends string | number | boolean>(value: T) => void;
    literal: <T extends string | number | boolean>(value: T) => void;
    endPrefix: <T extends string | number | boolean>(value: T) => void;
    end: <T extends string | number | boolean>(value: T) => void;
    error: <T extends Error>(value: T) => void;
    endArray: <T extends string | number | boolean>(value: T) => void;
    endObject: <T extends string | number | boolean>(value: T) => void;
    endLine: <T extends string | number | boolean>(value: T) => void;
    dataError: <T extends string | number | boolean>(value: T) => void;
  }

  type WalkEmitter = TypedEventEmitter<MessageEvents>;

  const array = 'arr';
  const object = 'obj';
  const property = 'pro';
  const string = 'str';
  const number = 'num';
  const literal = 'lit';
  const endPrefix = 'end-';
  const end = 'end';
  const error = 'err';

  export const events: Record<keyof MessageEvents, keyof MessageEvents> = {
    array = 'arr',
    object = 'obj',
    property = 'pro',
    string = 'str',
    number = 'num',
    literal = 'lit',
    endPrefix = 'end-',
    end = 'end',
    error = 'err',
    endArray = `${endPrefix}${array}`,
    endObject = `${endPrefix}${object}`,
    endLine = `${endPrefix}${object}`,
    dataError = `${error}-data`,
  };
  interface Options {
    yieldRate?: number;
    ndjson?: boolean;
  }
  export function walk(stream: Stream, option?: Options): WalkEmitter;
}
