/** Soft synthesized pug sounds — no external assets */

let ctx: AudioContext | null = null
let muted = false

function ac(): AudioContext {
  if (!ctx) ctx = new AudioContext()
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

export function setMuted(m: boolean) {
  muted = m
}

export function isMuted() {
  return muted
}

function noiseBuffer(duration: number, sampleRate: number): AudioBuffer {
  const len = Math.floor(duration * sampleRate)
  const buf = ac().createBuffer(1, len, sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < len; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / len)
  }
  return buf
}

/** Soft snuffle / 哼哼唧唧 */
export function playSnuffle() {
  if (muted) return
  const c = ac()
  const now = c.currentTime
  for (let i = 0; i < 3; i++) {
    const src = c.createBufferSource()
    src.buffer = noiseBuffer(0.12 + Math.random() * 0.06, c.sampleRate)
    const filter = c.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 280 + i * 40 + Math.random() * 60
    filter.Q.value = 1.2
    const gain = c.createGain()
    const t0 = now + i * 0.14
    gain.gain.setValueAtTime(0, t0)
    gain.gain.linearRampToValueAtTime(0.045, t0 + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.11)
    src.connect(filter)
    filter.connect(gain)
    gain.connect(c.destination)
    src.start(t0)
    src.stop(t0 + 0.13)
  }
  // soft whimper tone
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(180, now)
  osc.frequency.linearRampToValueAtTime(140, now + 0.35)
  g.gain.setValueAtTime(0, now)
  g.gain.linearRampToValueAtTime(0.028, now + 0.04)
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.4)
  osc.connect(g)
  g.connect(c.destination)
  osc.start(now)
  osc.stop(now + 0.42)
}

/** Munch / chew */
export function playMunch() {
  if (muted) return
  const c = ac()
  const now = c.currentTime
  for (let i = 0; i < 4; i++) {
    const osc = c.createOscillator()
    const g = c.createGain()
    osc.type = 'triangle'
    const f = 90 + Math.random() * 40
    const t0 = now + i * 0.09
    osc.frequency.setValueAtTime(f, t0)
    osc.frequency.exponentialRampToValueAtTime(f * 0.6, t0 + 0.07)
    g.gain.setValueAtTime(0, t0)
    g.gain.linearRampToValueAtTime(0.05, t0 + 0.01)
    g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.08)
    osc.connect(g)
    g.connect(c.destination)
    osc.start(t0)
    osc.stop(t0 + 0.09)
  }
}

/** Happy little chirp / content hum */
export function playHappy() {
  if (muted) return
  const c = ac()
  const now = c.currentTime
  const notes = [220, 277, 330]
  notes.forEach((freq, i) => {
    const osc = c.createOscillator()
    const g = c.createGain()
    osc.type = 'sine'
    const t0 = now + i * 0.1
    osc.frequency.setValueAtTime(freq, t0)
    g.gain.setValueAtTime(0, t0)
    g.gain.linearRampToValueAtTime(0.035, t0 + 0.03)
    g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.22)
    osc.connect(g)
    g.connect(c.destination)
    osc.start(t0)
    osc.stop(t0 + 0.24)
  })
  // soft snuffle after
  setTimeout(() => playSnuffle(), 280)
}

/** Water lap */
export function playLap() {
  if (muted) return
  const c = ac()
  const now = c.currentTime
  for (let i = 0; i < 3; i++) {
    const src = c.createBufferSource()
    src.buffer = noiseBuffer(0.08, c.sampleRate)
    const filter = c.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 800
    const g = c.createGain()
    const t0 = now + i * 0.12
    g.gain.setValueAtTime(0, t0)
    g.gain.linearRampToValueAtTime(0.04, t0 + 0.015)
    g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.07)
    src.connect(filter)
    filter.connect(g)
    g.connect(c.destination)
    src.start(t0)
    src.stop(t0 + 0.08)
  }
}

export function unlockAudio() {
  try {
    const c = ac()
    if (c.state === 'suspended') void c.resume()
  } catch {
    /* ignore */
  }
}
