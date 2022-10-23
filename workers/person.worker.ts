import { Job } from "bullmq";
import { connection, createQueue, createWorker } from "../config/bull.config";
import { handlePersonsBMIRequest } from "../core/person";


export interface SplitterJob extends Record<string, string> {
    videoFile: string;
  }
  
  
const bananaProcessor = async (job: Job<SplitterJob>): Promise<void> => {
    try {
  
      const result = await handlePersonsBMIRequest(job.data.inputFile, job.data.outputFile);
      console.log("result", result)
    } catch(err) {
      console.log(" err", err)
    }
  }
  
export const PERSON_BMI_QUEUE = "banana"

export  const  worker  = createWorker<StreamInputData>(
    PERSON_BMI_QUEUE,
    bananaProcessor,
    connection,
  );

export const queue = createQueue<StreamInputData>(PERSON_BMI_QUEUE)

interface StreamInputData {
  inputFile:string 
  outputFile:string
}


export async function addJob(data: StreamInputData) {
  await queue.add(PERSON_BMI_QUEUE, data, { delay: 500 })
}
