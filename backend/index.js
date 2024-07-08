import mongoose from 'mongoose';
import app from './app';
import logger from './config/logger';
import { createServer } from 'http';
import SocketServer from './utils/socket.js';

const options = { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true };
mongoose.connect(process.env.MONGODB_URL, options).then(() => {
  logger.info('Connected to MongoDB');
});

let server = app;
server.listen(process.env.PORT, () => {
  logger.info(`Listening to port ${process.env.PORT}`);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
