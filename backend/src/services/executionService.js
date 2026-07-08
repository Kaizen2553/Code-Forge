import {spawn} from 'child_process';
export const executePython = async (filePath)=>{
    //here a promise is declared because the function spawn does not return a promise it returns an object now promise is needed because the execution itself is asynchronous to deal wht that we declare a promise which will be resolved if the execution is smooth or will fail and be rejected
    return new Promise((resolve,reject)=>{
        const child = spawn("py",[filePath]);

        let stdout = "";
        let stderr = "";

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
            })
        })
    })
}