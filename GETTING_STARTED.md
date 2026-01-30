# 🚀 Getting Started с Dual Renderer System

## Стъпка 1: Инсталация

```bash
cd /c/Projects/PixiBridgeViewer
npm install
```

Това ще инсталира всички необходими зависимости:
- PixiJS библиотеки
- React библиотеки
- TypeScript
- WebSocket server

## Стъпка 2: Изберете Рендерер

### Опция A: Използване на PixiJS (по подразбиране)

```bash
npm run switch:pixi
```

**Предимства:**
- 🎮 High-performance WebGL рендериране
- ⚡ Отлично за анимации и игри
- 🎯 60 FPS постоянно

### Опция B: Използване на React

```bash
npm run switch:react
```

**Предимства:**
- 🔧 Лесно за модифициране
- 📦 React екосистема
- 💡 По-добра четимост на кода

## Стъпка 3: Стартиране

```bash
npm run dev
```

Това ще стартира:
- ✅ TypeScript compiler в watch mode
- ✅ WebSocket server на порт 8787
- ✅ Chrome browser автоматично на http://localhost:8787

**Очакван изход:**
```
[CLIENT] Starting compilation in watch mode...
[SERVER] WebSocket server running on port 8787
[SERVER] HTTP server listening on http://localhost:8787
[BROWSER] Opening Chrome at http://localhost:8787
```

## Стъпка 4: Тестване

Отворете нов терминал и изпратете тестови данни:

```bash
npm run send
```

**Очакван резултат в браузъра:**
```
Pixi Bridge Viewer  (или React Bridge Viewer)

Status: connected

mode: MEGA_FREE_SPINS
multiplier: 14
reel: 2
symbol: scatter
```

## Стъпка 5: Експериментиране

### Превключване между рендерери:

```bash
# Спри dev сървъра (Ctrl+C)
npm run switch:react
npm run dev

# Спри отново и превключи обратно
npm run switch:pixi
npm run dev
```

### Промяна на данните:

Редактирай `server/sender-example.js`:

```javascript
const payload = [
  { name: 'custom', value: 'My Value' },
  { name: 'number', value: 42 },
  { name: 'json', value: { foo: 'bar' } }
];
```

После изпрати:
```bash
npm run send
```

## Често Използвани Команди

```bash
# Development
npm run dev              # Стартира всичко
npm run watch            # Само TypeScript compilation
npm run start            # Само сървър

# Build
npm run build            # Компилира TypeScript

# Testing
npm run send             # Изпраща тестови данни

# Renderer Switch
npm run switch:pixi      # Превключва към PixiJS
npm run switch:react     # Превключва към React
```

## Клавишни Комбинации

| Клавиш | Действие |
|--------|----------|
| `M` | Отпечатва payload map в конзолата (за debug) |

## Troubleshooting

### Проблем: "Port 8787 is already in use"

**Решение:** Променете порта в `server/index.js`:
```javascript
const PORT = 8888; // Променете това
```

### Проблем: "Cannot find module 'react'"

**Решение:** Реинсталирайте зависимостите:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Проблем: TypeScript грешки

**Решение:** Изчистете build папката:
```bash
rm -rf client/build
npm run build
```

### Проблем: Браузърът не се отваря автоматично

**Решение:** Отворете ръчно:
- http://localhost:8787

### Проблем: "Status: disconnected" в браузъра

**Решение:** Проверете дали сървърът работи:
```bash
# В отделен терминал
npm run start
```

## Следващи Стъпки

1. ✅ **Прочетете документацията:**
   - [RENDERER_GUIDE.md](./RENDERER_GUIDE.md) - За повече за рендерерите
   - [COMPARISON.md](./COMPARISON.md) - За сравнение
   - [ARCHITECTURE.md](./ARCHITECTURE.md) - За архитектурата

2. ✅ **Експериментирайте:**
   - Променете стиловете в `client/config.ts` (PixiJS)
   - Променете стиловете в `client/app-react.tsx` (React)
   - Създайте custom payload data

3. ✅ **Интегрирайте:**
   - Свържете вашия slot game към WebSocket
   - Изпращайте real-time данни
   - Визуализирайте game state

## Интеграция с Ваш Проект

### От slot game:

```typescript
// В вашия game код
const socket = new WebSocket('ws://localhost:8787/ws');

socket.addEventListener('open', () => {
  // Изпращай обновления
  socket.send(JSON.stringify({
    payload: [
      { name: 'mode', value: gameState.mode },
      { name: 'balance', value: player.balance },
      { name: 'bet', value: currentBet }
    ]
  }));
});

// При всяка промяна на state:
function updateViewer() {
  socket.send(JSON.stringify({
    payload: [
      { name: 'lastWin', value: lastWinAmount },
      { name: 'freeSpins', value: freeSpinsRemaining }
    ]
  }));
}
```

### Специални команди:

```javascript
// Изчистване на всички данни
socket.send(JSON.stringify({
  payload: [{ refresh: true }]
}));

// Custom style (само PixiJS)
socket.send(JSON.stringify({
  payload: [{
    name: 'bigWin',
    value: 'MEGA WIN!',
    textStyle: JSON.stringify({
      fill: 0xFFD700, // Gold
      fontSize: 72,
      fontWeight: 'bold'
    })
  }]
}));
```

## Production Deployment

### Build за production:

```bash
# Избери рендерер
npm run switch:pixi  # или switch:react

# Build
npm run build

# Deploy само необходимите файлове:
# - server/index.js
# - client/index.html
# - client/styles.css
# - client/build/
# - client/node_modules/pixi.js/dist/
# - client/node_modules/react*/umd/
```

### Environment variables:

```bash
# .env файл (създайте го)
PORT=8787
NODE_ENV=production
```

```javascript
// server/index.js
const PORT = process.env.PORT || 8787;
```

## Support & Resources

- 📖 **Документация:** Виж [README.md](./README.md)
- 🔍 **Архитектура:** Виж [ARCHITECTURE.md](./ARCHITECTURE.md)
- 🧪 **Тестване:** Виж [TEST_RENDERERS.md](./TEST_RENDERERS.md)
- ⚡ **Бърза справка:** Виж [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)

## Полезни Линкове

- **PixiJS Docs:** https://pixijs.com/
- **React Docs:** https://react.dev/
- **WebSocket API:** https://developer.mozilla.org/en-US/docs/Web/API/WebSocket

---

## 🎉 Готово!

Вече сте готови да използвате dual renderer system!

**Бърз старт recap:**
```bash
npm install           # Инсталира dependencies
npm run switch:pixi   # Или switch:react
npm run dev           # Стартира всичко
npm run send          # Тества данни
```

**Наслаждавайте се на вашия Bridge Viewer! 🚀**
