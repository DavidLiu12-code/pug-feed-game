import { colorName, t, type ColorId, type Lang } from '../lib/i18n'
import { COATS, publicUrl } from '../lib/types'

interface Props {
  lang: Lang
  selected: ColorId
  onSelect: (id: ColorId) => void
  onContinue: () => void
}

export function ColorPicker({ lang, selected, onSelect, onContinue }: Props) {
  return (
    <div className="pointer-events-none relative z-20 flex min-h-dvh flex-col items-center justify-end gap-5 px-4 pb-10 pt-20 sm:justify-center sm:pb-8">
      <div className="pointer-events-auto flex w-full max-w-md flex-col items-center gap-5 rounded-3xl bg-[var(--paper)]/80 px-5 py-6 shadow-sm ring-1 ring-[var(--ink-soft)]/10 backdrop-blur">
        <h2 className="font-display text-2xl font-medium text-[var(--ink)] sm:text-3xl">
          {t(lang, 'pickColor')}
        </h2>
        <p className="text-center text-sm text-[var(--ink-soft)]">
          {lang === 'zh' ? '背后是你的巴哥，点选毛色预览' : 'Your pug waits behind — pick a coat'}
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          {COATS.map((c) => {
            const active = c.id === selected
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelect(c.id)}
                className={`flex flex-col items-center gap-1.5 rounded-xl px-3 py-2 transition-[background-color,box-shadow]
                  ${active ? 'bg-[var(--cream)] shadow-sm ring-2 ring-[var(--accent)]' : 'hover:bg-[var(--cream)]/70'}
                  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]`}
              >
                <span className="h-12 w-12 overflow-hidden rounded-full shadow-inner ring-1 ring-black/10">
                  <img
                    src={publicUrl(c.photo)}
                    alt=""
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </span>
                <span className="text-xs text-[var(--ink)]">{colorName(lang, c.id)}</span>
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="mt-1 rounded-full bg-[var(--accent)] px-8 py-3 text-base font-medium text-[var(--cream)] shadow-sm transition-[background-color,transform]
            hover:bg-[var(--accent-deep)] active:scale-[0.98]
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          {t(lang, 'continue')}
        </button>
      </div>
    </div>
  )
}
