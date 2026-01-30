# 📝 Changelog

## Version 0.2.2 - Payload Format Fix

### 🐛 Bug Fixes

**"payload is not iterable" Error**
- ✅ Fixed TypeError when receiving payload as object instead of array
- ✅ Updated `mergePayload()` function in both renderers to handle both formats
- ✅ Fixed `sender-example.js` to send correct array format

**Changes:**
- `server/sender-example.js`: Now sends `payload` as array of `{ name, value }` objects
- `client/app-pixi.ts`: `mergePayload()` now accepts both array and object formats
- `client/app-react.tsx`: `mergePayload()` now accepts both array and object formats
- Object format is auto-converted to array format for backwards compatibility

**Example:**
```javascript
// New format (recommended):
{ payload: [{ name: "mode", value: "FREE_SPINS" }] }

// Old format (still works):
{ payload: { mode: "FREE_SPINS" } }
```

### 📚 Documentation Updates

- **README.md** - Updated message format section with both formats
- **TROUBLESHOOTING.md** - Added solution for "payload is not iterable" error

---

## Version 0.2.1 - React JSX Runtime Fix

### 🐛 Bug Fixes

**React Renderer - Module Resolution Error**
- ✅ Fixed "Failed to resolve module specifier 'react/jsx-runtime'" error
- ✅ Changed JSX transformation from `react-jsx` to `react` (classic)
- ✅ Updated TypeScript moduleResolution from `Bundler` to `Node`
- ✅ React and ReactDOM now use global UMD objects from HTML scripts

**Technical Changes:**
- `client/tsconfig.json`: `jsx: "react"` instead of `jsx: "react-jsx"`
- `client/app-react.tsx`: Uses global `React` object instead of imports
- `client/index-react.tsx`: Uses global `ReactDOM` object

**Why:** The project uses UMD builds loaded via `<script>` tags, not a module bundler, so the automatic JSX runtime couldn't resolve module paths. Classic JSX transformation compiles to `React.createElement()` which works with global React objects.

### 📚 New Documentation

- **TROUBLESHOOTING.md** - Comprehensive troubleshooting guide with solutions for common issues

---

## Version 0.2.0 - React Renderer Support

### 🎉 Нови Функции

#### Dual Renderer System
- ✅ Добавена поддръжка за React рендерер
- ✅ Запазена оригиналната PixiJS имплементация
- ✅ Лесно превключване между двата рендерера с npm скриптове

#### Нови Файлове

**Client (Frontend):**
- `client/renderer.config.ts` - Централна конфигурация за избор на рендерер
- `client/app-react.tsx` - React компонент за визуализация
- `client/index-react.tsx` - React entry point
- `client/app.ts` - Нов главен entry point с условно зареждане
- `client/app-pixi.ts` - Преименуван от app.ts (PixiJS имплементация)

**Utility Scripts:**
- `switch-renderer.js` - Node.js скрипт за автоматична смяна на рендерер

**Документация:**
- `RENDERER_GUIDE.md` - Пълно ръководство за рендерерите
- `TEST_RENDERERS.md` - Инструкции за тестване
- `QUICK_REFERENCE.md` - Бърза справка
- `CHANGELOG.md` - Този файл

#### Нови npm Скриптове

```json
"switch:pixi": "node switch-renderer.js pixi",
"switch:react": "node switch-renderer.js react"
```

#### Нови Зависимости

```json
"react": "^18.2.0",
"react-dom": "^18.2.0",
"@types/react": "^18.2.48",
"@types/react-dom": "^18.2.18"
```

### 🔧 Промени

#### Модифицирани Файлове

**package.json:**
- Добавени React зависимости
- Добавени npm скриптове за превключване

**client/tsconfig.json:**
- Добавена `"jsx": "react-jsx"` за JSX поддръжка
- Добавено `"**/*.tsx"` в include секцията

**client/index.html:**
- Добавени React UMD scripts
- Променено заглавие от "Pixi Bridge Viewer" на "Bridge Viewer"
- Коментари за по-добра четимост

**README.md:**
- Обновен със секция за двата рендерера
- Добавени линкове към документация
- Добавена секция "Особености"

### 📊 Архитектура

```
Преди:
app.ts (PixiJS) → Директно визуализира

След:
app.ts (Router) → renderer.config.ts
                  ├─→ app-pixi.ts (PixiJS)
                  └─→ index-react.tsx → app-react.tsx (React)
```

### 🎯 Ключови Решения

1. **Запазена обратна съвместимост** - Оригиналният PixiJS код работи без промени
2. **Модулна архитектура** - Всеки рендерер е напълно независим
3. **Споделена логика** - utils.ts и Interfaces.ts се използват и от двата
4. **Лесно превключване** - Само една конфигурация променя целия рендерер

### 🚀 Как да използвате

#### Бърз старт с PixiJS (default):
```bash
npm install
npm run dev
```

#### Превключване към React:
```bash
npm run switch:react
npm run dev
```

### 📈 Performance

| Характеристика | PixiJS | React |
|----------------|--------|-------|
| Rendering | WebGL Canvas | HTML/DOM |
| FPS | ~60 FPS | ~60 FPS |
| CPU Usage | Ниско | Средно |
| Memory | Средно | Средно |
| Startup | Бързо | Бързо |

### 🐛 Известни Проблеми

Няма известни проблеми в момента. За bug reports, моля създайте issue.

### ⚠️ Breaking Changes

Няма breaking changes. Всички съществуващи интеграции с WebSocket API продължават да работят.

### 📝 Migration Guide

Ако сте използвали предишната версия:

1. Запазете вашите custom промени в `app-pixi.ts` (преди app.ts)
2. Изпълнете `npm install` за новите зависимости
3. Изпълнете `npm run build` за rebuild
4. Всичко трябва да работи както преди!

### 🙏 Credits

- **PixiJS** - https://pixijs.com/
- **React** - https://react.dev/
- **TypeScript** - https://www.typescriptlang.org/

---

## Version 0.1.0 - Initial Release

### Особености
- PixiJS визуализация
- WebSocket сървър
- Real-time data updates
- TypeScript support
