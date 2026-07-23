import path from 'path';
import {spawn} from 'child_process';

export const compileJava = (filePath) => {
    return new Promise((resolve,reject)=>{
         const parent = path.dirname(filePath);
         const child = spawn("docker",["run","--rm","-v",`${parent}:/app`,"java-runner","bash","-c","javac main.java"]);

         const timer = setTimeout(()=>{
              child.kill('SIGKILL');
              reject(new Error("exectutionTimedOut"));
         },3000);

         let stdout = "";
         let stderr = "";


         child.stderr.on('data',(data)=>{
            stderr+=data.toString();
         })

         child.on('error',(error)=>{
            clearTimeout(timer);
            reject(error);
         })

         child.on('close',(code)=>{
            clearTimeout(timer);
            resolve({
                stderr,
                exitCode:code,
            });
         });
    })
}

export const runJava = (filePath,input) => { 
    return new Promise((resolve,reject)=>{
         const parent = path.dirname(filePath);
         const child = spawn("docker",["run","--rm","-i","-v",`${parent}:/app`,"java-runner","bash","-c","java main"]);

         const timer = setTimeout(()=>{
            child.kill('SIGKILL');
            reject(new Error('ExecutionTimeOut'));
         },3000)
         let stdout = "";
         let stderr = "";

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

         child.on('close',(code)=>{
            clearTimeout(timer);
            resolve({
                stdout,
                stderr,
                exitCode:code,
            });
         });
    })
}