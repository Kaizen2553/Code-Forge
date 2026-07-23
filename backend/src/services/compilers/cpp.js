import path from 'path';
import {spawn} from 'child_process'
export const compileCpp = async (filePath) => {
     return new Promise((resolve,reject)=>{
        const parent = path.dirname(filePath);
        const child = spawn("docker",["run","--rm","-v",`${parent}:/app`,"cpp-runner","bash","-c","g++ main.cpp -o main"])
        const timer = setTimeout(()=>{
          child.kill('SIGKILL');
          reject(new Error('ExecutionTimeOut'));
        },3000)
        let stderr = "";
        child.stderr.on('data',(data)=>{
            stderr+=data.toString();
        })

        child.on('error',(error)=>{
            clearTimeout(timer);
            reject(error);
        })

        child.on("close",(code)=>{
            clearTimeout(timer);
            resolve({
                stderr,
                exitCode:code,
            });
        })
     })
}

export const runCpp = async (filePath,input)=>{
   return new Promise((resolve,reject)=>{
      const parent = path.dirname(filePath);
      const child = spawn("docker",["run","--rm","-i","-v",`${parent}:/app`,"cpp-runner","bash","-c","./main"]);
      const timer = setTimeout(()=>{
        child.kill('SIGKILL');
        reject(new Error("ExecutionTimeOut"));
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
      });

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