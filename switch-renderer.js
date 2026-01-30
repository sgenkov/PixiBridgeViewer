#!/usr/bin/env node

/**
 * Utility script to switch between PixiJS and React renderers
 * Usage: node switch-renderer.js [pixi|react]
 */

const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'client', 'renderer.config.ts');
const arg = process.argv[2];

if (!arg || !['pixi', 'react'].includes(arg)) {
  console.error('❌ Usage: node switch-renderer.js [pixi|react]');
  process.exit(1);
}

const rendererType = arg;

try {
  let config = fs.readFileSync(configPath, 'utf8');
  
  // Replace the RENDERER_TYPE value
  config = config.replace(
    /export const RENDERER_TYPE: RendererType = '(pixi|react)';/,
    `export const RENDERER_TYPE: RendererType = '${rendererType}';`
  );
  
  fs.writeFileSync(configPath, config, 'utf8');
  
  const icon = rendererType === 'pixi' ? '🎮' : '⚛️';
  console.log(`${icon} Renderer switched to: ${rendererType.toUpperCase()}`);
  console.log('✅ Run "npm run build" or restart "npm run dev" to apply changes.');
} catch (error) {
  console.error('❌ Error switching renderer:', error.message);
  process.exit(1);
}
