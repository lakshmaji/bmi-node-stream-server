import bfj from 'bfj'
import fs from 'fs'
import stream from 'stream'

export function openJSONInput (filePath: string) {
    const jsonInputStream = new stream.Readable({ objectMode: true })
    jsonInputStream._read = () => {}

    const fileInputStream = fs.createReadStream(filePath);



      
    let currentObject: any
    let currentProperty: string | undefined

    const emitter = bfj.walk(fileInputStream)

    emitter.on(bfj.events.object, () => {
        // new object
        currentObject = {}
    })

    emitter.on(bfj.events.property, (name: string) => {
        currentProperty = name
    })

    let onValue = <T>(value: T) => {
        if(currentProperty) {
            currentObject[currentProperty] = value;
            currentProperty = undefined
        }
    }

    emitter.on(bfj.events.string, onValue)
    emitter.on(bfj.events.number, onValue)
    emitter.on(bfj.events.literal, onValue)

    emitter.on(bfj.events.endObject, () => {
        jsonInputStream.push(currentObject)
        currentObject = undefined
    })

    emitter.on(bfj.events.endArray, () => {
        jsonInputStream.push(null)
    })

    emitter.on(bfj.events.error, (err:any) => {
        jsonInputStream.emit("error", err)
    })

    return jsonInputStream
}

export function writeJSONOutput (filePath: string) {
        const fileOutputStream = fs.createWriteStream(filePath)
        fileOutputStream.write("[")

        let numRecords = 0

        const jsonOutputStream = new stream.Writable({ objectMode : true })
        jsonOutputStream._write = (chunk, encoding, cb) => {
            if(numRecords>0) {
                fileOutputStream.write(",")
            }

            const jsonData = JSON.stringify(chunk)
            fileOutputStream.write(jsonData)
            numRecords += chunk.length
            cb();
        }

        jsonOutputStream.on("finish", () => {
            fileOutputStream.write("]")
            fileOutputStream.end();
        })

        return jsonOutputStream
}
