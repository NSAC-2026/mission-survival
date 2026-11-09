/**
 * Shared Aerospace Cockpit Web Audio API Engine
 * Pure synthesized audio without external mp3s
 */
class CockpitAudioEngine {
  private ctx: AudioContext | null = null
  public isMuted: boolean = false
  private humNode: OscillatorNode | null = null
  private humGain: GainNode | null = null

  toggleMute(): boolean {
    this.isMuted = !this.isMuted
    try {
      if (this.ctx && this.humGain) {
        if (this.isMuted) {
          this.humGain.gain.setValueAtTime(0, this.ctx.currentTime)
        } else {
          this.humGain.gain.setValueAtTime(0.012, this.ctx.currentTime)
        }
      }
    } catch {}
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

  // Heavy cockpit push button
  playHeavyButton() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return
    try {
      const now = this.ctx.currentTime

      // Low thump
      const osc1 = this.ctx.createOscillator()
      const gain1 = this.ctx.createGain()
      osc1.type = 'sine'
      osc1.frequency.setValueAtTime(180, now)
      osc1.frequency.exponentialRampToValueAtTime(45, now + 0.12)

      gain1.gain.setValueAtTime(0.4, now)
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

      osc1.connect(gain1)
      gain1.connect(this.ctx.destination)
      osc1.start(now)
      osc1.stop(now + 0.13)

      // Metallic snap
      const osc2 = this.ctx.createOscillator()
      const gain2 = this.ctx.createGain()
      osc2.type = 'sawtooth'
      osc2.frequency.setValueAtTime(2400, now)
      osc2.frequency.exponentialRampToValueAtTime(400, now + 0.03)

      gain2.gain.setValueAtTime(0.18, now)
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.03)

      osc2.connect(gain2)
      gain2.connect(this.ctx.destination)
      osc2.start(now)
      osc2.stop(now + 0.04)
    } catch {}
  }

  // Slider tick / adjustment pitch
  playSliderTick(valuePercent: number | string = 50) {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return
    try {
      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      const baseFreq = 350 + (Number(valuePercent) / 100) * 1100
      osc.type = 'square'
      osc.frequency.setValueAtTime(baseFreq, now)

      gain.gain.setValueAtTime(0.05, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start(now)
      osc.stop(now + 0.03)
    } catch {}
  }

  // Mission confirm chime
  playConfirmChime() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return
    try {
      const notes = [587.33, 880, 1174.66] // D5, A5, D6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return
        const now = this.ctx.currentTime + idx * 0.07
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now)

        gain.gain.setValueAtTime(0.2, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)

        osc.connect(gain)
        gain.connect(this.ctx.destination)

        osc.start(now)
        osc.stop(now + 0.26)
      })
    } catch {}
  }

  // Execute script telemetry burst
  playScriptBurst() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return
    try {
      for (let i = 0; i < 6; i++) {
        const now = this.ctx.currentTime + i * 0.045
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()

        osc.type = i % 2 === 0 ? 'square' : 'sawtooth'
        osc.frequency.setValueAtTime(300 + Math.random() * 1200, now)

        gain.gain.setValueAtTime(0.12, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)

        osc.connect(gain)
        gain.connect(this.ctx.destination)

        osc.start(now)
        osc.stop(now + 0.045)
      }
    } catch {}
  }

  // Subtle electrical CRT ambient hum
  startCRTHum() {
    if (this.humNode) return
    this.init()
    if (!this.ctx) return
    try {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      const filter = this.ctx.createBiquadFilter()

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(60, this.ctx.currentTime)

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(160, this.ctx.currentTime)

      gain.gain.setValueAtTime(this.isMuted ? 0 : 0.01, this.ctx.currentTime)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      this.humNode = osc
      this.humGain = gain
    } catch {}
  }

  stopCRTHum() {
    try {
      if (this.humNode) {
        this.humNode.stop()
        this.humNode.disconnect()
        this.humNode = null
      }
      if (this.humGain) {
        this.humGain.disconnect()
        this.humGain = null
      }
    } catch {}
  }
}

export const cockpitAudio = new CockpitAudioEngine()

