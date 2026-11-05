import { FoodIcon } from './FoodIcon'
import { foodName, type Lang } from '../lib/i18n'
import { FOODS } from '../lib/types'

interface Props {
  lang: Lang
  disabled: boolean
  onSelect: (id: (typeof FOODS)[number]['id']) => void
}

export function FoodTray({ lang, disabled, onSelect }: Props) {
  return (
    <div className="w-full max-w-lg px-3">
      <div className="flex flex-wrap items-stretch justify-center gap-2 rounded-2xl bg-[var(--paper)]/90 p-3 shadow-inner ring-1 ring-[var(--ink-soft)]/10 sm:gap-3 sm:p-4">
        {FOODS.map((f) => (
          <button
            key={f.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(f.id)}
            className="group flex min-w-[4.5rem] flex-1 flex-col items-center gap-1 rounded-xl bg-[var(--cream)] px-2 py-2.5 transition
              hover:bg-[var(--cream-deep)] hover:shadow-sm
              active:scale-[0.97]
              disabled:cursor-not-allowed disabled:opacity-45
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            <FoodIcon id={f.id} size={36} />
            <span className="text-[0.7rem] font-medium tracking-wide text-[var(--ink)] sm:text-xs">
              {foodName(lang, f.id)}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
