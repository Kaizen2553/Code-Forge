import express from 'express';
import executionRoutes from './routes/executionRoutes.js'

const app = express();

app.use(express.json());

app.use('/api/v1',executionRoutes);


app.listen(3000,()=>{
   console.log("server is live");
});