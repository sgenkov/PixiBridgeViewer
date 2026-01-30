import { RENDERER_CONFIG } from './renderer.config.js';

/**
 * Main entry point - conditionally loads either PixiJS or React renderer
 * based on the RENDERER_TYPE configuration
 */

if (RENDERER_CONFIG.isPixi) {
  console.log('🎮 Loading PixiJS Renderer...');
  import('./app-pixi.js');
} else if (RENDERER_CONFIG.isReact) {
  console.log('⚛️ Loading React Renderer...');
  import('./index-react.js');
} else {
  console.error('❌ Invalid renderer type:', RENDERER_CONFIG.type);
}
