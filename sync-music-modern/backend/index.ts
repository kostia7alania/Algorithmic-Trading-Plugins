import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => c.text('Sync Music API - WebSocket Server Running!'));

let state = {
  isPlaying: false,
  currentTime: 0,
  lastUpdateTimestamp: Date.now()
};

const server = Bun.serve({
  port: process.env.PORT || 3000,
  fetch(req, server) {
    if (server.upgrade(req)) {
      return; // Upgraded to WebSocket
    }
    return app.fetch(req);
  },
  websocket: {
    message(ws, message) {
      const data = JSON.parse(message as string);

      switch (data.type) {
        case 'sync-time':
          ws.send(JSON.stringify({
            type: 'sync-time-response',
            clientTime: data.clientTime,
            serverTime: Date.now()
          }));
          break;

        case 'play':
          state.isPlaying = true;
          state.currentTime = data.currentTime;
          state.lastUpdateTimestamp = Date.now();
          server.publish('music-room', JSON.stringify({ type: 'state-update', state }));
          break;

        case 'pause':
          state.isPlaying = false;
          state.currentTime = data.currentTime;
          state.lastUpdateTimestamp = Date.now();
          server.publish('music-room', JSON.stringify({ type: 'state-update', state }));
          break;

        case 'seek':
          state.currentTime = data.currentTime;
          state.lastUpdateTimestamp = Date.now();
          server.publish('music-room', JSON.stringify({ type: 'state-update', state }));
          break;

        case 'get-state':
          ws.send(JSON.stringify({ type: 'state-update', state }));
          break;
      }
    },
    open(ws) {
      ws.subscribe('music-room');
      ws.send(JSON.stringify({ type: 'state-update', state }));
      console.log('Client connected');
    },
    close(ws) {
      ws.unsubscribe('music-room');
      console.log('Client disconnected');
    },
  },
});

console.log(`WebSocket server is running on ws://localhost:${server.port}`);
