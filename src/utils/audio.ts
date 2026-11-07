/**
 * Shared Aerospace Cockpit Web Audio API Engine
 * Pure synthesized audio without external mp3s
 */
class CockpitAudioEngine {
  private ctx: AudioContext | null = null
  public isMuted: boolean = false

  toggleMute(): boolean {
    this.isMuted = !this.isMuted
    return this.isMuted
  }

  init() {
    if (typeof window === 'undefined') return
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        if (AudioCtx) this.ctx = new AudioCtx()
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {})
      }
    } catch {}
  }

  playClick() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return
    try {
      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(1200, now)
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.04)

      gain.gain.setValueAtTime(0.2, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start(now)
      osc.stop(now + 0.05)
    } catch {}
  }

  playHover() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return
    try {
      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(800, now)
      osc.frequency.exponentialRampToValueAtTime(1100, now + 0.03)

      gain.gain.setValueAtTime(0.04, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start(now)
      osc.stop(now + 0.035)
    } catch {}
  }

  playSuccessChime() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return
    try {
      const freqs = [523.25, 659.25, 783.99, 1046.5]
      freqs.forEach((freq, idx) => {
        if (!this.ctx) return
        const now = this.ctx.currentTime + idx * 0.08
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now)

        gain.gain.setValueAtTime(0.2, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)

        osc.connect(gain)
        gain.connect(this.ctx.destination)

        osc.start(now)
        osc.stop(now + 0.32)
      })
    } catch {}
  }

  playThrusterPuff() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return
    try {
      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      const filter = this.ctx.createBiquadFilter()

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(140, now)
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.08)

      filter.type = 'bandpass'
      filter.frequency.setValueAtTime(450, now)
      filter.Q.setValueAtTime(2, now)

      gain.gain.setValueAtTime(0.2, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start(now)
      osc.stop(now + 0.09)
    } catch {}
  }

  playRadioChirp() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return
    try {
      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(2524, now)

      gain.gain.setValueAtTime(0.08, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start(now)
      osc.stop(now + 0.09)
    } catch {}
  }

  playLockChime() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return
    try {
      const freqs = [523.25, 659.25, 783.99, 1046.5]
      freqs.forEach((freq, idx) => {
        if (!this.ctx) return
        const now = this.ctx.currentTime + idx * 0.08
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now)

        gain.gain.setValueAtTime(0.25, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

        osc.connect(gain)
        gain.connect(this.ctx.destination)

        osc.start(now)
        osc.stop(now + 0.36)
      })
    } catch {}
  }

  playAlarmBeep() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return
    try {
      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'square'
      osc.frequency.setValueAtTime(880, now)
      osc.frequency.setValueAtTime(660, now + 0.1)

      gain.gain.setValueAtTime(0.15, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start(now)
      osc.stop(now + 0.23)
    } catch {}
  }
}

export const cockpitAudio = new CockpitAudioEngine()

