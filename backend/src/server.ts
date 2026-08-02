import http from 'http';
import app from './app';
import { config } from './config';
import { initSocket } from './socket';

const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

server.listen(config.port, '0.0.0.0', () => {
  console.log(`Server is running on port ${config.port} (0.0.0.0)`);
});
