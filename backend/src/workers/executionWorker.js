import {Worker} from 'bullmq';
import path from 'path';
import { connection } from '../config/redis.js';
import { createSourceFile , cleanup } from '../services/fileService.js';
import { executePython } from '../services/executionService.js';
import { executeCpp , executeJava} from '../services/executionService.js';

//so basically the worker here uses the redis connection to talk to redis and send commands which will be used to manipulate the execution queue and extract and perform jobs

const handlers = {
    "cpp":executeCpp,
    "python":executePython,
    "java":executeJava,
}
const worker = new Worker(
    "execution",
    async (job)=>{
        let filePath;
        const {language,code,input} = job.data;
        try{
            const result = await createSourceFile(language,code);
            filePath = result.filePath;

            const handler = handlers[language];

            if(!handler){
                throw new Error("unsupported language");
            }

            
            
            const output = await handler(filePath,input);
            
            console.log(output);
            return output;
            //here when worker returns the result it is not talking to express its actually returning it to bullmq which marks the job as completed and the publishes a completed event
        }catch(err){
            throw err;
        }finally{
            if(filePath){
                await cleanup(path.dirname(filePath));
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
     console.log(`job ${job.id} failed`);
});