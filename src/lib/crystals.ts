/** Shared palette and sprites for the canvas sugar crystals. */

export type Kind = 'diamond' | 'ring' | 'glint'

export const SUGAR = '#f5eee8'
export const BLUSH = '#f3a9c8'
export const PINK = '#e3568e'
export const DEEP = '#a3305f'

export const rand = (min: number, max: number) => min + Math.random() * (max - min)
export const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)]

/** A crystal pre-rendered once: filled diamond, outlined diamond or four-point glint. */
export function makeSprite(kind: Kind, color: string, size: number, dpr: number) {
  const px = Math.ceil(size * dpr) + 2
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = px
  const g = canvas.getContext('2d')!
  g.translate(px / 2, px / 2)
  g.scale(dpr, dpr)
  const r = size / 2
  g.beginPath()
  if (kind === 'glint') {
    const k = r * 0.2
    g.moveTo(0, -r)
    g.quadraticCurveTo(k, -k, r, 0)
    g.quadraticCurveTo(k, k, 0, r)
    g.quadraticCurveTo(-k, k, -r, 0)
    g.quadraticCurveTo(-k, -k, 0, -r)
  } else {
    g.moveTo(0, -r)
    g.lineTo(r * 0.78, 0)
    g.lineTo(0, r)
    g.lineTo(-r * 0.78, 0)
    g.closePath()
  }
  if (kind === 'ring') {
    g.strokeStyle = color
    g.lineWidth = 1
    g.stroke()
  } else {
    g.fillStyle = color
    g.fill()
  }
  return canvas
}

/** Sprites cached by kind, colour and size for one pixel ratio. */
export function spriteCache(dpr: number) {
  const sprites = new Map<string, HTMLCanvasElement>()
  return (kind: Kind, color: string, size: number) => {
    const key = kind + color + size
    let sprite = sprites.get(key)
    if (!sprite) sprites.set(key, (sprite = makeSprite(kind, color, size, dpr)))
    return sprite
  }
}
