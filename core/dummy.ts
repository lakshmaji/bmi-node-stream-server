import stream from "stream";
import { openJSONInput, writeJSONOutput } from "../utils/file";

export const dummy = async () => {
        const inputFile = "samples/inputs/weather.json";
        const outputFile = "samples/outputs/weather.json";
      
        new Promise((resolve, reject) => {
          openJSONInput(inputFile)
            .pipe(convertTemperatureStream())
            .pipe(writeJSONOutput(outputFile))
            .on("error", (err) => {
              console.log(err);
              resolve("Failed!");
            })
            .on("finish", () => {
              resolve("Completed!");
            });
        });
}


function convertTemperatureStream() {
    const transformStream = new stream.Transform({ objectMode: true }); // Create a bidirectional stream in 'object mode'.
    transformStream._transform = (inputChunk, encoding, callback) => {
      // Callback to execute on chunks that are input.
      var outputChunk = transformRow(inputChunk); // Transform the chunk.
      transformStream.push(outputChunk); // Pass the converted chunk to the output stream.
      callback();
    };
    return transformStream;
  }
  


function transformRow(inputRow: any) {
    // Your code here to transform a row of data.
  
    const outputRow = Object.assign({}, inputRow); // Clone record, prefer not to modify source data.
  
    if (typeof outputRow.MinTemp === "number") {
      outputRow.MinTemp /= 10;
    } else {
      outputRow.MinTemp = undefined;
    }
  
    if (typeof outputRow.MaxTemp === "number") {
      outputRow.MaxTemp /= 10;
    } else {
      outputRow.MaxTemp = undefined;
    }
  
    return outputRow;
  }
  


  // function transformStream() {
//   const transformStream = new stream.Transform();

//   transformStream._transform = (inputChunk, encoding, cb) => {
//     const transformedChunk = inputChunk.toString().toLowerCase();
//     transformStream.push(transformedChunk);
//     cb();
//   };

//   return transformStream;
// }

// app.get("/learn", (req: Request, res: Response) => {
//   const inputStream = fs.createReadStream("samples/inputs/one.json");
//   const outputStream = fs.createWriteStream("samples/outputs/one.json");

//   inputStream.pipe(transformStream()).pipe(outputStream);
//   res.send("ok");
// });
