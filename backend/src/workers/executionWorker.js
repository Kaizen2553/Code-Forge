import {Worker} from 'bullmq';
import path from 'path';
import { connection } from '../config/redis.js';
import { createSourceFile , cleanup } from '../services/fileService.js';
import { executePython } from '../services/executionService.js';
//so basically the worker here uses the redis connection to talk to redis and send commands which will be used to manipulate the execution queue and extract and perform jobs
const worker = new Worker(
    "execution",
    async (job)=>{
        let filePath;
        const {language,code} = job.data;
        try{
            const result = await createSourceFile(language,code);
            filePath = result.filePath;

            const output = await executePython(filePath);
            
            console.log(output);
            return output;
        }catch(err){
            throw err;
        }finally{
            if(filePath){
                await cleanup(filePath);
            }
        }
    },
    {connection}
)

//now the nodejs has event emitters which bullmq uses to emit events 
//bull mq emits events when the job is completed and sends the job description along with it as well

worker.on('completed',(job)=>{
    console.log(`job ${job.id} completed`);
});

worker.on('failed',(job,err)=>{
    throw err;
});