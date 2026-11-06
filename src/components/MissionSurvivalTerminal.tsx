'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'

/* ==========================================================================
   AUDIO SYNTHESIZER (Pure Web Audio API - Zero External Audio Files)
   ========================================================================== */
class CockpitAudio {
  private ctx: AudioContext | null = null
  public isMuted: boolean = false
  private humNode: OscillatorNode | null = null
  private humGain: GainNode | null = null

  init() {
    if (typeof window === 'undefined') return
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        if (AudioCtx) {
          this.ctx = new AudioCtx()
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {})
      }
    } catch (e) {
      console.warn('Audio init note:', e)
    }
  }

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

      gain.gain.setValueAtTime(0.25, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start(now)
      osc.stop(now + 0.05)
    } catch {}
  }

  playHeavyButton() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return
    try {
      const now = this.ctx.currentTime

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

  playSliderTick(valuePercent = 50) {
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

  playConfirmChime() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return
    try {
      const notes = [587.33, 880, 1174.66]
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

  startCRTHum() {
    if (this.humNode || typeof window === 'undefined') return
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
    } catch {}
  }
}

/* ==========================================================================
   EDUCATIONAL TIPS DATABASE
   ========================================================================== */
interface TipContent {
  title: string
  points: { label: string; desc: string }[]
  theme: 'moon' | 'mars'
}

const educationalTips: Record<string, TipContent> = {
  power: {
    title: '🔋 POWER SUPPLY // WHERE IS IT USED?',
    points: [
      { label: 'What is this?', desc: 'This is the electrical power stored in our Moon basecamp backup lithium batteries.' },
      { label: 'Where is it used?', desc: 'It powers our habitat lights, life-support computers, air pumps, heaters, and water recyclers.' },
      { label: 'Why is it low (35%)?', desc: 'The Moon has a 14-day-long night! Without sunlight, our solar panels are completely dead. We only have 35% battery left to survive the remaining 7 days of night!' },
    ],
    theme: 'moon',
  },
  oxygen: {
    title: '🫁 LIFE SUPPORT (OXYGEN) // WHERE IS IT USED?',
    points: [
      { label: 'What is this?', desc: 'The ECLSS machine (Environmental Control & Life Support System).' },
      { label: 'Where is it used?', desc: 'It pulls out poisonous carbon dioxide (CO₂) exhaled by astronauts and pumps fresh, breathable oxygen into the habitat dome.' },
      { label: 'What happens if you divert it to 25%?', desc: 'The recycler pauses! Astronauts must breathe stored emergency oxygen tanks. If those run empty, the air inside the base becomes poisonous!' },
    ],
    theme: 'moon',
  },
  heating: {
    title: '🔥 HABITAT THERMAL HEATING // WHERE IS IT USED?',
    points: [
      { label: 'What is this?', desc: 'Electric heat coils, thermal radiators, and warm air ducts inside the crew quarters.' },
      { label: 'Where is it used?', desc: "Keeps the inside of the Artemis Surface Habitat warm so the crew doesn't freeze." },
      { label: 'Why is 20% dangerous?', desc: 'Outside at Shackleton Crater it is -130°C (-200°F)! At only 20% heating, the habitat becomes an icebox and astronauts can freeze to death. Turning it to 80% saves their lives!' },
    ],
    theme: 'moon',
  },
  shielding: {
    title: '🛡️ STORM SHIELDING // WHERE IS IT USED?',
    points: [
      { label: 'What is this?', desc: 'A high-voltage electrostatic and magnetic barrier envelope around the Mars outpost.' },
      { label: 'Where is it used?', desc: 'Deflects fast-flying sharp Martian sand and rocks blowing at 100 km/h in the dust storm.' },
      { label: 'What happens if it drops?', desc: 'Flying sand grains will scour and crack our habitat domes, causing air decompression!' },
    ],
    theme: 'mars',
  },
  'mars-life': {
    title: '💨 MARS LIFE SUPPORT & AIR FILTERS // WHERE IS IT USED?',
    points: [
      { label: 'What is this?', desc: 'Airlock air seals, cabin oxygen regulators, and toxic dust scrubbers.' },
      { label: 'Where is it used?', desc: 'Filters out dangerous red Martian dust so astronauts can safely breathe inside.' },
      { label: 'Why is red dust dangerous?', desc: 'Martian dust contains toxic perchlorate chemicals. If it gets in your lungs, it causes severe poisoning!' },
    ],
    theme: 'mars',
  },
  'mars-power': {
    title: '⚡ BASE POWER ALLOCATION // WHERE IS IT USED?',
    points: [
      { label: 'What is this?', desc: 'Electricity routing from our nuclear generator (RTG) and backup fuel cells.' },
      { label: 'Where is it used?', desc: 'Directs electricity to our rovers, science lab computers, airlock heaters, and emergency radios.' },
      { label: 'Why pre-set it to 60%?', desc: "During a dust storm blackout, power must be balanced so essential survival systems don't blow a fuse!" },
    ],
    theme: 'mars',
  },
}

const moonAstronautQuotes = [
  "Shackleton base is cold (-130°C)! The sun won't rise for another 7 days. Watch our battery power!",
  "Every breath we take uses ECLSS oxygen. Heating saves our fingers, but pauses the scrubbers!",
  "The lunar regolith outside is sharp like crushed glass. I'm glad our surface habitat is sealed tight!",
  "Houston says hang tight. Our survival depends on balancing that power diverter switch!",
]

const marsAstronautQuotes = [
  "That red dust storm is shaking our habitat windows! Keep storm shielding above 80%!",
  "Radio signals to Earth take 20 minutes to cross space. We are completely on our own out here!",
  "Martian dust has toxic perchlorates. Thank goodness our ECLSS air scrubbers are working!",
  "Run that automated script when you're ready—our onboard computers will execute it smoothly.",
]

/* ==========================================================================
   COMPONENT PROPS
   ========================================================================== */
interface MissionSurvivalTerminalProps {
  initialLevel?: 4 | 5
  onBack?: () => void
}

export default function MissionSurvivalTerminal({
  initialLevel = 4,
  onBack,
}: MissionSurvivalTerminalProps) {
  // Navigation / Display state
  const [mode, setMode] = useState<'moon' | 'mars' | 'dual'>(initialLevel === 5 ? 'mars' : 'moon')
  const [scanlines, setScanlines] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Moon State
  const [powerDiverted, setPowerDiverted] = useState(false)
  const [showLunarExplainer, setShowLunarExplainer] = useState(true)
  const [moonSpeech, setMoonSpeech] = useState(
    'Shackleton base is in the lunar dark! Our battery is down to 35%. Toggle that Divert Switch above if you want to heat the habitat—or keep oxygen flowing!'
  )

  // Mars State
  const [marsShield, setMarsShield] = useState(90)
  const [marsLife, setMarsLife] = useState(75)
  const [marsPower, setMarsPower] = useState(60)
  const [latencySeconds, setLatencySeconds] = useState(20 * 60)
  const [showMarsLatencyIntel, setShowMarsLatencyIntel] = useState(false)
  const [marsSpeech, setMarsSpeech] = useState(
    "The Martian dust storm is howling outside! Earth can't steer us because of the 20-minute radio delay. Drag those 3 sliders to configure our defenses, then click RUN AUTOMATED SCRIPT!"
  )

  // Modals state
  const [activeTip, setActiveTip] = useState<TipContent | null>(null)
  const [terminalModal, setTerminalModal] = useState<{
    title: string
    text: string
    isMars: boolean
  } | null>(null)

  // Audio ref
  const audioRef = useRef<CockpitAudio | null>(null)

  // Canvas refs
  const moonCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const marsCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const animFrameRef = useRef<number | null>(null)

  // Initialize audio once
  useEffect(() => {
    const audio = new CockpitAudio()
    audioRef.current = audio

    const unlockAudio = () => {
      audio.startCRTHum()
      window.removeEventListener('click', unlockAudio)
      window.removeEventListener('keydown', unlockAudio)
    }
    window.addEventListener('click', unlockAudio)
    window.addEventListener('keydown', unlockAudio)

    return () => {
      window.removeEventListener('click', unlockAudio)
      window.removeEventListener('keydown', unlockAudio)
      audio.stopCRTHum()
    }
  }, [])

  // Mars latency countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setLatencySeconds((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTimer = (totalSeconds: number) => {
    const mins = String(Math.floor(totalSeconds / 60)).padStart(2, '0')
    const secs = String(totalSeconds % 60).padStart(2, '0')
    return `${mins}:${secs}`
  }

  // Astronaut speech helpers
  const speakMoon = useCallback((text: string) => {
    audioRef.current?.playRadioChirp()
    setMoonSpeech(text)
  }, [])

  const speakMars = useCallback((text: string) => {
    audioRef.current?.playRadioChirp()
    setMarsSpeech(text)
  }, [])

  // Divert switch toggle handler
  const handleDivertToggle = (checked: boolean) => {
    audioRef.current?.playHeavyButton()
    if (checked) {
      audioRef.current?.playSliderTick(85)
      setPowerDiverted(true)
      speakMoon(
        'Whew, heaters just kicked on! It feels so much warmer inside the base now. But watch out—oxygen recyclers are offline! We are breathing emergency reserve tank air!'
      )
    } else {
      audioRef.current?.playSliderTick(25)
      setPowerDiverted(false)
      speakMoon(
        'Deep breath... fresh oxygen is flowing through the vents again! But brrr, the habitat temperature is falling back to -130°C! My teeth are chattering!'
      )
    }
  }

  // Confirm Moon allocation
  const handleConfirmMoon = () => {
    audioRef.current?.playHeavyButton()
    audioRef.current?.playConfirmChime()
    const oxyText = powerDiverted ? '25%' : '82%'
    const thermText = powerDiverted ? '80%' : '20%'

    speakMoon(
      powerDiverted
        ? "Allocation confirmed! Emergency heat is locked in. Let's make sure our oxygen tanks last until dawn!"
        : 'Allocation confirmed! Oxygen scrubbers are humming. Hang in there through the -130°C cold!'
    )

    setTerminalModal({
      title: 'NASA ARTEMIS BASECAMP // POWER BUS ALLOCATION',
      text:
        `[TELEMETRY NODE: SHACKLETON CRATER SOUTH POLE]\n` +
        `--------------------------------------------------\n` +
        `POWER SUPPLY (BATTERY BUS):     35% [SOLAR GRIDS OFFLINE]\n` +
        `LIFE SUPPORT (OXYGEN ECLSS):    ${oxyText}\n` +
        `HABITAT THERMAL HEATING:        ${thermText}\n` +
        `POWER DIVERSION STATUS:         ${powerDiverted ? 'ACTIVE (CREW HEATED / OXYGEN PAUSED)' : 'NOMINAL (OXYGEN PRIORITIZED)'}\n` +
        `CREW MODULE STATUS:             SURFACE HABITAT AIRLOCK SEALED\n` +
        `LUNAR NIGHT SURVIVAL CYCLE:     DAY 7 OF 14\n` +
        `--------------------------------------------------\n` +
        `>> ALL MISSION PARAMETERS LOGGED TO MISSION CONTROL HOUSTON.`,
      isMars: false,
    })
  }

  // Reset Moon nominal
  const handleResetMoon = () => {
    audioRef.current?.playHeavyButton()
    setPowerDiverted(false)
    speakMoon('Resetting power grid to standard nominal allocation.')
  }

  // Run automated Mars script
  const handleRunMarsScript = () => {
    audioRef.current?.playHeavyButton()
    audioRef.current?.playScriptBurst()

    speakMars(
      `Executing automated script! Shielding: ${marsShield}%, ECLSS: ${marsLife}%, Power: ${marsPower}%. All systems locked in for the 20-minute blackout!`
    )

    setTerminalModal({
      title: 'AUTO-SURVIVAL SCRIPT INITIATED // MARS OUTPOST',
      text:
        `[CRITICAL ALERT: RED PLANET DUST STORM CAT-5]\n` +
        `--------------------------------------------------\n` +
        `EXECUTING PRE-CONFIGURED SCRIPT: /etc/outpost/emergency_failsafe.sh\n` +
        `COMMUNICATION DELAY TO EARTH: 20:00 MINS [DATA BLACKOUT]\n` +
        `--------------------------------------------------\n` +
        `> ENGAGING STORM SHIELDING:        ${marsShield}%\n` +
        `> LOCKING AIRLOCK & ECLSS MODULE:  ${marsLife}%\n` +
        `> ALLOCATING BASE POWER GRID:      ${marsPower}%\n` +
        `> MAV LAUNCHPAD STATUS:            SECURED / VENT VALVES CLOSED\n` +
        `> CARGO SUPPLY PODS:               PRESSURE SEALS REINFORCED\n` +
        `> ROBOTIC ROVER BEACON:            RETRACTING HIGH-GAIN MAST\n` +
        `--------------------------------------------------\n` +
        `>> STATUS: AUTONOMOUS SURVIVAL SCRIPT EXECUTED WITH ZERO LATENCY.\n` +
        `>> ALL OUTPOST SYSTEMS OPERATING ON PRE-PROGRAMMED EMERGENCY LOGIC.`,
      isMars: true,
    })
  }

  // Fullscreen toggle
  const toggleFullscreen = () => {
    audioRef.current?.playClick()
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
      setIsFullscreen(true)
    } else {
      document.exitFullscreen?.().catch(() => {})
      setIsFullscreen(false)
    }
  }

  // Audio mute toggle
  const toggleMute = () => {
    if (audioRef.current) {
      const muted = audioRef.current.toggleMute()
      setIsMuted(muted)
      if (!muted) audioRef.current.playClick()
    }
  }

  /* ==========================================================================
     CANVAS VIEWPORT RENDERER (Lunar Shackleton Crater & Martian Dust Storm)
     ========================================================================== */
  useEffect(() => {
    let animId: number
    let time = 0
    let marsLightning = 0

    interface Star {
      x: number
      y: number
      size: number
      alpha: number
      phase: number
    }

    interface Dust {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      alpha: number
      color: string
    }

    let stars: Star[] = []
    let dustParticles: Dust[] = []

    const initParticles = (moonW: number, moonH: number, marsW: number, marsH: number) => {
      stars = []
      for (let i = 0; i < 130; i++) {
        stars.push({
          x: Math.random() * (moonW || 800),
          y: Math.random() * ((moonH || 500) * 0.6),
          size: Math.random() * 1.8 + 0.5,
          alpha: Math.random() * 0.8 + 0.2,
          phase: Math.random() * Math.PI * 2,
        })
      }

      dustParticles = []
      for (let i = 0; i < 260; i++) {
        dustParticles.push({
          x: Math.random() * (marsW || 800),
          y: Math.random() * (marsH || 500),
          vx: Math.random() * 5.0 + 3.0,
          vy: (Math.random() - 0.42) * 1.8,
          size: Math.random() * 3.2 + 0.8,
          alpha: Math.random() * 0.7 + 0.25,
          color: Math.random() > 0.45 ? 'rgba(255, 110, 30, ' : 'rgba(220, 50, 20, ',
        })
      }
    }

    const resizeCanvases = () => {
      const dpr = window.devicePixelRatio || 1
      if (moonCanvasRef.current) {
        const rect = moonCanvasRef.current.getBoundingClientRect()
        const w = rect.width > 20 ? rect.width : 750
        const h = rect.height > 20 ? rect.height : 440
        moonCanvasRef.current.width = Math.max(100, Math.floor(w * dpr))
        moonCanvasRef.current.height = Math.max(100, Math.floor(h * dpr))
      }
      if (marsCanvasRef.current) {
        const rect = marsCanvasRef.current.getBoundingClientRect()
        const w = rect.width > 20 ? rect.width : 750
        const h = rect.height > 20 ? rect.height : 440
        marsCanvasRef.current.width = Math.max(100, Math.floor(w * dpr))
        marsCanvasRef.current.height = Math.max(100, Math.floor(h * dpr))
      }
      const mW = moonCanvasRef.current?.width || 800
      const mH = moonCanvasRef.current?.height || 500
      const rW = marsCanvasRef.current?.width || 800
      const rH = marsCanvasRef.current?.height || 500
      initParticles(mW, mH, rW, rH)
    }

    resizeCanvases()
    window.addEventListener('resize', resizeCanvases)

    // Render Moon Shackleton Basecamp
    const renderMoon = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      ctx.clearRect(0, 0, w, h)

      const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.7)
      skyGrad.addColorStop(0, '#010307')
      skyGrad.addColorStop(0.5, '#030812')
      skyGrad.addColorStop(1, '#081220')
      ctx.fillStyle = skyGrad
      ctx.fillRect(0, 0, w, h)

      // Stars
      stars.forEach((s) => {
        const flicker = Math.sin(time * 2.5 + s.phase) * 0.35 + 0.65
        ctx.fillStyle = `rgba(200, 240, 255, ${s.alpha * flicker})`
        ctx.fillRect(s.x, s.y, s.size, s.size)
      })

      // Earth in distance
      const earthX = w * 0.84
      const earthY = h * 0.17
      const earthR = Math.max(14, Math.min(w, h) * 0.065)
      const earthGrad = ctx.createRadialGradient(
        earthX - earthR * 0.3,
        earthY - earthR * 0.3,
        Math.max(1, earthR * 0.1),
        earthX,
        earthY,
        earthR
      )
      earthGrad.addColorStop(0, '#5fa8e8')
      earthGrad.addColorStop(0.4, '#1b64b8')
      earthGrad.addColorStop(0.85, '#0d2d63')
      earthGrad.addColorStop(1, '#05132d')
      ctx.fillStyle = earthGrad
      ctx.beginPath()
      ctx.arc(earthX, earthY, earthR, 0, Math.PI * 2)
      ctx.fill()

      ctx.strokeStyle = 'rgba(0, 216, 255, 0.45)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(earthX, earthY, earthR + 1.5, 0, Math.PI * 2)
      ctx.stroke()

      // Shackleton Crater Rim
      ctx.fillStyle = '#060e18'
      ctx.beginPath()
      ctx.moveTo(0, h * 0.52)
      ctx.lineTo(w * 0.15, h * 0.46)
      ctx.lineTo(w * 0.32, h * 0.5)
      ctx.lineTo(w * 0.48, h * 0.42)
      ctx.lineTo(w * 0.65, h * 0.48)
      ctx.lineTo(w * 0.85, h * 0.44)
      ctx.lineTo(w, h * 0.49)
      ctx.lineTo(w, h)
      ctx.lineTo(0, h)
      ctx.closePath()
      ctx.fill()

      ctx.strokeStyle = 'rgba(0, 216, 255, 0.2)'
      ctx.lineWidth = 1.2
      ctx.beginPath()
      ctx.moveTo(0, h * 0.52)
      ctx.lineTo(w * 0.15, h * 0.46)
      ctx.lineTo(w * 0.32, h * 0.5)
      ctx.lineTo(w * 0.48, h * 0.42)
      ctx.lineTo(w * 0.65, h * 0.48)
      ctx.lineTo(w * 0.85, h * 0.44)
      ctx.lineTo(w, h * 0.49)
      ctx.stroke()

      // Draw HLS (Human Landing System Starship)
      const hlsX = w * 0.82
      const hlsY = h * 0.44
      const hlsHeight = Math.max(16, Math.min(w, h) * 0.14)
      ctx.save()
      ctx.translate(hlsX, hlsY)
      const hlsW = hlsHeight * 0.22
      ctx.fillStyle = '#050a12'
      ctx.strokeStyle = 'rgba(0, 216, 255, 0.4)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(-hlsW * 0.5, 0)
      ctx.lineTo(-hlsW * 0.5, -hlsHeight * 0.75)
      ctx.lineTo(0, -hlsHeight)
      ctx.lineTo(hlsW * 0.5, -hlsHeight * 0.75)
      ctx.lineTo(hlsW * 0.5, 0)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      ctx.strokeStyle = '#0e1d2c'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(-hlsW * 0.4, -hlsHeight * 0.15)
      ctx.lineTo(-hlsW * 0.9, hlsHeight * 0.12)
      ctx.moveTo(hlsW * 0.4, -hlsHeight * 0.15)
      ctx.lineTo(hlsW * 0.9, hlsHeight * 0.12)
      ctx.stroke()

      if (Math.sin(time * 3) > 0.1) {
        ctx.fillStyle = '#ff3344'
        ctx.beginPath()
        ctx.arc(0, -hlsHeight - 2, 2.5, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()

      // Regolith foreground terrain
      const regolithGrad = ctx.createLinearGradient(0, h * 0.5, 0, h)
      regolithGrad.addColorStop(0, '#091522')
      regolithGrad.addColorStop(0.35, '#10202e')
      regolithGrad.addColorStop(1, '#08111a')
      ctx.fillStyle = regolithGrad
      ctx.beginPath()
      ctx.moveTo(0, h * 0.58)
      ctx.bezierCurveTo(w * 0.25, h * 0.55, w * 0.5, h * 0.62, w * 0.75, h * 0.57)
      ctx.bezierCurveTo(w * 0.88, h * 0.54, w * 0.95, h * 0.59, w, h * 0.56)
      ctx.lineTo(w, h)
      ctx.lineTo(0, h)
      ctx.closePath()
      ctx.fill()

      // Artemis Surface Habitat Dome
      const habX = w * 0.46
      const habY = h * 0.6
      const habR = Math.max(24, Math.min(w, h) * 0.24)
      ctx.save()
      const groundIllum = ctx.createRadialGradient(habX, habY, habR * 0.2, habX, habY, habR * 1.5)
      groundIllum.addColorStop(0, 'rgba(0, 216, 255, 0.22)')
      groundIllum.addColorStop(0.5, 'rgba(0, 160, 220, 0.08)')
      groundIllum.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = groundIllum
      ctx.beginPath()
      ctx.arc(habX, habY, habR * 1.5, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#102230'
      ctx.strokeStyle = 'rgba(0, 216, 255, 0.75)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(habX, habY, habR, Math.PI, 0, false)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      ctx.strokeStyle = 'rgba(0, 216, 255, 0.35)'
      ctx.lineWidth = 1
      for (let rad = habR * 0.3; rad < habR; rad += habR * 0.32) {
        ctx.beginPath()
        ctx.arc(habX, habY, rad, Math.PI, 0, false)
        ctx.stroke()
      }

      // Habitat side dome & airlock
      const secX = habX - habR * 0.85
      const secR = habR * 0.65
      ctx.fillStyle = '#0c1a26'
      ctx.strokeStyle = 'rgba(0, 216, 255, 0.6)'
      ctx.beginPath()
      ctx.arc(secX, habY, secR, Math.PI, 0, false)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      const alX = habX + habR * 0.65
      const alW = habR * 0.55
      const alH = habR * 0.42
      ctx.fillStyle = '#15293a'
      ctx.fillRect(alX, habY - alH, alW, alH)
      ctx.strokeStyle = 'rgba(0, 216, 255, 0.65)'
      ctx.strokeRect(alX, habY - alH, alW, alH)
      ctx.restore()

      // NASA LTV Rover
      const roverX = w * 0.22
      const roverY = h * 0.76
      const roverSize = Math.max(16, Math.min(w, h) * 0.15)
      ctx.save()
      ctx.translate(roverX, roverY)
      ctx.fillStyle = '#1c3447'
      ctx.fillRect(-roverSize * 0.5, -roverSize * 0.28, roverSize * 1.0, roverSize * 0.3)
      ctx.strokeStyle = '#00d8ff'
      ctx.lineWidth = 1.2
      ctx.strokeRect(-roverSize * 0.5, -roverSize * 0.28, roverSize * 1.0, roverSize * 0.3)

      ctx.fillStyle = '#080f16'
      ctx.strokeStyle = 'rgba(0, 216, 255, 0.65)'
      for (let wx = -roverSize * 0.42; wx <= roverSize * 0.45; wx += roverSize * 0.42) {
        ctx.beginPath()
        ctx.arc(wx, roverSize * 0.14, roverSize * 0.15, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
      }

      // Rover Headlight Beam
      const beamGrad = ctx.createRadialGradient(
        roverSize * 0.5,
        -roverSize * 0.15,
        2,
        roverSize * 2.0,
        roverSize * 0.25,
        roverSize * 1.8
      )
      beamGrad.addColorStop(0, 'rgba(0, 216, 255, 0.75)')
      beamGrad.addColorStop(0.3, 'rgba(0, 216, 255, 0.35)')
      beamGrad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = beamGrad
      ctx.beginPath()
      ctx.moveTo(roverSize * 0.5, -roverSize * 0.15)
      ctx.lineTo(roverSize * 2.4, roverSize * 0.35)
      ctx.lineTo(roverSize * 1.6, roverSize * 0.75)
      ctx.closePath()
      ctx.fill()
      ctx.restore()

      // Offline Solar Array
      const arrX = w * 0.68
      const arrY = h * 0.58
      const arrSize = Math.max(12, Math.min(w, h) * 0.12)
      ctx.save()
      ctx.translate(arrX, arrY)
      ctx.strokeStyle = '#334155'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(0, -arrSize * 0.7)
      ctx.stroke()

      ctx.fillStyle = '#06131f'
      ctx.strokeStyle = 'rgba(255, 140, 0, 0.6)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(-arrSize * 0.6, -arrSize * 0.4)
      ctx.lineTo(0, -arrSize * 0.7)
      ctx.lineTo(arrSize * 0.6, -arrSize * 0.4)
      ctx.lineTo(arrSize * 0.55, -arrSize * 0.2)
      ctx.lineTo(0, -arrSize * 0.55)
      ctx.lineTo(-arrSize * 0.55, -arrSize * 0.2)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      ctx.restore()
    }

    // Render Mars Dust Storm & Outpost
    const renderMars = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      ctx.clearRect(0, 0, w, h)

      // Dust sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h)
      skyGrad.addColorStop(0, '#1c0704')
      skyGrad.addColorStop(0.35, '#3d1208')
      skyGrad.addColorStop(0.7, '#6b200d')
      skyGrad.addColorStop(1, '#2f0b04')
      ctx.fillStyle = skyGrad
      ctx.fillRect(0, 0, w, h)

      // Churning Dust Vortex
      const stormX = w * 0.65
      const stormR0 = Math.max(6, w * 0.05)
      const stormR1 = Math.max(30, w * 0.42)
      const stormGrad = ctx.createRadialGradient(stormX, h * 0.4, stormR0, stormX, h * 0.44, stormR1)
      stormGrad.addColorStop(0, 'rgba(240, 80, 25, 0.75)')
      stormGrad.addColorStop(0.5, 'rgba(180, 50, 15, 0.5)')
      stormGrad.addColorStop(1, 'rgba(45, 10, 5, 0)')
      ctx.fillStyle = stormGrad
      ctx.beginPath()
      ctx.ellipse(stormX, h * 0.42, Math.max(12, w * 0.32), Math.max(20, h * 0.58), 0.18, 0, Math.PI * 2)
      ctx.fill()

      // Sand Dunes
      const duneGrad = ctx.createLinearGradient(0, h * 0.52, 0, h)
      duneGrad.addColorStop(0, '#4a170b')
      duneGrad.addColorStop(0.4, '#631f0d')
      duneGrad.addColorStop(1, '#240803')
      ctx.fillStyle = duneGrad
      ctx.beginPath()
      ctx.moveTo(0, h * 0.56)
      ctx.bezierCurveTo(w * 0.22, h * 0.51, w * 0.46, h * 0.63, w * 0.7, h * 0.55)
      ctx.bezierCurveTo(w * 0.86, h * 0.5, w * 0.94, h * 0.57, w, h * 0.53)
      ctx.lineTo(w, h)
      ctx.lineTo(0, h)
      ctx.closePath()
      ctx.fill()

      // MAV on Launch Pad
      const mavX = w * 0.78
      const mavY = h * 0.54
      const mavSize = Math.max(22, Math.min(w, h) * 0.28)
      ctx.save()
      ctx.translate(mavX, mavY)
      const mavW = mavSize * 0.24
      const mavH = mavSize * 0.9

      // Launch Gantry Tower Frame
      ctx.strokeStyle = 'rgba(255, 122, 0, 0.6)'
      ctx.lineWidth = 1.2
      ctx.beginPath()
      ctx.moveTo(mavW * 0.7, 0)
      ctx.lineTo(mavW * 0.7, -mavH * 0.95)
      ctx.lineTo(mavW * 1.1, 0)
      ctx.moveTo(mavW * 0.7, -mavH * 0.5)
      ctx.lineTo(mavW * 1.1, -mavH * 0.5)
      ctx.stroke()

      // MAV Rocket Body
      ctx.fillStyle = '#260c07'
      ctx.strokeStyle = '#ff3b30'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(-mavW * 0.5, 0)
      ctx.lineTo(-mavW * 0.5, -mavH * 0.7)
      ctx.lineTo(0, -mavH)
      ctx.lineTo(mavW * 0.5, -mavH * 0.7)
      ctx.lineTo(mavW * 0.5, 0)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      // Quad Struts
      ctx.strokeStyle = '#ff7a00'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(-mavW * 0.4, -mavH * 0.15)
      ctx.lineTo(-mavW * 0.95, mavH * 0.12)
      ctx.moveTo(mavW * 0.4, -mavH * 0.15)
      ctx.lineTo(mavW * 0.95, mavH * 0.12)
      ctx.stroke()

      if (Math.sin(time * 4) > 0.1) {
        ctx.fillStyle = '#ff2b00'
        ctx.beginPath()
        ctx.arc(0, -mavH - 2, 3, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()

      // Cargo Supply Pods
      const drawPods = (px: number, py: number, pSize: number) => {
        ctx.save()
        ctx.translate(px, py)
        ctx.fillStyle = '#38130a'
        ctx.strokeStyle = 'rgba(255, 122, 0, 0.7)'
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.ellipse(0, 0, pSize * 0.8, pSize * 0.35, -0.15, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()

        ctx.strokeStyle = '#ff7a00'
        ctx.beginPath()
        ctx.arc(-pSize * 0.3, 0, pSize * 0.28, Math.PI * 0.5, Math.PI * 1.5)
        ctx.arc(pSize * 0.2, 0, pSize * 0.28, Math.PI * 0.5, Math.PI * 1.5)
        ctx.stroke()

        ctx.fillStyle = '#521a0c'
        ctx.beginPath()
        ctx.moveTo(-pSize * 0.9, pSize * 0.1)
        ctx.quadraticCurveTo(0, pSize * 0.4, pSize * 0.9, pSize * 0.05)
        ctx.lineTo(pSize * 0.9, pSize * 0.4)
        ctx.lineTo(-pSize * 0.9, pSize * 0.4)
        ctx.closePath()
        ctx.fill()
        ctx.restore()
      }
      drawPods(w * 0.5, h * 0.64, Math.max(12, Math.min(w, h) * 0.11))
      drawPods(w * 0.58, h * 0.67, Math.max(10, Math.min(w, h) * 0.09))

      // Mars Robotic Rover
      const mRoverX = w * 0.26
      const mRoverY = h * 0.74
      const mRoverSize = Math.max(16, Math.min(w, h) * 0.17)
      ctx.save()
      ctx.translate(mRoverX, mRoverY)
      ctx.fillStyle = '#42160e'
      ctx.strokeStyle = '#ff7a00'
      ctx.lineWidth = 1.5
      ctx.fillRect(-mRoverSize * 0.48, -mRoverSize * 0.28, mRoverSize * 0.96, mRoverSize * 0.32)
      ctx.strokeRect(-mRoverSize * 0.48, -mRoverSize * 0.28, mRoverSize * 0.96, mRoverSize * 0.32)

      // Mast
      ctx.strokeStyle = '#ffaa00'
      ctx.lineWidth = 1.8
      ctx.beginPath()
      ctx.moveTo(-mRoverSize * 0.22, -mRoverSize * 0.28)
      ctx.lineTo(-mRoverSize * 0.22, -mRoverSize * 0.65)
      ctx.lineTo(-mRoverSize * 0.1, -mRoverSize * 0.65)
      ctx.stroke()

      ctx.fillStyle = '#ff3b30'
      ctx.fillRect(-mRoverSize * 0.12, -mRoverSize * 0.72, mRoverSize * 0.16, mRoverSize * 0.1)

      // Wheels
      ctx.fillStyle = '#140603'
      ctx.strokeStyle = '#ff5533'
      for (let wx = -mRoverSize * 0.38; wx <= mRoverSize * 0.42; wx += mRoverSize * 0.38) {
        ctx.beginPath()
        ctx.arc(wx, mRoverSize * 0.14, mRoverSize * 0.14, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
      }

      // Amber Headlight Beam
      const rBeamGrad = ctx.createRadialGradient(
        mRoverSize * 0.45,
        -mRoverSize * 0.12,
        2,
        mRoverSize * 2.2,
        mRoverSize * 0.28,
        mRoverSize * 2.0
      )
      rBeamGrad.addColorStop(0, 'rgba(255, 170, 0, 0.85)')
      rBeamGrad.addColorStop(0.35, 'rgba(255, 120, 0, 0.45)')
      rBeamGrad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = rBeamGrad
      ctx.beginPath()
      ctx.moveTo(mRoverSize * 0.48, -mRoverSize * 0.12)
      ctx.lineTo(mRoverSize * 2.5, mRoverSize * 0.38)
      ctx.lineTo(mRoverSize * 1.6, mRoverSize * 0.82)
      ctx.closePath()
      ctx.fill()
      ctx.restore()

      // Swirling Red Sand Particles
      dustParticles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy + Math.sin(time * 3 + p.x * 0.012) * 1.2
        if (p.x > w) p.x = -10
        if (p.y > h) p.y = 0
        if (p.y < 0) p.y = h

        ctx.fillStyle = p.color + p.alpha + ')'
        ctx.beginPath()
        ctx.arc(p.x, p.y, Math.max(1, p.size), 0, Math.PI * 2)
        ctx.fill()
      })

      // Electrostatic Lightning
      if (Math.random() < 0.015) {
        marsLightning = 0.28
      }
      if (marsLightning > 0) {
        ctx.fillStyle = `rgba(255, 130, 60, ${marsLightning})`
        ctx.fillRect(0, 0, w, h)
        marsLightning -= 0.04
      }

      // Haze
      const haze = ctx.createLinearGradient(0, 0, w, 0)
      haze.addColorStop(0, 'rgba(200, 60, 20, 0.18)')
      haze.addColorStop(0.5, 'rgba(255, 90, 25, 0.26)')
      haze.addColorStop(1, 'rgba(160, 40, 10, 0.2)')
      ctx.fillStyle = haze
      ctx.fillRect(0, 0, w, h)
    }

    const renderLoop = () => {
      time += 0.02
      if (moonCanvasRef.current && (mode === 'moon' || mode === 'dual')) {
        const ctx = moonCanvasRef.current.getContext('2d')
        if (ctx) renderMoon(ctx, moonCanvasRef.current.width, moonCanvasRef.current.height)
      }
      if (marsCanvasRef.current && (mode === 'mars' || mode === 'dual')) {
        const ctx = marsCanvasRef.current.getContext('2d')
        if (ctx) renderMars(ctx, marsCanvasRef.current.width, marsCanvasRef.current.height)
      }
      animId = requestAnimationFrame(renderLoop)
    }

    animId = requestAnimationFrame(renderLoop)
    animFrameRef.current = animId

    return () => {
      window.removeEventListener('resize', resizeCanvases)
      if (animId) cancelAnimationFrame(animId)
    }
  }, [mode])

  // Computed resource values for Moon
  const moonOxygenVal = powerDiverted ? 25 : 82
  const moonThermalVal = powerDiverted ? 80 : 20

  return (
    <div className="mission-survival-terminal">
      {/* Cockpit Master Top Navigation Bar */}
      <header className="cockpit-master-nav">
        <div className="brand-section">
          {onBack && (
            <button
              className="action-pill-btn"
              style={{
                background: 'rgba(0, 216, 255, 0.18)',
                borderColor: '#00d8ff',
                color: '#00d8ff',
                fontWeight: 700,
              }}
              onClick={() => {
                audioRef.current?.playClick()
                onBack()
              }}
            >
              ◀ BACK TO HUB
            </button>
          )}
          <span className="nasa-meatball-tag">NASA</span>
          <div className="brand-title">
            ARTEMIS <span>SURVIVAL TERMINAL</span> {'//'} OS-86
          </div>
        </div>

        {/* Level / View Switcher */}
        <div className="mode-selector-group">
          <button
            className={`mode-btn moon-mode ${mode === 'moon' ? 'active' : ''}`}
            onClick={() => {
              audioRef.current?.playClick()
              setMode('moon')
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="9" />
            </svg>
            LEVEL 4: MOON
          </button>
          <button
            className={`mode-btn mars-mode ${mode === 'mars' ? 'active' : ''}`}
            onClick={() => {
              audioRef.current?.playClick()
              setMode('mars')
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="9" />
            </svg>
            LEVEL 5: MARS
          </button>
          <button
            className={`mode-btn dual-mode ${mode === 'dual' ? 'active' : ''}`}
            onClick={() => {
              audioRef.current?.playClick()
              setMode('dual')
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 6h7v12H4zM13 6h7v12h-7z" />
            </svg>
            DUAL COCKPIT VIEW
          </button>
        </div>

        {/* Utility Actions */}
        <div className="nav-actions">
          <button className="action-pill-btn" onClick={toggleFullscreen}>
            {isFullscreen ? '✕ EXIT FULLSCREEN' : '⛶ FULLSCREEN'}
          </button>
          <button
            className={`action-pill-btn ${scanlines ? 'active' : ''}`}
            onClick={() => {
              audioRef.current?.playClick()
              setScanlines((prev) => !prev)
            }}
          >
            {scanlines ? 'CRT: ON' : 'CRT: OFF'}
          </button>
          <button className={`action-pill-btn ${isMuted ? 'muted' : ''}`} onClick={toggleMute}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
            {isMuted ? 'AUDIO: OFF' : 'AUDIO: ON'}
          </button>
        </div>
      </header>

      {/* Main Consoles Container */}
      <main
        className={`consoles-container ${
          mode === 'dual' ? 'view-dual' : mode === 'mars' ? 'view-mars' : 'view-moon'
        }`}
      >
        {/* ==========================================================================
            SCREEN 1: LEVEL 4 - MOON MISSION (NASA ARTEMIS LUNAR BASECAMP)
            ========================================================================== */}
        <section className="screen-moon-wrapper">
          <div className="industrial-bezel">
            <div className="bolt top-left" />
            <div className="bolt top-right" />
            <div className="bolt bottom-left" />
            <div className="bolt bottom-right" />

            {/* Cockpit Header Bar */}
            <div className="cockpit-header-bar">
              <div className="header-left-cluster">
                <h1 className="mission-headline">LEVEL 4: MOON MISSION</h1>
                <div className="mission-subline">NASA ARTEMIS LUNAR BASECAMP {'//'} SHACKLETON CRATER</div>
              </div>
              <div className="header-right-status-box">
                <div className="status-night-cycle">
                  NIGHT CYCLE: <span>DAY 7/14</span>
                </div>
                <div className="status-grid-alert">
                  POWER: <span>LOW (35%)</span>
                </div>
                <div className="status-stay-alive">STAY ALIVE!</div>
              </div>
            </div>

            {/* Desktop Layout: Viewport (Left) + 3-Resource Monitor (Right) */}
            <div className="artemis-cockpit-layout">
              {/* Left: Viewport */}
              <div className="artemis-viewport-pane">
                <div className="environmental-readout-banner">
                  <span className="pulse-dot" />
                  LOCATION: SHACKLETON CRATER | SURFACE TEMP: -130°C
                </div>

                <canvas ref={moonCanvasRef} className="viewport-canvas" />
                {scanlines && <div className="crt-overlay" />}

                {/* Lunar Night Tradeoff Explainer Overlay */}
                {showLunarExplainer && (
                  <div className="lunar-tradeoff-overlay">
                    <div className="explainer-header">
                      <span>🌙 LUNAR NIGHT TRADEOFF (EASY EXPLANATION)</span>
                      <button
                        className="explainer-close"
                        title="Close Overlay"
                        onClick={() => {
                          audioRef.current?.playClick()
                          setShowLunarExplainer(false)
                        }}
                      >
                        ×
                      </button>
                    </div>
                    <p className="explainer-text">
                      The Moon&apos;s night lasts <strong>14 whole Earth days</strong>, dropping temperatures to{' '}
                      <strong>-130°C (-200°F)</strong>! Because there is no sunlight, our solar panels are completely dead. We
                      only have <strong>35% backup battery power</strong> left. Heating the Artemis habitat saves the
                      astronauts from freezing, but pauses oxygen recycling! You must choose what to prioritize.
                    </p>
                  </div>
                )}
              </div>

              {/* Right: Core Resource Survival Monitor */}
              <aside className="artemis-resource-sidebar">
                <div className="sidebar-header-badge">
                  <span className="nasa-tag">NASA</span>
                  <span>CORE RESOURCE SURVIVAL MONITOR</span>
                </div>

                <div className="three-resource-grid">
                  {/* Meter 1: POWER SUPPLY */}
                  <div className="resource-card meter-power">
                    <div className="meter-top-row">
                      <span className="meter-name">POWER SUPPLY</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button
                          className="tip-btn"
                          onClick={() => {
                            audioRef.current?.playClick()
                            setActiveTip(educationalTips.power)
                          }}
                        >
                          ℹ️ WHAT IS THIS?
                        </button>
                        <span className="meter-pct">35%</span>
                      </div>
                    </div>
                    <div className="meter-track">
                      <div className="meter-bar-fill bar-amber" style={{ width: '35%' }} />
                    </div>
                    <div className="meter-sub-row">
                      <span className="sub-alert-badge">SOLAR GRIDS: OFFLINE</span>
                      <span className="sub-detail">BATTERY BUS</span>
                    </div>
                  </div>

                  {/* Meter 2: LIFE SUPPORT (OXYGEN) */}
                  <div className="resource-card meter-oxygen">
                    <div className="meter-top-row">
                      <span className="meter-name">LIFE SUPPORT (OXYGEN)</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button
                          className="tip-btn"
                          onClick={() => {
                            audioRef.current?.playClick()
                            setActiveTip(educationalTips.oxygen)
                          }}
                        >
                          ℹ️ WHAT IS THIS?
                        </button>
                        <span className="meter-pct">{moonOxygenVal}%</span>
                      </div>
                    </div>
                    <div className="meter-track">
                      <div
                        className={`meter-bar-fill ${powerDiverted ? 'bar-red' : 'bar-cyan'}`}
                        style={{ width: `${moonOxygenVal}%` }}
                      />
                    </div>
                    <div className="meter-sub-row">
                      <span className={`status-tag ${powerDiverted ? 'tag-critical' : 'tag-nominal'}`}>
                        {powerDiverted ? 'ECLSS PAUSED (CRITICAL)' : 'CABIN ECLSS ACTIVE'}
                      </span>
                      <span className="sub-detail">O₂ RECYCLER</span>
                    </div>
                  </div>

                  {/* Meter 3: HABITAT THERMAL HEATING */}
                  <div className="resource-card meter-thermal">
                    <div className="meter-top-row">
                      <span className="meter-name">HABITAT THERMAL HEATING</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button
                          className="tip-btn"
                          onClick={() => {
                            audioRef.current?.playClick()
                            setActiveTip(educationalTips.heating)
                          }}
                        >
                          ℹ️ WHAT IS THIS?
                        </button>
                        <span className="meter-pct">{moonThermalVal}%</span>
                      </div>
                    </div>
                    <div className="meter-track">
                      <div
                        className={`meter-bar-fill ${powerDiverted ? 'bar-green' : 'bar-red'}`}
                        style={{ width: `${moonThermalVal}%` }}
                      />
                    </div>
                    <div className="meter-sub-row">
                      <span className={`status-tag ${powerDiverted ? 'tag-nominal' : 'tag-critical'}`}>
                        {powerDiverted ? 'CREW HEATED (NOMINAL)' : 'CRITICAL COLD (-130°C)'}
                      </span>
                      <span className="sub-detail">CREW MODULE</span>
                    </div>
                  </div>
                </div>

                {/* Tactical Tradeoff Switch */}
                <div className="tradeoff-tactical-box">
                  <div className="tactical-box-header">
                    <span className="switch-title">DIVERT EMERGENCY BATTERY POWER</span>
                    <button
                      className="info-tooltip-btn"
                      onClick={() => {
                        audioRef.current?.playClick()
                        setShowLunarExplainer((prev) => !prev)
                      }}
                    >
                      ℹ️ INTEL
                    </button>
                  </div>

                  <div className="tactical-switch-control">
                    <label className="rocker-toggle-wrap">
                      <input
                        type="checkbox"
                        checked={powerDiverted}
                        onChange={(e) => handleDivertToggle(e.target.checked)}
                      />
                      <span className="rocker-toggle-slider">
                        <span className="toggle-opt opt-left">NOMINAL (OXY 82%)</span>
                        <span className="toggle-opt opt-right">DIVERTED (HEAT 80%)</span>
                      </span>
                    </label>
                  </div>

                  <div className={`divert-status-msg ${powerDiverted ? 'active' : ''}`}>
                    {powerDiverted
                      ? '⚠️ EMERGENCY DIVERT: THERMAL 80% // ECLSS DRAINED TO 25%!'
                      : 'PRIORITY: ECLSS OXYGEN NOMINAL // HABITAT COLD'}
                  </div>
                </div>
              </aside>
            </div>

            {/* Surviving Astronaut Live Radio Comms Card */}
            <div
              className="astronaut-comms-card"
              title="Click on the astronaut to hear from him!"
              onClick={() => {
                const quote = moonAstronautQuotes[Math.floor(Math.random() * moonAstronautQuotes.length)]
                speakMoon(quote)
              }}
            >
              <div className="astronaut-avatar-wrap">
                <Image src="/terminal/astronaut.webp" alt="Surviving Astronaut on Moon" width={64} height={64} className="astronaut-img" />
                <span className="astronaut-online-dot" />
              </div>
              <div className="comms-message-body">
                <div className="comms-header-row">
                  <span className="astronaut-name-tag">👨‍🚀 CDR. REID {'//'} EVA SURVIVOR (LUNAR SOUTH POLE)</span>
                  <span className="comms-badge-pulse">RADIO LINK ACTIVE</span>
                </div>
                <div className="astronaut-speech-bubble">&ldquo;{moonSpeech}&rdquo;</div>
              </div>
            </div>

            {/* Bottom Hardware Console Shelf */}
            <div className="console-bottom-shelf">
              <div className="vent-grill">
                <div className="vent-slot" />
                <div className="vent-slot" />
                <div className="vent-slot" />
                <div className="vent-slot" />
              </div>

              <div className="buttons-center-bank">
                <button className="cockpit-btn btn-confirm-cyan" onClick={handleConfirmMoon}>
                  CONFIRM ALLOCATION
                </button>
                <button className="cockpit-btn btn-adjust-secondary" onClick={handleResetMoon}>
                  RESET NOMINAL
                </button>
              </div>

              <div className="hardware-led-bank">
                <div className="hw-led green" />
                <div className="hw-led amber" />
              </div>
              <div className="vent-grill">
                <div className="vent-slot" />
                <div className="vent-slot" />
                <div className="vent-slot" />
                <div className="vent-slot" />
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================================================
            SCREEN 2: LEVEL 5 - MARS MISSION (MARS OUTPOST)
            ========================================================================== */}
        <section className="screen-mars-wrapper">
          <div className="industrial-bezel mars-bezel">
            <div className="bolt top-left" />
            <div className="bolt top-right" />
            <div className="bolt bottom-left" />
            <div className="bolt bottom-right" />

            <div className="cockpit-header-bar" style={{ borderColor: 'rgba(255, 122, 0, 0.4)' }}>
              <div className="header-left-cluster">
                <h1
                  className="mission-headline"
                  style={{
                    color: '#ff3b30',
                    textShadow: '0 0 10px #ff3b30, 0 0 20px rgba(255, 59, 48, 0.7)',
                  }}
                >
                  LEVEL 5: MARS MISSION
                </h1>
                <div className="mission-subline" style={{ color: '#ff7a00' }}>
                  MARS OUTPOST {'//'} ACIDALIA PLANITIA
                </div>
              </div>
              <div
                className="header-right-status-box"
                style={{ borderColor: '#ff7a00', background: 'rgba(26, 8, 5, 0.85)' }}
              >
                <div
                  className="status-stay-alive"
                  style={{ color: '#ff7a00', textShadow: '0 0 10px #ff7a00' }}
                >
                  DUST STORM ACTIVE!
                </div>
              </div>
            </div>

            <div className="artemis-cockpit-layout">
              {/* Left: Mars Viewport Pane */}
              <div className="mars-viewport-pane">
                <div
                  className="mars-blackout-overlay"
                  onClick={(e) => {
                    e.stopPropagation()
                    audioRef.current?.playClick()
                    setShowMarsLatencyIntel((prev) => !prev)
                  }}
                >
                  <div className="latency-giant-timer">
                    <span>COMMUNICATION DELAY {'//'}</span>
                    <span className="timer-digits-glow">{formatTimer(latencySeconds)}</span>
                    <span style={{ fontSize: 13, color: '#ff7744' }}>MINS</span>
                  </div>
                  <div className="emergency-status-signal">⚠️ DATA SIGNAL: UNAVAILABLE</div>
                </div>

                {/* Explainer Card for Latency Delay */}
                {showMarsLatencyIntel && (
                  <div className="mars-education-popup" style={{ display: 'block' }}>
                    <div className="mars-edu-title">🛰️ THE MARS COMMUNICATION DELAY (EASY EXPLANATION)</div>
                    <p>
                      Mars is millions of miles away from Earth. Radio signals take <strong>20 full minutes</strong> just
                      to travel across space! If something breaks during this violent dust storm, scientists on Earth cannot
                      help you in time. You must adjust your 3 survival sliders now and let your computer run the script
                      automatically!
                    </p>
                  </div>
                )}

                <canvas ref={marsCanvasRef} className="viewport-canvas" />
                {scanlines && <div className="crt-overlay" />}
              </div>

              {/* Right: Mars 3-Resource Scripting Sidebar */}
              <aside className="mars-resource-sidebar">
                <div className="mars-sidebar-header">
                  <span className="hazard-tag">PROTOCOL</span>
                  <span>AUTO-SURVIVAL SCRIPTING PROTOCOL</span>
                </div>

                <div className="scripting-sliders-stack">
                  {/* Slider 1: Storm Shielding */}
                  <div className="script-slider-card slider-cyan">
                    <div className="slider-label-row">
                      <span className="slider-title">STORM SHIELDING</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button
                          className="tip-btn"
                          style={{ borderColor: '#00d8ff', color: '#00d8ff' }}
                          onClick={() => {
                            audioRef.current?.playClick()
                            setActiveTip(educationalTips.shielding)
                          }}
                        >
                          ℹ️ INFO
                        </button>
                        <span className="slider-val-readout">{marsShield}%</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      className="mars-range"
                      min="0"
                      max="100"
                      value={marsShield}
                      style={{ ['--mars-val' as string]: `${marsShield}%` }}
                      onChange={(e) => {
                        const val = Number(e.target.value)
                        setMarsShield(val)
                        audioRef.current?.playSliderTick(val)
                        speakMars(
                          `Storm shielding adjusted to ${val}%. Keep it strong so that 100 km/h red sand doesn't crack our dome glass!`
                        )
                      }}
                    />
                  </div>

                  {/* Slider 2: Life Support / ECLSS */}
                  <div className="script-slider-card slider-orange">
                    <div className="slider-label-row">
                      <span className="slider-title">LIFE SUPPORT / ECLSS</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button
                          className="tip-btn"
                          style={{ borderColor: '#ff7a00', color: '#ff7a00' }}
                          onClick={() => {
                            audioRef.current?.playClick()
                            setActiveTip(educationalTips['mars-life'])
                          }}
                        >
                          ℹ️ INFO
                        </button>
                        <span className="slider-val-readout">{marsLife}%</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      className="mars-range"
                      min="0"
                      max="100"
                      value={marsLife}
                      style={{ ['--mars-val' as string]: `${marsLife}%` }}
                      onChange={(e) => {
                        const val = Number(e.target.value)
                        setMarsLife(val)
                        audioRef.current?.playSliderTick(val)
                        speakMars(`Life support air scrubbers set to ${val}%. Filtering out toxic red dust!`)
                      }}
                    />
                  </div>

                  {/* Slider 3: Base Power Allocation */}
                  <div className="script-slider-card slider-yellow">
                    <div className="slider-label-row">
                      <span className="slider-title">BASE POWER ALLOCATION</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button
                          className="tip-btn"
                          style={{ borderColor: '#ffcc00', color: '#ffcc00' }}
                          onClick={() => {
                            audioRef.current?.playClick()
                            setActiveTip(educationalTips['mars-power'])
                          }}
                        >
                          ℹ️ INFO
                        </button>
                        <span className="slider-val-readout">{marsPower}%</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      className="mars-range"
                      min="0"
                      max="100"
                      value={marsPower}
                      style={{ ['--mars-val' as string]: `${marsPower}%` }}
                      onChange={(e) => {
                        const val = Number(e.target.value)
                        setMarsPower(val)
                        audioRef.current?.playSliderTick(val)
                        speakMars(
                          `Base power grid set to ${val}%. Directing electricity to our science computers and rover bays!`
                        )
                      }}
                    />
                  </div>
                </div>

                <button className="btn-run-automated-script" onClick={handleRunMarsScript}>
                  RUN AUTOMATED SCRIPT
                </button>
              </aside>
            </div>

            {/* Mars Surviving Astronaut Radio Comms Card */}
            <div
              className="astronaut-comms-card"
              style={{ borderColor: '#ff7a00' }}
              title="Click on the astronaut to hear from him!"
              onClick={() => {
                const quote = marsAstronautQuotes[Math.floor(Math.random() * marsAstronautQuotes.length)]
                speakMars(quote)
              }}
            >
              <div
                className="astronaut-avatar-wrap"
                style={{ borderColor: '#ff7a00', boxShadow: '0 0 10px #ff7a00' }}
              >
                <Image src="/terminal/astronaut.webp" alt="Surviving Astronaut on Mars" width={64} height={64} className="astronaut-img" />
                <span
                  className="astronaut-online-dot"
                  style={{ background: '#ff7a00', boxShadow: '0 0 8px #ff7a00' }}
                />
              </div>
              <div className="comms-message-body">
                <div className="comms-header-row">
                  <span className="astronaut-name-tag" style={{ color: '#ff7a00' }}>
                    👨‍🚀 CDR. REID {'//'} MARS EXPEDITION COMMANDER
                  </span>
                  <span className="comms-badge-pulse" style={{ borderColor: '#ff3344', color: '#ff3344' }}>
                    RED STORM HAZARD
                  </span>
                </div>
                <div
                  className="astronaut-speech-bubble"
                  style={{ borderLeftColor: '#ff7a00' }}
                >
                  &ldquo;{marsSpeech}&rdquo;
                </div>
              </div>
            </div>

            <div className="console-bottom-shelf">
              <div className="hardware-led-bank">
                <div className="hw-led green" />
                <div className="hw-led red" />
              </div>
              <div className="vent-grill">
                <div className="vent-slot" />
                <div className="vent-slot" />
                <div className="vent-slot" />
                <div className="vent-slot" />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Educational Resource Tip Pop-Up Modal */}
      {activeTip && (
        <div
          className="tip-popup-overlay active"
          onClick={() => {
            audioRef.current?.playClick()
            setActiveTip(null)
          }}
        >
          <div
            className={`tip-card-box ${activeTip.theme === 'mars' ? 'mars-theme' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="tip-header">
              <span className="tip-title">{activeTip.title}</span>
              <button
                className="tip-close-btn"
                onClick={() => {
                  audioRef.current?.playClick()
                  setActiveTip(null)
                }}
              >
                ×
              </button>
            </div>
            <div className="tip-body">
              {activeTip.points.map((pt) => (
                <div className="tip-point" key={pt.label}>
                  <div className="point-label">{pt.label}</div>
                  <div className="point-desc">{pt.desc}</div>
                </div>
              ))}
            </div>
            <div className="tip-footer">
              <button
                className="cockpit-btn btn-adjust-secondary"
                onClick={() => {
                  audioRef.current?.playClick()
                  setActiveTip(null)
                }}
              >
                UNDERSTOOD
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terminal Execution Diagnostic Output Modal */}
      {terminalModal && (
        <div
          className="terminal-modal-overlay active"
          onClick={() => {
            audioRef.current?.playClick()
            setTerminalModal(null)
          }}
        >
          <div
            className={`terminal-dialog ${terminalModal.isMars ? 'theme-mars' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="terminal-header">
              <span>{terminalModal.title}</span>
              <span style={{ color: '#64748b', fontSize: 11 }}>[ESC / CLICK TO CLOSE]</span>
            </div>
            <div
              className="terminal-body"
              dangerouslySetInnerHTML={{ __html: terminalModal.text.replace(/\n/g, '<br/>') }}
            />
            <div className="terminal-footer">
              <button
                className="cockpit-btn btn-adjust-secondary"
                onClick={() => {
                  audioRef.current?.playClick()
                  setTerminalModal(null)
                }}
              >
                ACKNOWLEDGE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
