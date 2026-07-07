import {Worker} from 'bullmq';
import { connection } from '../config/redis.js';
//so basically the worker here uses the redis connection to talk to redis and send commands which will be used to manipulate the execution queue and extract and perform jobs
const worker = new Worker(
    "execution",
    async (job)=>{
        console.log(job.data);
        return "success";
    },
    {connection}
)

//now the nodejs has event emitters which bullmq uses to emit events 
//bull mq emits events when the job is completed and sends the job description along with it as well

worker.on('complete',(job)=>{
    console.log(`job ${job.id} completed`);
});

worker.on('failed',(job,err)=>{
    console.log(`job ${job.id} failed`);
});