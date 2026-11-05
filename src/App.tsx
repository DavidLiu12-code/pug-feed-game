import { useCallback, useEffect, useRef, useState } from 'react'
import { ColorPicker } from './components/ColorPicker'
import { FoodTray } from './components/FoodTray'
import { Meter } from './components/Meter'
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
import { COATS, FOODS, type FeedPhase, type Mood, type Screen } from './lib/types'
import { GameCanvas } from './scene/GameCanvas'

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
  const [trauma, setTrauma] = useState(0)
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

  useEffect(() => {
    if (screen !== 'play' || feeding || muted) return
    const id = window.setInterval(() => {
      if (mood === 'idle' || mood === 'longing') playSnuffle()
    }, 9000)
    return () => window.clearInterval(id)
  }, [screen, feeding, muted, mood])

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

  useEffect(() => {
    ;(window as unknown as { render_game_to_text?: () => string }).render_game_to_text = () =>
      JSON.stringify({
        screen,
        colorId,
        mood,
        fullness: Math.round(fullness),
        feeding,
        feedPhase,
        food: activeFood,
        muted,
        lang,
      })
  }, [screen, colorId, mood, fullness, feeding, feedPhase, activeFood, muted, lang])

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
      setTrauma((n) => n + 0.15)

      const item = FOODS.find((f) => f.id === foodId)!

      later(700, () => {
        setFeedPhase('feed')
        setMood('eating')
        setTrauma((n) => n + 0.35)
        if (foodId === 'water') playLap()
        else playMunch()
      })

      later(700 + 900, () => {
        setFeedPhase('retreat')
        setMood('happy')
        playHappy()
        setFullness((f) => Math.min(100, f + item.fill))
        setTrauma((n) => n + 0.2)
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
      {(screen === 'play' || screen === 'pick') && (
        <GameCanvas
          coat={coat}
          mood={screen === 'pick' ? 'longing' : mood}
          blinking={screen === 'play' ? blinking : false}
          foodId={screen === 'play' ? activeFood : null}
          feedPhase={screen === 'play' ? feedPhase : 'hidden'}
          trauma={screen === 'play' ? trauma : 0}
        />
      )}

      <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={toggleLang}
          className="pointer-events-auto rounded-full bg-[var(--paper)]/85 px-3 py-1.5 text-xs font-medium text-[var(--ink)] shadow-sm ring-1 ring-[var(--ink-soft)]/10 backdrop-blur
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
          className="pointer-events-auto rounded-full bg-[var(--paper)]/85 px-3 py-1.5 text-xs font-medium text-[var(--ink)] shadow-sm ring-1 ring-[var(--ink-soft)]/10 backdrop-blur
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
        <main className="pointer-events-none relative z-20 flex min-h-dvh flex-col items-center justify-between gap-3 px-3 pb-6 pt-16 sm:gap-4 sm:px-6">
          <div className="pointer-events-auto flex w-full max-w-lg flex-col items-center gap-2">
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
              <p className="rounded-full bg-[var(--paper)]/75 px-3 py-1 text-sm text-[var(--ink-soft)] backdrop-blur">
                {moodLabel(lang, mood)}
              </p>
              <span className="w-12" />
            </div>
            <div className="w-full rounded-2xl bg-[var(--paper)]/70 px-3 py-2 backdrop-blur">
              <Meter lang={lang} value={fullness} />
            </div>
          </div>

          <div className="flex-1" />

          <div className="pointer-events-auto flex w-full flex-col items-center gap-2">
            <p className="text-center text-xs text-[var(--ink-soft)]">{t(lang, 'tip')}</p>
            <FoodTray lang={lang} disabled={feeding} onSelect={onFeed} />
          </div>
        </main>
      )}
    </div>
  )
}
