/**
 * Renderer Configuration
 * Set the RENDERER_TYPE to either 'pixi' or 'react' to choose the visualization engine
 */

export type RendererType = 'pixi' | 'react';

// Change this value to switch between PixiJS and React rendering
export const RENDERER_TYPE: RendererType = 'pixi';

function getRendererConfig(type: RendererType) {
  return {
    type,
    isPixi: type === 'pixi',
    isReact: type === 'react',
  };
}

export const RENDERER_CONFIG = getRendererConfig(RENDERER_TYPE);
