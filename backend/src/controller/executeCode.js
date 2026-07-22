import { executionQueue,queueEvents } from "../queues/executionQueue.js";
export const executeCode = async (req,res)=>{
    try{
        const {language,code,input} = req.body;
        if(!language || !code){
           return res.status(400).json({
               success:false,
               message:"input field empty",
           });
        }
       //creating a job by adding it to the queue and returning the job id
        const job = await executionQueue.add('execute-code',{
           language,
           code,
           input:input||''
        });

       

        const result = await job.waitUntilFinished(queueEvents);
        //lets say there are n jobs in queue each will run a copy of this route and they all will wait at this line and therefore promises will accumulate as new requests are made.
   
        console.log(result);

        return res.status(200).json({
           success:true,
           result:result,
        });
    }catch(error){
        console.log('error occured in executeCode controller');
        return res.status(500).json({
            success:false,
            message:"internal server error",
        });
    }   
}