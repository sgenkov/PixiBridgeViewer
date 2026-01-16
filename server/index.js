const http = require('http');
const fs = require('fs');
const path = require('path');
const { WebSocketServer } = require('ws');

const PORT = 8787;
const ROOT_DIR = path.resolve(__dirname, '..');
const CLIENT_DIR = path.resolve(ROOT_DIR, 'client');
const NODE_MODULES_DIR = path.resolve(ROOT_DIR, 'node_modules');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg'
};

function serveFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

const reloadClients = new Set();
let reloadTimer = null;

function sendReload() {
  for (const client of reloadClients) {
    client.write('data: reload\n\n');
  }
}

function scheduleReload() {
  if (reloadTimer) {
    clearTimeout(reloadTimer);
  }
  reloadTimer = setTimeout(() => {
    reloadTimer = null;
    sendReload();
  }, 100);
}

fs.watch(CLIENT_DIR, { recursive: true }, (eventType, filename) => {
  if (!filename) {
    return;
  }
  if (!/\.(js|css|html)$/.test(filename)) {
    return;
  }
  scheduleReload();
});

const server = http.createServer((req, res) => {
  if (!req.url) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Bad request');
    return;
  }

  const urlPath = req.url.split('?')[0];
  if (urlPath === '/__reload') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    });
    res.write('\n');
    reloadClients.add(res);
    req.on('close', () => {
      reloadClients.delete(res);
    });
    return;
  }
  let filePath;
  if (urlPath === '/') {
    filePath = path.join(CLIENT_DIR, 'index.html');
  } else if (urlPath.startsWith('/node_modules/')) {
    filePath = path.resolve(ROOT_DIR, `.${urlPath}`);
    if (!filePath.startsWith(NODE_MODULES_DIR)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Forbidden');
      return;
    }
  } else {
    filePath = path.join(CLIENT_DIR, urlPath);
    if (!filePath.startsWith(CLIENT_DIR)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Forbidden');
      return;
    }
  }

  serveFile(res, filePath);
});

const wss = new WebSocketServer({ server, path: '/ws' });

function safeJsonParse(message) {
  try {
    return JSON.parse(message);
  } catch (err) {
    return null;
  }
}

function broadcast(data) {
  const payload = typeof data === 'string' ? data : JSON.stringify(data);
  for (const client of wss.clients) {
    if (client.readyState === client.OPEN) {
      client.send(payload);
    }
  }
}

wss.on('connection', (socket) => {
  socket.send(
    JSON.stringify({
      type: 'hello',
      payload: { message: 'Connected to pixi-bridge server.' },
      ts: Date.now()
    })
  );

  socket.on('message', (message) => {
    const parsed = safeJsonParse(message);
    if (!parsed) {
      return;
    }
    broadcast(parsed);
  });
});

server.listen(PORT, () => {
  console.log(`[pixi-bridge] Server running at http://localhost:${PORT}`);
  console.log(`[pixi-bridge] WebSocket endpoint: ws://localhost:${PORT}/ws`);
});
