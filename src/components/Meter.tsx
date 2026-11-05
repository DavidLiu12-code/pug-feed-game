import { t, type Lang } from '../lib/i18n'

interface Props {
  lang: Lang
  value: number // 0–100
}

export function Meter({ lang, value }: Props) {
  const v = Math.max(0, Math.min(100, value))
  return (
    <div className="w-full max-w-xs px-2">
      <div className="mb-1 flex items-baseline justify-between text-xs text-[var(--ink-soft)]">
        <span>{t(lang, 'hunger')}</span>
        <span className="tabular-nums">{Math.round(v)}%</span>
      </div>
      <div
        className="h-2.5 overflow-hidden rounded-full bg-[var(--paper-deep)] ring-1 ring-[var(--ink-soft)]/10"
        role="progressbar"
        aria-valuenow={Math.round(v)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={t(lang, 'hunger')}
      >
        <div
          className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-500 ease-out"
          style={{ width: `${v}%` }}
        />
      </div>
    </div>
  )
}
