import { Text } from "pixi.js";
import { titleStyle, statusStyle, valueStyle } from "./config.js";
import { IDTO } from "./interfaces/Interfaces.js";
import { setStatus, stringifyValue } from "./utils.js";

const lines: InstanceType<typeof PIXI.Text>[] = [];
const payloadMap = new Map<string, any>();
const app = new PIXI.Application();

async function initPixi(): Promise<void> {
  await app.init({
    background: '#0b0f1a',
    resizeTo: window,
    antialias: true,
  });
  (window as any)['__PIXI_APP__'] = app;

  const root = document.getElementById('app');
  if (!root) {
    return;
  }
  root.appendChild(app.canvas);
  window.addEventListener('keydown', ({key}) => {
    if (key === 'm') {
      console.log('MAP: ', payloadMap)
    }
  });
}

const titleText = new PIXI.Text({ text: 'Pixi Bridge Viewer', style: titleStyle });
titleText.label = 'titleText';
titleText.position.set(20, 16);

const statusText: Text = new PIXI.Text({ text: 'Status: connecting...', style: statusStyle });
statusText.label = 'statusText';
statusText.position.set(20, 60);

const contentContainer = new PIXI.Container();
contentContainer.label = 'contentContainer';
contentContainer.position.set(20, 94);

function mergePayload(payload: IDTO[]): void {
  console.log('mergePayload', payload);
  if (!payload) {
    return;
  }
  for (const {name, value, refresh} of payload) {
    if (refresh) {
      continue;
    }
    if (name && value === null) {
      payloadMap.delete(name);
      continue;
    }

    if (name) {
      payloadMap.set(name, value);
    }
  }
}

function renderPayload(): void {
  const entries = Array.from(payloadMap.entries());
  console.log('ENTR', entries);
  const list: string[] = entries.length
    ? entries.map(([key, entry]) => {
      const displayValue = Object.prototype.hasOwnProperty.call(entry, 'value')
        ? entry.value
        : entry;
      return `${key}: ${stringifyValue(displayValue)}`;
    })
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

  socket.addEventListener('open', () => setStatus(statusText, 'connected', true));
  socket.addEventListener('close', () => setStatus(statusText, 'disconnected', false));
  socket.addEventListener('error', () => setStatus(statusText, 'error', false));

  socket.addEventListener('message', ({data}: {data: string}) => {
    try {
      const {payload} = JSON.parse(data);
      console.log('message', data);
      if (payload) {
        mergePayload(payload);
        renderPayload();
      }
    } catch {
      // ignore invalid messages
    }
  });
}
function layout(e?: any): void {
  app.stage.scale.set(app.canvas.width / 800);
}

function initStuff(): void {
  app.renderer.on('resize', (e) => layout(e));
  layout();
}
async function start(): Promise<void> {
  await initPixi();
  app.stage.label = 'Application Stage';
  app.stage.addChild(titleText);
  app.stage.addChild(statusText);
  app.stage.addChild(contentContainer);
  renderPayload();
  connect();
  initStuff();
}

start();