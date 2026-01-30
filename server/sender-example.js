const WebSocket = require('ws');

const WS_URL = 'ws://localhost:8787/ws';
const socket = new WebSocket(WS_URL);

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

socket.on('open', () => {
  console.log('[sender-example] Connected');
  let counter = 0;

  const interval = setInterval(() => {
    counter += 1;
    const message = {
      type: 'paramsUpdate',
      payload: [
        { name: 'mode', value: ['BASE', 'FREE_SPINS', 'SUPER_FREE_SPINS', 'MEGA_FREE_SPINS'][randomInt(0, 3)] },
        { name: 'multiplier', value: randomInt(1, 20) },
        { name: 'reel', value: randomInt(0, 5) },
        { name: 'symbol', value: ['scatter', 'multiplier', 'wild'][randomInt(0, 2)] },
        { name: 'counter', value: counter }
      ],
      ts: Date.now()
    };
    socket.send(JSON.stringify(message));
  }, 1000);

  socket.on('close', () => clearInterval(interval));
});

socket.on('error', (err) => {
  console.error('[sender-example] Error:', err.message);
});
