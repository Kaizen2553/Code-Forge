import { executionQueue } from "../queues/executionQueue.js";
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
   
        return res.status(200).json({
           success:true,
           jobId: job.id
        });
    }catch(error){
        console.log('error occured in executeCode controller');
        return res.status(500).json({
            success:false,
            message:"internal server error",
        });
    }
}