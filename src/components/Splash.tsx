import { t, type Lang } from '../lib/i18n'
import { COATS, publicUrl } from '../lib/types'

interface Props {
  lang: Lang
  onStart: () => void
}

export function Splash({ lang, onStart }: Props) {
  const photo = publicUrl(COATS[0].photo)
  return (
    <div className="relative z-20 flex min-h-dvh flex-col items-center justify-center gap-8 px-6 py-10 text-center">
      <div className="relative h-44 w-44 overflow-hidden rounded-[28px] shadow-md ring-1 ring-[var(--ink-soft)]/15 sm:h-52 sm:w-52">
        <img
          src={photo}
          alt=""
          className="h-full w-full object-cover"
          draggable={false}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--ink)]/25 to-transparent" />
      </div>
      <div>
        <h1 className="font-display text-4xl font-medium tracking-tight text-[var(--ink)] sm:text-5xl">
          {t(lang, 'title')}
        </h1>
        <p className="mt-2 text-[var(--ink-soft)]">{t(lang, 'subtitle')}</p>
        <p className="mt-1 text-xs text-[var(--ink-soft)]/80">
          {lang === 'zh' ? '3D 质感 · 真实巴哥犬照片' : '3D feel · Real pug photos'}
        </p>
      </div>
      <button
        type="button"
        onClick={onStart}
        className="rounded-full bg-[var(--accent)] px-8 py-3 text-base font-medium text-[var(--cream)] shadow-sm transition-[background-color,transform]
          hover:bg-[var(--accent-deep)] active:scale-[0.98]
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
      >
        {t(lang, 'start')}
      </button>
    </div>
  )
}
