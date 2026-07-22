import path from 'path';
import {spawn} from 'child_process';

export const compileJava = (filePath) => {
    return new Promise((resolve,reject)=>{
         const parent = path.dirname(filePath);
         const child = spawn("docker",["run","--rm","-v",`${parent}:/app`,"java-runner","bash","-c","javac main.java"]);
         let stdout = "";
         let stderr = "";

         child.stderr.on('data',(data)=>{
            stderr+=data.toString();
         })

         child.on('error',(error)=>{
            reject(error);
         })

         child.on('close',(code)=>{
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
            reject(error);
         })

         child.on('close',(code)=>{
            resolve({
                stdout,
                stderr,
                exitCode:code,
            });
         });
    })
}