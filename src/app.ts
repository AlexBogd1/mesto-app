import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import router from './routes';

dotenv.config();

const { PORT = 3000, MONGO_DB_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

mongoose.connect(MONGO_DB_URL);


const app = express();

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: '67a9377c8fed238bc5a8537f'
  };

  next();
});

app.use(router);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})