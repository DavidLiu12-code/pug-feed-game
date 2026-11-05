import { useCallback, useEffect, useRef, useState } from 'react'
import { ColorPicker } from './components/ColorPicker'
import { FeedHand } from './components/FeedHand'
import { FoodTray } from './components/FoodTray'
import { Meter } from './components/Meter'
import { PugFace } from './components/PugFace'
import { Splash } from './components/Splash'
import {
  isMuted,
  playHappy,
  playLap,
  playMunch,
  playSnuffle,
  setMuted,
  unlockAudio,
} from './lib/audio'
import { t, type ColorId, type FoodId, type Lang } from './lib/i18n'
import { COATS, FOODS, type Mood, type Screen } from './lib/types'

type FeedPhase = 'hidden' | 'approach' | 'feed' | 'retreat'

function moodLabel(lang: Lang, mood: Mood): string {
  switch (mood) {
    case 'longing':
      return t(lang, 'longing')
    case 'eating':
      return t(lang, 'eating')
    case 'happy':
      return t(lang, 'happy')
    case 'satisfied':
      return t(lang, 'satisfied')
    default:
      return t(lang, 'idle')
  }
}

export default function App() {
  const [lang, setLang] = useState<Lang>('zh')
  const [screen, setScreen] = useState<Screen>('splash')
  const [colorId, setColorId] = useState<ColorId>('fawn')
  const [mood, setMood] = useState<Mood>('idle')
  const [fullness, setFullness] = useState(12)
  const [blinking, setBlinking] = useState(false)
  const [muted, setMutedState] = useState(false)
  const [feeding, setFeeding] = useState(false)
  const [activeFood, setActiveFood] = useState<FoodId | null>(null)
  const [feedPhase, setFeedPhase] = useState<FeedPhase>('hidden')
  const timers = useRef<number[]>([])

  const coat = COATS.find((c) => c.id === colorId)!

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
  }

  const later = (ms: number, fn: () => void) => {
    const id = window.setTimeout(fn, ms)
    timers.current.push(id)
  }

  // blink loop
  useEffect(() => {
    if (screen !== 'play') return
    let cancelled = false
    const loop = () => {
      const wait = 2200 + Math.random() * 2800
      const id = window.setTimeout(() => {
        if (cancelled) return
        if (mood !== 'eating') {
          setBlinking(true)
          window.setTimeout(() => {
            if (!cancelled) setBlinking(false)
          }, 140)
        }
        loop()
      }, wait)
      timers.current.push(id)
    }
    loop()
    return () => {
      cancelled = true
    }
  }, [screen, mood])

  // occasional idle snuffle when longing / idle
  useEffect(() => {
    if (screen !== 'play' || feeding || muted) return
    const id = window.setInterval(() => {
      if (mood === 'idle' || mood === 'longing') playSnuffle()
    }, 9000)
    return () => window.clearInterval(id)
  }, [screen, feeding, muted, mood])

  // decay fullness slowly
  useEffect(() => {
    if (screen !== 'play') return
    const id = window.setInterval(() => {
      setFullness((f) => Math.max(0, f - 0.4))
    }, 2000)
    return () => window.clearInterval(id)
  }, [screen])

  useEffect(() => {
    if (fullness >= 92 && mood !== 'eating' && mood !== 'happy') {
      setMood('satisfied')
    } else if (fullness < 40 && mood === 'satisfied') {
      setMood('idle')
    } else if (fullness < 55 && (mood === 'idle' || mood === 'satisfied') && !feeding) {
      setMood('longing')
    }
  }, [fullness, mood, feeding])

  const toggleMute = () => {
    const next = !muted
    setMutedState(next)
    setMuted(next)
  }

  const toggleLang = () => setLang((l) => (l === 'zh' ? 'en' : 'zh'))

  const onFeed = useCallback(
    (foodId: FoodId) => {
      if (feeding) return
      unlockAudio()
      clearTimers()
      setFeeding(true)
      setActiveFood(foodId)
      setMood('longing')
      playSnuffle()
      setFeedPhase('approach')

      const item = FOODS.find((f) => f.id === foodId)!

      later(700, () => {
        setFeedPhase('feed')
        setMood('eating')
        if (foodId === 'water') playLap()
        else playMunch()
      })

      later(700 + 900, () => {
        setFeedPhase('retreat')
        setMood('happy')
        playHappy()
        setFullness((f) => Math.min(100, f + item.fill))
      })

      later(700 + 900 + 650, () => {
        setFeedPhase('hidden')
        setActiveFood(null)
        setFeeding(false)
        setMood((m) => (m === 'happy' ? 'idle' : m))
      })
    },
    [feeding],
  )

  useEffect(() => () => clearTimers(), [])

  return (
    <div className="app-shell relative min-h-dvh overflow-hidden">
      {/* top bar */}
      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={toggleLang}
          className="rounded-full bg-[var(--paper)]/80 px-3 py-1.5 text-xs font-medium text-[var(--ink)] shadow-sm ring-1 ring-[var(--ink-soft)]/10 backdrop-blur
            hover:bg-[var(--cream)]
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          {lang === 'zh' ? 'EN' : '中文'}
        </button>
        <button
          type="button"
          onClick={() => {
            unlockAudio()
            toggleMute()
          }}
          className="rounded-full bg-[var(--paper)]/80 px-3 py-1.5 text-xs font-medium text-[var(--ink)] shadow-sm ring-1 ring-[var(--ink-soft)]/10 backdrop-blur
            hover:bg-[var(--cream)]
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          aria-pressed={muted}
        >
          {muted || isMuted() ? t(lang, 'unmute') : t(lang, 'mute')}
        </button>
      </header>

      {screen === 'splash' && (
        <Splash
          lang={lang}
          onStart={() => {
            unlockAudio()
            setScreen('pick')
          }}
        />
      )}

      {screen === 'pick' && (
        <ColorPicker
          lang={lang}
          selected={colorId}
          onSelect={setColorId}
          onContinue={() => {
            unlockAudio()
            playSnuffle()
            setMood('longing')
            setFullness(18)
            setScreen('play')
          }}
        />
      )}

      {screen === 'play' && (
        <main className="relative flex min-h-dvh flex-col items-center justify-between gap-3 px-3 pb-6 pt-16 sm:gap-4 sm:px-6">
          <div className="flex w-full max-w-lg flex-col items-center gap-2">
            <div className="flex w-full items-center justify-between gap-2 px-1">
              <button
                type="button"
                onClick={() => {
                  clearTimers()
                  setFeeding(false)
                  setFeedPhase('hidden')
                  setActiveFood(null)
                  setScreen('pick')
                }}
                className="text-xs text-[var(--ink-soft)] underline-offset-2 hover:text-[var(--ink)] hover:underline"
              >
                {t(lang, 'back')}
              </button>
              <p className="text-sm text-[var(--ink-soft)]">{moodLabel(lang, mood)}</p>
              <span className="w-12" />
            </div>
            <Meter lang={lang} value={fullness} />
          </div>

          <div className="relative flex w-full flex-1 items-center justify-center">
            <div className="relative w-[min(92vw,420px)]">
              <PugFace coat={coat} mood={mood} blinking={blinking} />
              <FeedHand foodId={activeFood} phase={feedPhase} />
            </div>
          </div>

          <div className="flex w-full flex-col items-center gap-2">
            <p className="text-center text-xs text-[var(--ink-soft)]">{t(lang, 'tip')}</p>
            <FoodTray lang={lang} disabled={feeding} onSelect={onFeed} />
          </div>
        </main>
      )}
    </div>
  )
}
