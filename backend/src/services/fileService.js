import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

//in this module what i do is i create a file and the path to that file to be used by the execution service later to delete the file

export const createSourceFile = async(language,code)=>{
    try{
        const id = crypto.randomUUID();
        const directory = path.join(process.cwd(),'temp',id);
        //here process is the global node js process that represents the working project 
        await fs.mkdir(directory,{
            recursive:true,
        });
        
        const file = path.join(directory,`main.${language}`);
        
        await fs.writeFile(
            file,
            code
        )
    
        return {
            filePath:file,
        }
    }catch(error){
        console.log('error in creatFile');
        throw error;
    }
}

export const cleanup = async(directoryPath) => {
  try{
      const directory = path.dirname(directoryPath);
      await fs.rm(directory,{
        recursive:true,
        force:true,
      });

  }catch(error){
    console.log("error in cleanup");
    throw error;
  }
}
