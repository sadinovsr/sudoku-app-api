import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import './utils/dotenv';

import index from './routes/index';

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

app.use(`/api/v${process.env.API_VERSION}`, index);

const host = process.env.HOST;
const port = process.env.PORT;
app.listen(port, host, () => {
    logger.log('info', `App is running at http://${host}:${port} in ${app.get('env')} mode.`);
});