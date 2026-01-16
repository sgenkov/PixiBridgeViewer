import { titleStyle, statusStyle, valueStyle } from "./config.js";

const app = new PIXI.Application();
(window as any)['__PIXI_APP__'] = app;

async function initPixi(): Promise<void> {
  await app.init({
    background: '#0b0f1a',
    resizeTo: window,
    antialias: true
  });

  const root = document.getElementById('app');
  if (!root) {
    return;
  }
  root.appendChild(app.canvas);
  // window.addEventListener('keydown', ({key}) => {
  //   if (key === 'm') {
  //     console.log('MAP: ', payloadMap)
  //   }
  // });
  window.addEventListener('keydown', ({ key }) => {
    if (key === '/') {
      payloadMap.clear();
      renderPayload();
    }
});
}


const titleText = new PIXI.Text({ text: 'Pixi Bridge Viewer', style: titleStyle });
titleText.label = 'titleText';
titleText.position.set(20, 16);

const statusText = new PIXI.Text({ text: 'Status: connecting...', style: statusStyle });
statusText.position.set(20, 44);

const contentContainer = new PIXI.Container();
contentContainer.position.set(20, 80);

const lines: InstanceType<typeof PIXI.Text>[] = [];
const payloadMap = new Map<string, unknown>();

function setStatus(text: string, ok: boolean): void {
  statusText.text = `Status: ${text}`;
  statusText.style = new PIXI.TextStyle({
    ...statusText.style,
    fill: ok ? '#7cf4c7' : '#ff9090',
  });
}

function stringifyValue(value: unknown): string {
  if (value === null || value === undefined) {
    return String(value);
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}

function mergePayload(payload: Record<string, unknown> | null): void {
  if (!payload) {
    return;
  }
  if (Object.prototype.hasOwnProperty.call(payload, 'refresh')) {
    payloadMap.clear();
  }
  for (const [key, value] of Object.entries(payload)) {
    if (key === 'refresh') {
      continue;
    }
    if (value === null) {
      payloadMap.delete(key);
      continue;
    }

    payloadMap.set(key, value);
  }
}

function renderPayload(): void {
  const entries = Array.from(payloadMap.entries());
  const list: string[] = entries.length
    ? entries.map(([key, value]) => `${key}: ${stringifyValue(value)}`)
    : ['No payload received yet'];

  while (lines.length < list.length) {
    const text = new PIXI.Text({ text: '', style: valueStyle });
    contentContainer.addChild(text);
    lines.push(text);
  }

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (i < list.length) {
      line.text = list[i];
      line.visible = true;
      const prevLine = lines[i - 1];
      const heightOffset: number = prevLine?.height || 0;
      line.position.set(0, heightOffset + 5 + prevLine?.y || 0);
    } else {
      line.visible = false;
    }
  }
}

function connect(): void {
  const wsUrl = `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws`;
  const socket = new WebSocket(wsUrl);

  socket.addEventListener('open', () => setStatus('connected', true));
  socket.addEventListener('close', () => setStatus('disconnected', false));
  socket.addEventListener('error', () => setStatus('error', false));
  socket.onmessage = (event) => {
    console.log('event', event.data);
    // debugger
  }
  socket.onclose = () => {
    console.log('close');
  }

  socket.onerror = (event) => {
    console.log('error', event);
  }
  socket.onopen = () => {
    console.log('open');
  }

  socket.addEventListener('message', (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data && data.payload) {
        mergePayload(data.payload as Record<string, unknown>);
        renderPayload();
      }
    } catch {
      // ignore invalid messages
    }
  });
}

async function start(): Promise<void> {
  await initPixi();
  app.stage.addChild(titleText);
  app.stage.addChild(statusText);
  app.stage.addChild(contentContainer);
  renderPayload();
  connect();
}

start();