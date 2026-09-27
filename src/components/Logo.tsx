import { cx } from '../lib/cx.ts'
import s from './Logo.module.css'

/** Wordmark: two words held together by a single sugar glint. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cx(s.logo, className)}>
      Sugar
      <svg className={s.glint} viewBox="0 0 12 12" aria-hidden="true">
        <path d="M6 0c.45 3.3 2.2 5.2 6 6-3.8.8-5.55 2.7-6 6-.45-3.3-2.2-5.2-6-6 3.8-.8 5.55-2.7 6-6Z" />
      </svg>
      Nails
    </span>
  )
}
