import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import router from './routes';

dotenv.config();

const { PORT = 3000, MONGO_DB_URL = 'mongodb://localhost:27017/mestoApp' } = process.env;

mongoose.connect(MONGO_DB_URL);


const app = express();

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: '67a7fb79541cc72067786847' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use(router);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`)
})