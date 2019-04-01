import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import './utils/dotenv';
import defaultErrorHandler from './middlewares/defaultErrorHandler';
import authenticate from './middlewares/authenticate';

import index from './routes/index';
import authRouter from './routes/authRouter';
import userRouter from './routes/userRouter';
import sudokuRouter from './routes/sudokuRouter';

const app = express();
const logger = require('./utils/logger')('server');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
});

mongoose.connection.on('error', error => {
  logger.log('error', 'MongoDB connection error. Make sure MongoDB is running.');
  process.exit();
})
mongoose.connection.once('open', () => {
  logger.log('info', 'MongoDB has been connected.');
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(`/api/v${process.env.API_VERSION}/auth`, authRouter);
app.use(`/api/v${process.env.API_VERSION}/users`, authenticate, userRouter);
app.use(`/api/v${process.env.API_VERSION}/sudoku`, authenticate, sudokuRouter);
app.use(`/api/v${process.env.API_VERSION}`, index);

app.use(defaultErrorHandler);
const host = process.env.HOST;
const port = process.env.PORT;
app.listen(port, host, () => {
  logger.log('info', `App is running at http://${host}:${port} in ${app.get('env')} mode.`);
});