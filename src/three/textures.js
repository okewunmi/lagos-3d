import * as THREE from 'three';

// Real generated textures instead of flat colors — drawn once onto
// an offscreen canvas, then tiled across the ground with repeat
// wrapping. Cached so each texture is only built once no matter how
// many chapters use it.

const cache = new Map();

function makeCanvas(size = 256) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  return { canvas, ctx: canvas.getContext('2d') };
}

function speckle(ctx, size, count, colors, minR, maxR) {
  for (let i = 0; i < count; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = minR + Math.random() * (maxR - minR);
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
    ctx.globalAlpha = 0.35 + Math.random() * 0.4;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function toTexture(canvas, repeatX = 6, repeatY = 6) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function getGrassTexture() {
  if (cache.has('grass')) return cache.get('grass');
  const { canvas, ctx } = makeCanvas(256);
  ctx.fillStyle = '#233b28';
  ctx.fillRect(0, 0, 256, 256);
  // base mottling
  speckle(ctx, 256, 180, ['#2c4a32', '#1c2f21', '#325a3a'], 3, 9);
  // blade strokes
  for (let i = 0; i < 500; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const len = 3 + Math.random() * 5;
    const angle = Math.random() * Math.PI;
    ctx.strokeStyle = Math.random() < 0.5 ? '#3a6a45' : '#1a3020';
    ctx.globalAlpha = 0.4 + Math.random() * 0.3;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  const tex = toTexture(canvas, 10, 10);
  cache.set('grass', tex);
  return tex;
}

export function getDirtRoadTexture() {
  if (cache.has('road')) return cache.get('road');
  const { canvas, ctx } = makeCanvas(256);
  ctx.fillStyle = '#6b4a30';
  ctx.fillRect(0, 0, 256, 256);
  speckle(ctx, 256, 220, ['#7a5a3a', '#5a3f28', '#8a6a45'], 2, 7);
  // worn path: two lighter tire-track streaks running the length (y axis)
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = '#a3854f';
  ctx.fillRect(60, 0, 26, 256);
  ctx.fillRect(168, 0, 26, 256);
  ctx.globalAlpha = 1;
  speckle(ctx, 256, 60, ['#4a3320'], 1, 3);
  const tex = toTexture(canvas, 1, 8);
  cache.set('road', tex);
  return tex;
}

export function getWaterTexture() {
  if (cache.has('water')) return cache.get('water');
  const { canvas, ctx } = makeCanvas(256);
  ctx.fillStyle = '#20504a';
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 40; i++) {
    const y = Math.random() * 256;
    ctx.strokeStyle = Math.random() < 0.5 ? '#3d7a6e' : '#164038';
    ctx.globalAlpha = 0.25 + Math.random() * 0.3;
    ctx.lineWidth = 1 + Math.random() * 2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= 256; x += 16) {
      ctx.lineTo(x, y + Math.sin(x * 0.05 + i) * 6);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  const tex = toTexture(canvas, 8, 14);
  cache.set('water', tex);
  return tex;
}

export function getCourtyardTexture() {
  if (cache.has('courtyard')) return cache.get('courtyard');
  const { canvas, ctx } = makeCanvas(256);
  ctx.fillStyle = '#6b5636';
  ctx.fillRect(0, 0, 256, 256);
  speckle(ctx, 256, 160, ['#7a6440', '#5c492c', '#8a734a'], 2, 6);
  // swept-broom streaks
  ctx.globalAlpha = 0.2;
  ctx.strokeStyle = '#4a3a22';
  for (let i = 0; i < 10; i++) {
    const y = i * 26 + 8;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(256, y + 6);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  const tex = toTexture(canvas, 6, 6);
  cache.set('courtyard', tex);
  return tex;
}

export function getFoliageTexture() {
  if (cache.has('foliage')) return cache.get('foliage');
  const { canvas, ctx } = makeCanvas(128);
  ctx.fillStyle = '#2f5c3a';
  ctx.fillRect(0, 0, 128, 128);
  speckle(ctx, 128, 140, ['#3a6d46', '#234a2c', '#4a8055'], 3, 8);
  const tex = toTexture(canvas, 1, 1);
  cache.set('foliage', tex);
  return tex;
}
