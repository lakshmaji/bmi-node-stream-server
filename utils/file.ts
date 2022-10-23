import bfj from 'bfj';
import fs from 'fs';
import stream from 'stream';
import { Person } from '../features/persons/models/person.model';
import { noop } from '../types';

export function openJSONInput(filePath: string) {
  const jsonInputStream = new stream.Readable({ objectMode: true });
  jsonInputStream._read = noop;

  const fileInputStream = fs.createReadStream(filePath);

  let currentObject: Record<string, string | boolean | number> | undefined;
  let currentProperty: string | undefined;

  const emitter = bfj.walk(fileInputStream);

  emitter.on(bfj.events.object, () => {
    currentObject = {};
  });

  emitter.on(bfj.events.property, (name: string) => {
    currentProperty = name;
  });

  const onValue = <T extends string | boolean | number>(value: T) => {
    if (currentProperty && currentObject) {
      currentObject[currentProperty] = value;
      currentProperty = undefined;
    }
  };

  emitter.on(bfj.events.string, onValue);
  emitter.on(bfj.events.number, onValue);
  emitter.on(bfj.events.literal, onValue);

  emitter.on(bfj.events.endObject, () => {
    jsonInputStream.push(currentObject);
    currentObject = undefined;
  });

  emitter.on(bfj.events.endArray, () => {
    jsonInputStream.push(null);
  });

  emitter.on(bfj.events.error, (err: Error) => {
    jsonInputStream.emit('error', err);
  });

  return jsonInputStream;
}

export function writeJSONOutput(filePath: string) {
  const fileOutputStream = fs.createWriteStream(filePath);
  fileOutputStream.write('[');

  let numRecords = 0;

  const jsonOutputStream = new stream.Writable({ objectMode: true });
  jsonOutputStream._write = (chunk: Person, encoding: BufferEncoding, cb: (error?: Error | null) => void) => {
    if (numRecords > 0) {
      fileOutputStream.write(',');
    }

    const jsonData = JSON.stringify(chunk);
    fileOutputStream.write(jsonData);
    numRecords += chunk.length;
    cb();
  };

  jsonOutputStream.on('finish', () => {
    fileOutputStream.write(']');
    fileOutputStream.end();
  });

  return jsonOutputStream;
}
