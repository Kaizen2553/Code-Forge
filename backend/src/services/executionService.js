import {spawn} from 'child_process';
import path from 'path';
import { compileCpp, runCpp } from "./compilers/cpp.js";
import {compileJava,runJava} from './compilers/java.js'
export const executePython = async (filePath,input)=>{
    //here a promise is declared because the function spawn does not return a promise it returns an object now promise is needed because the execution itself is asynchronous to deal wht that we declare a promise which will be resolved if the execution is smooth or will fail and be rejected
    return new Promise((resolve,reject)=>{
        const parent = path.dirname(filePath);
        //console.log("INPUT:", JSON.stringify(input));
        const child = spawn("docker",["run","-i","--rm","--memory=128m","--cpus=1","--network=none","--pids-limit=50",'--cap-drop=ALL',"-v",`${parent}:/app`,"python-runner","python3",path.basename(filePath)]);
        //-i means interactive and it tells docker to keep the stdin open and forward the input to the process

        //-V HERE MEANS MOUNT WHICH IS TO SHARE A SPECIFIC CONTAINER WITH THE CONTAINER IE IT CAN ACCESS THE CONTENTS OF THAT FILE
        const timer = setTimeout(()=>{
            child.kill('SIGKILL');
            reject(new Error("ExecutionTimeOut"));
        },3000);


        let stdout = "";
        let stderr = "";

        // console.log("Input received:", JSON.stringify(input));
       if(input){
           child.stdin.write(input);
       }
        child.stdin.end();

        child.stdout.on('data',(data)=>{
            stdout+=data.toString();
        })

        child.stderr.on('data',(data)=>{
            stderr+=data.toString();
        })

        child.on('error',(error)=>{
            clearTimeout(timer);
            reject(error);
        })
        //the close event is emitted when the execution of that code is finised
        child.on('close',(code)=>{
            clearTimeout(timer);
            resolve({
                stdout,
                stderr,
                exitCode:code,
            })
        })
    })
}




export const executeCpp = async (filePath, input) => {
    const compileResult = await compileCpp(filePath);

    if (compileResult.exitCode !== 0) {
        return compileResult;
    }

    return await runCpp(filePath, input);
};


export const executeJava = async (filePath, input) => {
    const compileResult = await compileJava(filePath);

    if (compileResult.exitCode !== 0) {
        return compileResult;
    }

    return await runJava(filePath, input);
};