import socketIO from 'socket.io-client';

export const socket = socketIO.connect(
  process.env.REACT_APP_BACKEND_ORIGIN_URL
);
