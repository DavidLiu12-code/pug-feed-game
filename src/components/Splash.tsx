import { t, type Lang } from '../lib/i18n'
import { COATS } from '../lib/types'
import { PugFace } from './PugFace'

interface Props {
  lang: Lang
  onStart: () => void
}

export function Splash({ lang, onStart }: Props) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-8 px-6 py-10 text-center">
      <div className="w-48 sm:w-56">
        <PugFace coat={COATS[0]} mood="idle" blinking={false} />
      </div>
      <div>
        <h1 className="font-display text-4xl font-medium tracking-tight text-[var(--ink)] sm:text-5xl">
          {t(lang, 'title')}
        </h1>
        <p className="mt-2 text-[var(--ink-soft)]">{t(lang, 'subtitle')}</p>
      </div>
      <button
        type="button"
        onClick={onStart}
        className="rounded-full bg-[var(--accent)] px-8 py-3 text-base font-medium text-[var(--cream)] shadow-sm transition
          hover:bg-[var(--accent-deep)] active:scale-[0.98]
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
      >
        {t(lang, 'start')}
      </button>
    </div>
  )
}
