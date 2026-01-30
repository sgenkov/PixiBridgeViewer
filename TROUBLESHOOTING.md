# 🔧 Troubleshooting Guide

## Често срещани проблеми и решения

### 1. React Renderer - "Failed to resolve module specifier 'react/jsx-runtime'"

**Проблем:**
```
Uncaught (in promise) TypeError: Failed to resolve module specifier "react/jsx-runtime". 
Relative references must start with either "/", "./", or "../".
```

**Причина:**
Това се случва когато TypeScript използва новата автоматична JSX трансформация (`jsx: "react-jsx"`), която изисква module bundler (webpack/vite), но проектът използва UMD builds на React, заредени чрез `<script>` тагове.

**Решение:**
Вече е поправено в проекта! Използва се класическата JSX трансформация (`jsx: "react"`), която компилира JSX до `React.createElement()` и използва глобалните `React` и `ReactDOM` обекти от UMD scripts.

**Конфигурация:**
```typescript
// client/tsconfig.json
{
  "compilerOptions": {
    "jsx": "react",  // Класическа трансформация вместо "react-jsx"
    "moduleResolution": "Node"
  }
}
```

---

### 2. Port 8787 is already in use

**Проблем:**
```
Error: listen EADDRINUSE: address already in use :::8787
```

**Решение:**

**Опция 1:** Спрете процеса, който използва порта:
```bash
# Windows
netstat -ano | findstr :8787
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8787 | xargs kill -9
```

**Опция 2:** Променете порта в `server/index.js`:
```javascript
const PORT = process.env.PORT || 8888; // Променете това
```

---

### 3. TypeScript грешки при build

**Проблем:**
```
error TS2307: Cannot find module 'X' or its corresponding type declarations.
```

**Решение:**

**Стъпка 1:** Изчистете build папката:
```bash
rm -rf client/build
```

**Стъпка 2:** Реинсталирайте зависимостите:
```bash
rm -rf node_modules package-lock.json
npm install
```

**Стъпка 3:** Rebuild:
```bash
npm run build
```

---

### 4. WebSocket "Status: disconnected"

**Проблем:**
Браузърът показва "Status: disconnected" с червен цвят.

**Причини и решения:**

**Причина 1:** Сървърът не работи
```bash
# Решение: Стартирайте сървъра
npm run start
# или
npm run dev
```

**Причина 2:** Грешен WebSocket URL
```javascript
// Проверете конзолата за WebSocket errors
// URL трябва да е ws://localhost:8787/ws
```

**Причина 3:** Firewall блокира връзката
```bash
# Решение: Проверете firewall настройките
# Windows Firewall трябва да позволява Node.js
```

---

### 5. "Cannot find module 'pixi.js'" или 'react'

**Проблем:**
```
Error: Cannot find module 'pixi.js'
Error: Cannot find module 'react'
```

**Решение:**
```bash
# Инсталирайте всички зависимости
npm install

# Ако проблемът продължава, изчистете cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

### 6. Браузърът не се отваря автоматично

**Проблем:**
При `npm run dev`, браузърът не се отваря автоматично.

**Причини:**

**Windows:** Chrome path не е правилен в package.json

**Решение:**
```bash
# Отворете ръчно:
start chrome http://localhost:8787

# Или променете package.json да използва системния default browser:
"dev": "concurrently ... \"start http://localhost:8787\""
```

**Linux/Mac:**
```bash
# Променете package.json:
"dev": "concurrently ... \"open http://localhost:8787\""  # Mac
"dev": "concurrently ... \"xdg-open http://localhost:8787\""  # Linux
```

---

### 7. PixiJS Canvas не се показва

**Проблем:**
Екранът е празен при използване на PixiJS рендерер.

**Debugging:**

**Стъпка 1:** Отворете Browser Console (F12)

**Стъпка 2:** Проверете за грешки:
```javascript
// Трябва да видите:
🎮 Loading PixiJS Renderer...

// Проверете дали PixiJS е зареден:
window.__PIXI_APP__
// Трябва да върне PIXI Application обект
```

**Стъпка 3:** Проверете дали `pixi.js` се зарежда:
- Отворете Network tab
- Refresh страницата (F5)
- Търсете `pixi.js` - трябва да е 200 OK

**Решение ако липсва:**
```bash
# Проверете дали pixi.js е в node_modules
ls node_modules/pixi.js/dist/pixi.js

# Ако липсва:
npm install pixi.js@latest
```

---

### 8. React рендерер показва празен екран

**Проблем:**
Екранът е празен при използване на React рендерер.

**Debugging:**

**Стъпка 1:** Отворете Browser Console (F12)

**Стъпка 2:** Проверете за грешки:
```javascript
// Трябва да видите:
⚛️ Loading React Renderer...

// Проверете дали React е зареден:
React
ReactDOM
// Трябва да върнат обекти
```

**Стъпка 3:** Проверете Elements tab:
```html
<!-- Трябва да видите: -->
<div id="app">
  <div style="...">
    <h1>React Bridge Viewer</h1>
    ...
  </div>
</div>
```

**Решение:**
```bash
# Rebuild проекта:
npm run build

