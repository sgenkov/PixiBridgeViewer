# ⚡ Бърза Справка

## Команди

```bash
# Development
npm run dev              # Стартира всичко (client + server + browser)
npm run watch            # Само watch на TypeScript
npm run start            # Само сървър

# Build
npm run build            # Компилира TypeScript

# Тестване
npm run send             # Изпраща тестови данни

# Превключване на рендерер
npm run switch:pixi      # Превключва към PixiJS
npm run switch:react     # Превключва към React
```

## Файлова Структура

```
PixiBridgeViewer/
│
├── client/                          # Frontend код
│   ├── app.ts                       # 🚀 Entry point (избира рендерер)
│   ├── renderer.config.ts           # ⚙️ Конфигурация (ПРОМЕНЯЙ ТУКА!)
│   │
│   ├── app-pixi.ts                  # 🎮 PixiJS имплементация
│   ├── config.ts                    # 🎨 PixiJS стилове
│   │
│   ├── app-react.tsx                # ⚛️ React компонент
│   ├── index-react.tsx              # ⚛️ React entry point
│   │
│   ├── utils.ts                     # 🔧 Споделени функции
│   ├── interfaces/Interfaces.ts     # 📝 TypeScript типове
│   │
│   ├── index.html                   # 🌐 HTML шаблон
│   ├── styles.css                   # 💅 Глобални стилове
│   └── tsconfig.json                # ⚙️ TypeScript конфигурация
│
├── server/                          # Backend код
│   ├── index.js                     # 🖥️ WebSocket сървър
│   └── sender-example.js            # 📤 Тестов sender
│
├── package.json                     # 📦 Зависимости и скриптове
├── switch-renderer.js               # 🔄 Utility за смяна на рендерер
│
└── Документация
    ├── README.md                    # 📖 Главна документация
    ├── RENDERER_GUIDE.md            # 🎨 Ръководство за рендерери
    ├── TEST_RENDERERS.md            # 🧪 Тестване
    └── QUICK_REFERENCE.md           # ⚡ Този файл
```

## Конфигурация

### Смяна на рендерер:

**Автоматично:**
```bash
npm run switch:pixi   # или switch:react
```

**Ръчно:**
Редактирай `client/renderer.config.ts`:
```typescript
export const RENDERER_TYPE: RendererType = 'pixi'; // или 'react'
```

## WebSocket API

### Формат на съобщенията:

```json
{
  "type": "paramsUpdate",
  "payload": [
    {
      "name": "mode",
      "value": "MEGA_FREE_SPINS"
    },
    {
      "name": "multiplier",
      "value": 14
    }
  ],
  "ts": 1700000000
}
```

### Специални команди:

```javascript
// Изчистване на всички данни
{
  payload: [{ refresh: true }]
}

// Изтриване на конкретно поле (TODO: not implemented yet)
{
  payload: [{ name: "multiplier", value: null }]
}

// Custom text style (само PixiJS)
{
  payload: [{
    name: "title",
    value: "Custom Text",
    textStyle: JSON.stringify({
      fill: 0xff0000,
      fontSize: 48,
      fontFamily: 'Arial'
    })
  }]
}
```

## Keyboard Shortcuts

| Клавиш | Действие |
|--------|----------|
| `M` | Отпечатва payload Map в конзолата |

## URLs

- Frontend: http://localhost:8787
- WebSocket: ws://localhost:8787/ws
- Server: http://localhost:8787 (same port)

## Портове

| Порт | Услуга |
|------|--------|
| 8787 | HTTP Server + WebSocket |

## Troubleshooting

### Проблем: TypeScript грешки при build

```bash
# Изтрий build папката и rebuild
rm -rf client/build
npm run build
```

### Проблем: Порт 8787 е зает

Промени порта в `server/index.js`:
```javascript
const PORT = 8787; // Промени това
```

### Проблем: React не се зарежда

```bash
# Реинсталирай зависимостите
rm -rf node_modules package-lock.json
npm install
```

### Проблем: PixiJS не се вижда

Провери дали в конзолата има:
```
🎮 Loading PixiJS Renderer...
```

Ако не, провери `renderer.config.ts`.

## Разширяване

### Добавяне на ново поле (и двата рендерера):

1. Изпрати данни от sender:
```javascript
socket.send(JSON.stringify({
  payload: [{
    name: 'newField',
    value: 'Hello World'
  }]
}));
```

2. Данните автоматично се показват!

### Custom стилизиране:

**PixiJS:** Редактирай `client/config.ts`

**React:** Редактирай `styles` обекта в `client/app-react.tsx`

## Tips & Tricks

💡 **Използвай `npm run dev` за development** - автоматично рестартира сървъра и rebuild-ва клиента при промени

💡 **Натискай `M` за debug** - виж текущото състояние на payload Map

💡 **React е по-лесен за customize** - използвай го за прототипиране

💡 **PixiJS е по-бърз** - използвай го за production с много данни

💡 **Hot reload работи** - промените се виждат автоматично в браузъра

## Следващи Стъпки

1. ✅ Инсталирай зависимости: `npm install`
2. ✅ Стартирай dev: `npm run dev`
3. ✅ Изпрати тестови данни: `npm run send`
4. ✅ Пробвай двата рендерера: `npm run switch:react`
5. ✅ Интегрирай с твоя проект!

---

📚 **Пълна документация:** [README.md](./README.md) | [RENDERER_GUIDE.md](./RENDERER_GUIDE.md) | [TEST_RENDERERS.md](./TEST_RENDERERS.md)
