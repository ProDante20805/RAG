import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import httpStatus from 'http-status';
import passport from './auth/passport';
import { errorConverter, errorHandler } from './middlewares/error';
import ApiError from './utils/ApiError';
import routes from './routes';
import path from 'path';
import SocketServer from './utils/socket.js';
import { createServer } from 'http';

const app = express();

// Socket init

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(passport.initialize());

// enable cors
app.use(cors());
app.options('*', cors());

app.use(express.static('public'));

// app.get('*', function (req, res) {
//   res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
// });

const httpSever = createServer(app);
const socketServr = new SocketServer(httpSever);
const socketInstance = socketServr.instance;
app.set('socket', socketInstance);

app.use('/api', routes);

app.use('/', (req, res) => {
  res.send('Server is working');
});

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default httpSever;
