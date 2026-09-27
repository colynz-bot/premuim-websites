import type { CSSProperties } from 'react'
import s from './Roll.module.css'

/** Letters that roll up to a fresh copy when the parent link is hovered. Screen readers get the plain word. */
export function Roll({ text }: { text: string }) {
  return (
    <span className={s.roll}>
      <span className="sr-only">{text}</span>
      <span className={s.letters} aria-hidden="true">
        {Array.from(text, (char, i) => {
          const glyph = char === ' ' ? ' ' : char
          return (
            <span key={i} className={s.char} data-char={glyph} style={{ '--i': i } as CSSProperties}>
              {glyph}
            </span>
          )
        })}
      </span>
    </span>
  )
}
