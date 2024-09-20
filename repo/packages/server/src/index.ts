import { router } from './lib/server.js';
import { createServer } from 'http';
import { App } from "uWebSockets.js";
import { Server } from "socket.io";

import './routes';

createServer(router).listen(3003, () => {
  console.log('Server listening at http://localhost:3003');
});

const io = new Server({
  cors: {
    origin: 'http://localhost:1234',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("received connection");
  socket.emit("hello", "world");
});

// Make sure to create a different app than the API's app
const wss = App();
io.attachApp(wss);

wss.listen(3004, () => {
  console.info(`WSS is listening on http://localhost:3004`);
});