# Ако проблемът продължава, проверете дали сте на React renderer:
# renderer.config.ts трябва да е:
export const RENDERER_TYPE: RendererType = 'react';
```

---

### 9. Custom styles не се прилагат

**Проблем:**
Изпращате custom styles, но те не се показват.

**PixiJS:**
```javascript
// Custom styles трябва да са PixiJS TextStyle обект:
{
  payload: [{
    name: 'custom',
    value: 'Text',
    textStyle: JSON.stringify({
      fill: 0xff0000,  // Hex number, не string!
      fontSize: 48,
      fontFamily: 'Arial'
    })
  }]
}
```

**React:**
```javascript
// Custom styles се конвертират автоматично от PixiJS формат
// но работят и с CSS:
{
  payload: [{
    name: 'custom',
    value: 'Text',
    textStyle: {
      fill: 0xff0000,  // Ще стане #ff0000 в CSS
      fontSize: 48      // Ще стане 48px
    }
  }]
}
```

---

### 10. Keyboard shortcut 'M' не работи

**Проблем:**
Натискате 'M', но payload map не се изписва в конзолата.

**Решение:**

**Стъпка 1:** Уверете се, че фокусът е в browser window (не в DevTools)

**Стъпка 2:** Натиснете lowercase 'm', не uppercase 'M'

**Стъпка 3:** Отворете Console tab (F12) преди да натиснете 'M'

---

### 11. sender-example.js не изпраща данни

**Проблем:**
```bash
npm run send
# Няма резултат в браузъра
```

**Debugging:**

**Стъпка 1:** Проверете дали сървърът работи:
```bash
# Трябва да виждате:
WebSocket server running on port 8787
HTTP server listening on http://localhost:8787
```

**Стъпка 2:** Проверете конзолата на sender-example.js:
```bash
node server/sender-example.js
# Трябва да видите:
Connected to ws://localhost:8787/ws
Sent test data
```

**Стъпка 3:** Проверете Browser Console:
```javascript
// Трябва да видите incoming WebSocket message
```

**Решение:**
```bash
# Спрете и рестартирайте сървъра
# Ctrl+C
npm run dev
```

---

### 12. "payload is not iterable" грешка

**Проблем:**
```
TypeError: payload is not iterable
```

**Причина:**
Изпращате payload като обект вместо като масив.

**Неправилно:**
```json
{
  "payload": {
    "mode": "FREE_SPINS",
    "multiplier": 5
  }
}
```

**Правилно:**
```json
{
  "payload": [
    { "name": "mode", "value": "FREE_SPINS" },
    { "name": "multiplier", "value": 5 }
  ]
}
```

**Решение:**
Кодът вече автоматично конвертира обект формат в масив формат за backwards compatibility, но масив форматът е препоръчителен за пълна функционалност (refresh, custom styles и др.).

---

### 13. Hot reload не работи

**Проблем:**
Променяте файл, но браузърът не се обновява автоматично.

**Решение:**

**Стъпка 1:** Уверете се, че `npm run dev` работи (не само `npm run start`)

**Стъпка 2:** Проверете дали TypeScript watch компилира:
```bash
# В терминала трябва да видите:
[CLIENT] File change detected. Starting incremental compilation...
[CLIENT] Found 0 errors. Watching for file changes.
```

**Стъпка 3:** Проверете Network tab за EventSource:
```
/__reload
Status: 200
Type: text/event-stream
```

**Стъпка 4:** Ако не работи, refresh ръчно (F5)

---

## Performance Issues

### Бавно рендериране

**PixiJS:**
```bash
# Проверете FPS в конзолата:
window.__PIXI_APP__.ticker.FPS
# Трябва да е близо до 60
```

**React:**
```bash
# Инсталирайте React DevTools extension
# Profiler tab показва render times
```

**Решения:**
- Намалете броя на елементите
- Използвайте PixiJS за повече от 50-100 елемента
- Оптимизирайте update frequency

---

## Допълнителна Помощ

### Debug Mode

Активирайте debug logging:

```javascript
// В browser console:
localStorage.setItem('debug', 'true');
location.reload();
```

### Проверка на версии

```bash
node --version   # Трябва да е >= 14
npm --version    # Трябва да е >= 6
```

### Пълен Reset

Ако нищо не работи:

```bash
# 1. Изчистване
rm -rf node_modules package-lock.json client/build

# 2. Реинсталация
npm install

# 3. Rebuild
npm run build

# 4. Стартиране
npm run dev

# 5. Тестване
npm run send
```

---

## Съобщаване на Проблеми

Ако проблемът продължава:

1. Проверете всички стъпки в този guide
2. Прочетете [GETTING_STARTED.md](./GETTING_STARTED.md)
3. Проверете [TEST_RENDERERS.md](./TEST_RENDERERS.md)
4. Погледнете [ARCHITECTURE.md](./ARCHITECTURE.md) за разбиране на системата

При съобщаване на проблем, включете:
- Node.js версия (`node --version`)
- npm версия (`npm --version`)
- OS (Windows/Mac/Linux)
- Пълно съобщение за грешката
- Стъпките за възпроизвеждане
- Използван рендерер (PixiJS или React)

---

**Last Updated:** January 2026
