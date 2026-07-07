import IORedis from 'ioredis';
//the library IOredis eshtablishes a tcp connection with the redis server which is then used by bullmq for queue operations

export const connection = new IORedis({
    host:"localhost",
    port:6379,
    maxRetriesPerRequest:null,
});

//now each parameter here holds meaning 
//1 localhost = the server redis is running on which is the same device
//2 port = the tcp port which redis listens to by default
//3 how many retries are allowed for connection request setting it to null means unlimited connection retries are allowed the retry limitation is client site not server side