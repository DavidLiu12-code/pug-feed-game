import { colorName, t, type ColorId, type Lang } from '../lib/i18n'
import { COATS, type Coat } from '../lib/types'
import { PugFace } from './PugFace'

interface Props {
  lang: Lang
  selected: ColorId
  onSelect: (id: ColorId) => void
  onContinue: () => void
}

export function ColorPicker({ lang, selected, onSelect, onContinue }: Props) {
  const coat = COATS.find((c) => c.id === selected) as Coat

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 py-8">
      <h2 className="font-display text-2xl font-medium text-[var(--ink)] sm:text-3xl">
        {t(lang, 'pickColor')}
      </h2>

      <div className="w-56 sm:w-64">
        <PugFace coat={coat} mood="longing" blinking={false} />
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {COATS.map((c) => {
          const active = c.id === selected
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelect(c.id)}
              className={`flex flex-col items-center gap-1.5 rounded-xl px-3 py-2 transition
                ${active ? 'bg-[var(--paper)] shadow-sm ring-2 ring-[var(--accent)]' : 'hover:bg-[var(--paper)]/70'}
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]`}
            >
              <span
                className="h-10 w-10 rounded-full shadow-inner ring-1 ring-black/10"
                style={{ background: `linear-gradient(145deg, ${c.fur}, ${c.furDark})` }}
                aria-hidden
              />
              <span className="text-xs text-[var(--ink)]">{colorName(lang, c.id)}</span>
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="mt-2 rounded-full bg-[var(--accent)] px-8 py-3 text-base font-medium text-[var(--cream)] shadow-sm transition
          hover:bg-[var(--accent-deep)] active:scale-[0.98]
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
      >
        {t(lang, 'continue')}
      </button>
    </div>
  )
}
