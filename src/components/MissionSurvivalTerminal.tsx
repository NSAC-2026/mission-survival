'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { cockpitAudio } from '@/utils/audio'
import { MissionViewportFX } from '@/lib/mission-viewport-canvas'

export interface MissionSurvivalTerminalProps {
  initialLevel?: 4 | 5
  onBack?: () => void
  onNext?: () => void
}

type TerminalMode = 'moon' | 'mars' | 'dual'

interface TipPoint {
  label: string
  desc: string
}

interface TipData {
  title: string
  points: TipPoint[]
  theme: 'moon' | 'mars'
}

const educationalTipsData: Record<string, TipData> = {
  power: {
    title: '🔋 POWER SUPPLY // WHERE IS IT USED?',
    points: [
      {
        label: 'What is this?',
        desc: 'This is the electrical power stored in our Moon basecamp backup lithium batteries.',
      },
      {
        label: 'Where is it used?',
        desc: 'It powers our habitat lights, life-support computers, air pumps, heaters, and water recyclers.',
      },
      {
        label: 'Why is it low (35%)?',
        desc: 'The Moon has a 14-day-long night! Without sunlight, our solar panels are completely dead. We only have 35% battery left to survive the remaining 7 days of night!',
      },
    ],
    theme: 'moon',
  },
  oxygen: {
    title: '🫁 LIFE SUPPORT (OXYGEN) // WHERE IS IT USED?',
    points: [
      {
        label: 'What is this?',
        desc: 'The ECLSS machine (Environmental Control & Life Support System).',
      },
      {
        label: 'Where is it used?',
        desc: 'It pulls out poisonous carbon dioxide (CO₂) exhaled by astronauts and pumps fresh, breathable oxygen into the habitat dome.',
      },
      {
        label: 'What happens if you divert it to 25%?',
        desc: 'The recycler pauses! Astronauts must breathe stored emergency oxygen tanks. If those run empty, the air inside the base becomes poisonous!',
      },
    ],
    theme: 'moon',
  },
  heating: {
    title: '🔥 HABITAT THERMAL HEATING // WHERE IS IT USED?',
    points: [
      {
        label: 'What is this?',
        desc: 'Electric heat coils, thermal radiators, and warm air ducts inside the crew quarters.',
      },
      {
        label: 'Where is it used?',
        desc: "Keeps the inside of the Artemis Surface Habitat warm so the crew doesn't freeze.",
      },
      {
        label: 'Why is 20% dangerous?',
        desc: 'Outside at Shackleton Crater it is -130°C (-200°F)! At only 20% heating, the habitat becomes an icebox and astronauts can freeze to death. Turning it to 80% saves their lives!',
      },
    ],
    theme: 'moon',
  },
  shielding: {
    title: '🛡️ STORM SHIELDING // WHERE IS IT USED?',
    points: [
      {
        label: 'What is this?',
        desc: 'A high-voltage electrostatic and magnetic barrier envelope around the Mars outpost.',
      },
      {
        label: 'Where is it used?',
        desc: 'Deflects fast-flying sharp Martian sand and rocks blowing at 100 km/h in the dust storm.',
      },
      {
        label: 'What happens if it drops?',
        desc: 'Flying sand grains will scour and crack our habitat domes, causing air decompression!',
      },
    ],
    theme: 'mars',
  },
  'mars-life': {
    title: '💨 MARS LIFE SUPPORT & AIR FILTERS // WHERE IS IT USED?',
    points: [
      {
        label: 'What is this?',
        desc: 'Airlock air seals, cabin oxygen regulators, and toxic dust scrubbers.',
      },
      {
        label: 'Where is it used?',
        desc: 'Filters out dangerous red Martian dust so astronauts can safely breathe inside.',
      },
      {
        label: 'Why is red dust dangerous?',
        desc: 'Martian dust contains toxic perchlorate chemicals. If it gets in your lungs, it causes severe poisoning!',
      },
    ],
    theme: 'mars',
  },
  'mars-power': {
    title: '⚡ BASE POWER ALLOCATION // WHERE IS IT USED?',
    points: [
      {
        label: 'What is this?',
        desc: 'Electricity routing from our nuclear generator (RTG) and backup fuel cells.',
      },
      {
        label: 'Where is it used?',
        desc: 'Directs electricity to our rovers, science lab computers, airlock heaters, and emergency radios.',
      },
      {
        label: 'Why pre-set it to 60%?',
        desc: "During a dust storm blackout, power must be balanced so essential survival systems don't blow a fuse!",
      },
    ],
    theme: 'mars',
  },
}

const moonAstronautQuotes = [
  "Shackleton base is cold (-130°C)! The sun won't rise for another 7 days. Watch our battery power!",
  'Every breath we take uses ECLSS oxygen. Heating saves our fingers, but pauses the scrubbers!',
  "The lunar regolith outside is sharp like crushed glass. I'm glad our surface habitat is sealed tight!",
  'Houston says hang tight. Our survival depends on balancing that power diverter switch!',
]

const marsAstronautQuotes = [
  'That red dust storm is shaking our habitat windows! Keep storm shielding above 80%!',
  'Radio signals to Earth take 20 minutes to cross space. We are completely on our own out here!',
  'Martian dust has toxic perchlorates. Thank goodness our ECLSS air scrubbers are working!',
  "Run that automated script when you're ready—our onboard computers will execute it smoothly.",
]

export default function MissionSurvivalTerminal({
  initialLevel = 4,
  onBack,
  onNext,
}: MissionSurvivalTerminalProps) {
  // Navigation & View Mode
  const [mode, setMode] = useState<TerminalMode>(
    initialLevel === 5 ? 'mars' : 'moon'
  )
  const [crtActive, setCrtActive] = useState<boolean>(true)
  const [isMuted, setIsMuted] = useState<boolean>(cockpitAudio.isMuted)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)

  // Moon state
  const [powerDiverted, setPowerDiverted] = useState<boolean>(false)
  const [showLunarExplainer, setShowLunarExplainer] = useState<boolean>(true)
  const [moonSpeech, setMoonSpeech] = useState<string>(
    "Shackleton base is cold (-130°C)! The sun won't rise for another 7 days. Watch our battery power!"
  )
  const [moonSpeechOpacity, setMoonSpeechOpacity] = useState<number>(1)
  const [moonConfirmed, setMoonConfirmed] = useState<boolean>(false)

  // Mars state
  const [marsShield, setMarsShield] = useState<number>(90)
  const [marsLife, setMarsLife] = useState<number>(75)
  const [marsPower, setMarsPower] = useState<number>(60)
  const [latencySeconds, setLatencySeconds] = useState<number>(20 * 60)
  const [showMarsEduPopup, setShowMarsEduPopup] = useState<boolean>(false)
  const [marsSpeech, setMarsSpeech] = useState<string>(
    "The Martian dust storm is howling outside! Earth can't steer us because of the 20-minute radio delay. Drag those 3 sliders to configure our defenses, then click RUN AUTOMATED SCRIPT!"
  )
  const [marsSpeechOpacity, setMarsSpeechOpacity] = useState<number>(1)
  const [scriptExecuted, setScriptExecuted] = useState<boolean>(false)

  // Modals
  const [activeTipKey, setActiveTipKey] = useState<string | null>(null)
  const [terminalModalData, setTerminalModalData] = useState<{
    isOpen: boolean
    title: string
    body: string
    isMars: boolean
  }>({
    isOpen: false,
    title: '',
    body: '',
    isMars: false,
  })

  // Canvas Refs
  const moonCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const marsCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const viewportFXRef = useRef<MissionViewportFX | null>(null)

  // Fullscreen listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
      if (viewportFXRef.current) {
        setTimeout(() => viewportFXRef.current?.resize(), 100)
      }
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Audio initialization on first interaction
  useEffect(() => {
    const handleInteraction = () => {
      cockpitAudio.startCRTHum()
      window.removeEventListener('click', handleInteraction)
      window.removeEventListener('keydown', handleInteraction)
    }
    window.addEventListener('click', handleInteraction)
    window.addEventListener('keydown', handleInteraction)
    return () => {
      window.removeEventListener('click', handleInteraction)
      window.removeEventListener('keydown', handleInteraction)
    }
  }, [])

  // Canvas FX Engine Lifecycle
  useEffect(() => {
    const fx = new MissionViewportFX(
      moonCanvasRef.current,
      marsCanvasRef.current
    )
    viewportFXRef.current = fx

    return () => {
      fx.destroy()
      viewportFXRef.current = null
    }
  }, [])

  // Update canvas references when mode changes
  useEffect(() => {
    if (viewportFXRef.current) {
      viewportFXRef.current.updateCanvases(
        moonCanvasRef.current,
        marsCanvasRef.current
      )
      setTimeout(() => viewportFXRef.current?.resize(), 60)
    }
  }, [mode])

  // Latency countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setLatencySeconds((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formattedLatency = useMemo(() => {
    const mins = String(Math.floor(latencySeconds / 60)).padStart(2, '0')
    const secs = String(latencySeconds % 60).padStart(2, '0')
    return `${mins}:${secs}`
  }, [latencySeconds])

  // Astronaut speech triggers with Quindar radio chirp
  const speakMoon = (text: string) => {
    cockpitAudio.playRadioChirp()
    setMoonSpeechOpacity(0.3)
    setTimeout(() => {
      setMoonSpeech(text)
      setMoonSpeechOpacity(1)
    }, 120)
  }

  const speakMars = (text: string) => {
    cockpitAudio.playRadioChirp()
    setMarsSpeechOpacity(0.3)
    setTimeout(() => {
      setMarsSpeech(text)
      setMarsSpeechOpacity(1)
    }, 120)
  }

  // Astronaut card clicks
  const handleMoonAstronautClick = () => {
    const quote =
      moonAstronautQuotes[Math.floor(Math.random() * moonAstronautQuotes.length)]
    speakMoon(quote)
  }

  const handleMarsAstronautClick = () => {
    const quote =
      marsAstronautQuotes[Math.floor(Math.random() * marsAstronautQuotes.length)]
    speakMars(quote)
  }

  // Moon Power Diverter toggle handler
  const handleTogglePowerDivert = (checked: boolean) => {
    cockpitAudio.playHeavyButton()
    cockpitAudio.playSliderTick(checked ? 85 : 25)
    setPowerDiverted(checked)

    if (checked) {
      speakMoon(
        'Whew, heaters just kicked on! It feels so much warmer inside the base now. But watch out—oxygen recyclers are offline! We are breathing emergency reserve tank air!'
      )
    } else {
      speakMoon(
        'Deep breath... fresh oxygen is flowing through the vents again! But brrr, the habitat temperature is falling back to -130°C! My teeth are chattering!'
      )
    }
  }

  // Moon Confirm Allocation
  const handleConfirmMoon = () => {
    cockpitAudio.playHeavyButton()
    cockpitAudio.playConfirmChime()
    setMoonConfirmed(true)

    speakMoon(
      powerDiverted
        ? "Allocation confirmed! Emergency heat is locked in. Let's make sure our oxygen tanks last until dawn!"
        : "Allocation confirmed! Oxygen scrubbers are humming. Hang in there through the -130°C cold!"
    )

    const oxygenVal = powerDiverted ? '25%' : '82%'
    const thermalVal = powerDiverted ? '80%' : '20%'

    setTerminalModalData({
      isOpen: true,
      title: 'NASA ARTEMIS BASECAMP // POWER BUS ALLOCATION',
      isMars: false,
      body:
        `[TELEMETRY NODE: SHACKLETON CRATER SOUTH POLE]\n` +
        `--------------------------------------------------\n` +
        `POWER SUPPLY (BATTERY BUS):     35% [SOLAR GRIDS OFFLINE]\n` +
        `LIFE SUPPORT (OXYGEN ECLSS):    ${oxygenVal}\n` +
        `HABITAT THERMAL HEATING:        ${thermalVal}\n` +
        `POWER DIVERSION STATUS:         ${
          powerDiverted
            ? 'ACTIVE (CREW HEATED / OXYGEN PAUSED)'
            : 'NOMINAL (OXYGEN PRIORITIZED)'
        }\n` +
        `CREW MODULE STATUS:             SURFACE HABITAT AIRLOCK SEALED\n` +
        `LUNAR NIGHT SURVIVAL CYCLE:     DAY 7 OF 14\n` +
        `--------------------------------------------------\n` +
        `>> ALL MISSION PARAMETERS LOGGED TO MISSION CONTROL HOUSTON.`,
    })
  }

  // Moon Reset Nominal
  const handleResetMoon = () => {
    cockpitAudio.playHeavyButton()
    setPowerDiverted(false)
    speakMoon(
      'Deep breath... fresh oxygen is flowing through the vents again! But brrr, the habitat temperature is falling back to -130°C! My teeth are chattering!'
    )
  }

  // Mars Run Automated Script
  const handleRunMarsScript = () => {
    cockpitAudio.playHeavyButton()
    cockpitAudio.playScriptBurst()
    setScriptExecuted(true)

    speakMars(
      `Executing automated script! Shielding: ${marsShield}%, ECLSS: ${marsLife}%, Power: ${marsPower}%. All systems locked in for the 20-minute blackout!`
    )

    setTerminalModalData({
      isOpen: true,
      title: 'AUTO-SURVIVAL SCRIPT INITIATED // MARS OUTPOST',
      isMars: true,
      body:
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
    })
  }

  // Fullscreen toggle
  const toggleFullscreen = () => {
    cockpitAudio.playClick()
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
    } else if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {})
    }
  }

  // Audio mute toggle
  const toggleAudio = () => {
    const muted = cockpitAudio.toggleMute()
    setIsMuted(muted)
    if (!muted) cockpitAudio.playClick()
  }

  // Top Nav mode switcher
  const handleModeSwitch = (newMode: TerminalMode) => {
    cockpitAudio.playClick()
    setMode(newMode)
  }

  const activeTip = activeTipKey ? educationalTipsData[activeTipKey] : null

  return (
    <div className="terminal-screen-root">
      {/* Cockpit Master Top Navigation Bar */}
      <header className="cockpit-master-nav">
        <div className="brand-section">
          {onBack && (
            <button
              onClick={() => {
                cockpitAudio.playClick()
                onBack()
              }}
              className="action-pill-btn"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                borderColor: '#334760',
                color: '#94a3b8',
                cursor: 'pointer',
              }}
              title="Return to Headquarters"
            >
              ← RETURN
            </button>
          )}
          <span className="nasa-meatball-tag">NASA</span>
          <div className="brand-title">
            ARTEMIS <span>SURVIVAL TERMINAL</span> // OS-86
          </div>
        </div>

        {/* Level / View Switcher */}
        <div className="mode-selector-group">
          <button
            className={`mode-btn moon-mode ${mode === 'moon' ? 'active' : ''}`}
            onClick={() => handleModeSwitch('moon')}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="9" />
            </svg>
            LEVEL 4: MOON
          </button>
          <button
            className={`mode-btn mars-mode ${mode === 'mars' ? 'active' : ''}`}
            onClick={() => handleModeSwitch('mars')}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="9" />
            </svg>
            LEVEL 5: MARS
          </button>
          <button
            className={`mode-btn dual-mode ${mode === 'dual' ? 'active' : ''}`}
            onClick={() => handleModeSwitch('dual')}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 6h7v12H4zM13 6h7v12h-7z" />
            </svg>
            DUAL COCKPIT VIEW
          </button>
        </div>

        {/* Utility Actions */}
        <div className="nav-actions" style={{ display: 'flex', gap: '8px' }}>
          <button
            className="action-pill-btn"
            onClick={toggleFullscreen}
            title="Toggle Browser Fullscreen Mode"
          >
            {isFullscreen ? '✕ EXIT FULLSCREEN' : '⛶ FULLSCREEN'}
          </button>
          <button
            className={`action-pill-btn ${crtActive ? 'active' : ''}`}
            onClick={() => {
              cockpitAudio.playClick()
              setCrtActive((prev) => !prev)
            }}
          >
            CRT: {crtActive ? 'ON' : 'OFF'}
          </button>
          <button
            className={`action-pill-btn ${isMuted ? 'muted' : ''}`}
            onClick={toggleAudio}
          >
            {isMuted ? (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ display: 'inline', marginRight: 4 }}
                >
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
                AUDIO: OFF
              </>
            ) : (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ display: 'inline', marginRight: 4 }}
                >
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
                AUDIO: ON
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Consoles Container */}
      <main className={`consoles-container view-${mode}`} id="consoles-container">
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
                <div className="mission-subline">
                  NASA ARTEMIS LUNAR BASECAMP // SHACKLETON CRATER
                </div>
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

            {/* Desktop Grid Layout: Viewport (Left) + 3-Resource Monitor (Right) */}
            <div className="artemis-cockpit-layout">
              {/* Left: Artemis Shackleton Crater Viewport Window */}
              <div className="artemis-viewport-pane">
                <div className="environmental-readout-banner">
                  <span className="pulse-dot" />
                  LOCATION: SHACKLETON CRATER | SURFACE TEMP: -130°C
                </div>

                {/* Canvas Viewport */}
                <canvas
                  ref={moonCanvasRef}
                  id="moon-viewport-canvas"
                  className="viewport-canvas"
                />
                {crtActive && <div className="crt-overlay" />}

                {/* Translucent Lunar Night Tradeoff Explainer Overlay */}
                {showLunarExplainer && (
                  <div className="lunar-tradeoff-overlay" id="lunar-explainer-overlay">
                    <div className="explainer-header">
                      <span>🌙 LUNAR NIGHT TRADEOFF (EASY EXPLANATION)</span>
                      <button
                        className="explainer-close"
                        onClick={() => {
                          cockpitAudio.playClick()
                          setShowLunarExplainer(false)
                        }}
                        title="Close Overlay"
                      >
                        ×
                      </button>
                    </div>
                    <p className="explainer-text">
                      The Moon&apos;s night lasts <strong>14 whole Earth days</strong>, dropping temperatures to <strong>-130°C (-200°F)</strong>! Because there is no sunlight, our solar panels are completely dead. We only have <strong>35% backup battery power</strong> left. Heating the Artemis habitat saves the astronauts from freezing, but pauses oxygen recycling! You must choose what to prioritize.
                    </p>
                  </div>
                )}
              </div>

              {/* Right: Streamlined 3-Resource Core Monitor Sidebar Container */}
              <aside className="artemis-resource-sidebar">
                <div className="sidebar-header-badge">
                  <span className="nasa-tag">NASA</span>
                  <span>CORE RESOURCE SURVIVAL MONITOR</span>
                </div>

                {/* The 3 Survival Meters Grid */}
                <div className="three-resource-grid">
                  {/* Meter 1: POWER SUPPLY */}
                  <div className="resource-card meter-power">
                    <div className="meter-top-row">
                      <span className="meter-name">POWER SUPPLY</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button
                          className="tip-btn"
                          onClick={() => {
                            cockpitAudio.playClick()
                            setActiveTipKey('power')
                          }}
                        >
                          ℹ️ WHAT IS THIS?
                        </button>
                        <span className="meter-pct" id="res-power-val">
                          35%
                        </span>
                      </div>
                    </div>
                    <div className="meter-track">
                      <div
                        className="meter-bar-fill bar-amber"
                        style={{ width: '35%' }}
                      />
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
                            cockpitAudio.playClick()
                            setActiveTipKey('oxygen')
                          }}
                        >
                          ℹ️ WHAT IS THIS?
                        </button>
                        <span className="meter-pct" id="res-oxygen-val">
                          {powerDiverted ? '25%' : '82%'}
                        </span>
                      </div>
                    </div>
                    <div className="meter-track">
                      <div
                        className="meter-bar-fill bar-cyan"
                        style={{ width: powerDiverted ? '25%' : '82%' }}
                      />
                    </div>
                    <div className="meter-sub-row">
                      <span
                        className={`status-tag ${
                          powerDiverted ? 'tag-critical' : 'tag-nominal'
                        }`}
                      >
                        {powerDiverted
                          ? 'ECLSS PAUSED (CRITICAL)'
                          : 'CABIN ECLSS ACTIVE'}
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
                            cockpitAudio.playClick()
                            setActiveTipKey('heating')
                          }}
                        >
                          ℹ️ WHAT IS THIS?
                        </button>
                        <span className="meter-pct" id="res-thermal-val">
                          {powerDiverted ? '80%' : '20%'}
                        </span>
                      </div>
                    </div>
                    <div className="meter-track">
                      <div
                        className={`meter-bar-fill ${
                          powerDiverted ? 'bar-green' : 'bar-red'
                        }`}
                        style={{ width: powerDiverted ? '80%' : '20%' }}
                      />
                    </div>
                    <div className="meter-sub-row">
                      <span
                        className={`status-tag ${
                          powerDiverted ? 'tag-nominal' : 'tag-critical'
                        }`}
                      >
                        {powerDiverted
                          ? 'CREW HEATED (NOMINAL)'
                          : 'CRITICAL COLD (-130°C)'}
                      </span>
                      <span className="sub-detail">CREW MODULE</span>
                    </div>
                  </div>
                </div>

                {/* Tactical Tradeoff Switch Section */}
                <div className="tradeoff-tactical-box">
                  <div className="tactical-box-header">
                    <span className="switch-title">
                      DIVERT EMERGENCY BATTERY POWER
                    </span>
                    <button
                      className="info-tooltip-btn"
                      onClick={() => {
                        cockpitAudio.playClick()
                        setShowLunarExplainer((prev) => !prev)
                      }}
                      title="Click to view Lunar Night Tradeoff Intel"
                    >
                      ℹ️ INTEL
                    </button>
                  </div>

                  <div className="tactical-switch-control">
                    <label className="rocker-toggle-wrap">
                      <input
                        type="checkbox"
                        checked={powerDiverted}
                        onChange={(e) => handleTogglePowerDivert(e.target.checked)}
                      />
                      <span className="rocker-toggle-slider">
                        <span className="toggle-opt opt-left">
                          NOMINAL (OXY 82%)
                        </span>
                        <span className="toggle-opt opt-right">
                          DIVERTED (HEAT 80%)
                        </span>
                      </span>
                    </label>
                  </div>

                  <div
                    className={`divert-status-msg ${powerDiverted ? 'active' : ''}`}
                  >
                    {powerDiverted
                      ? '⚠️ EMERGENCY DIVERT: THERMAL 80% // ECLSS DRAINED TO 25%!'
                      : 'PRIORITY: ECLSS OXYGEN NOMINAL // HABITAT COLD'}
                  </div>
                </div>
              </aside>
            </div>

            {/* Surviving Astronaut Radio Comms Card */}
            <div
              className="astronaut-comms-card"
              onClick={handleMoonAstronautClick}
              title="Click on the astronaut to hear from him!"
            >
              <div className="astronaut-avatar-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/astronaut.webp"
                  alt="Surviving Astronaut on Moon"
                  className="astronaut-img"
                  onError={(e) => {
                    const img = e.currentTarget
                    if (!img.src.includes('/terminal/')) {
                      img.src = '/terminal/astronaut.webp'
                    }
                  }}
                />
                <span className="astronaut-online-dot" />
              </div>
              <div className="comms-message-body">
                <div className="comms-header-row">
                  <span className="astronaut-name-tag">
                    👨‍🚀 CDR. REID // ARTEMIS EXPEDITION COMMANDER
                  </span>
                  <span className="comms-badge-pulse">SURVIVAL COMMS LINK</span>
                </div>
                <div
                  className="astronaut-speech-bubble"
                  style={{ opacity: moonSpeechOpacity }}
                >
                  &ldquo;{moonSpeech}&rdquo;
                </div>
              </div>
            </div>

            {/* Bottom Hardware Console Shelf & Push Buttons */}
            <div className="console-bottom-shelf">
              <div className="vent-grill">
                <div className="vent-slot" />
                <div className="vent-slot" />
                <div className="vent-slot" />
                <div className="vent-slot" />
              </div>

              <div className="buttons-center-bank">
                <button
                  className="cockpit-btn btn-confirm-cyan"
                  onClick={handleConfirmMoon}
                >
                  CONFIRM ALLOCATION
                </button>
                <button
                  className="cockpit-btn btn-adjust-secondary"
                  onClick={handleResetMoon}
                >
                  RESET NOMINAL
                </button>
                {moonConfirmed && onNext && (
                  <button
                    className="cockpit-btn"
                    style={{
                      background: 'linear-gradient(180deg, #ff7a00 0%, #cf552d 100%)',
                      borderColor: '#ffaa00',
                      color: '#ffffff',
                      boxShadow: '0 0 16px rgba(255, 122, 0, 0.7)',
                    }}
                    onClick={() => {
                      cockpitAudio.playClick()
                      onNext()
                    }}
                  >
                    PROCEED TO LEVEL 5: MARS →
                  </button>
                )}
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

            <div
              className="cockpit-header-bar"
              style={{ borderColor: 'rgba(255, 122, 0, 0.4)' }}
            >
              <div className="header-left-cluster">
                <h1
                  className="mission-headline"
                  style={{
                    color: '#ff3b30',
                    textShadow:
                      '0 0 10px #ff3b30, 0 0 20px rgba(255, 59, 48, 0.7)',
                  }}
                >
                  LEVEL 5: MARS MISSION
                </h1>
                <div className="mission-subline" style={{ color: '#ff7a00' }}>
                  MARS OUTPOST // ACIDALIA PLANITIA
                </div>
              </div>
              <div
                className="header-right-status-box"
                style={{
                  borderColor: '#ff7a00',
                  background: 'rgba(26, 8, 5, 0.85)',
                }}
              >
                <div
                  className="status-stay-alive"
                  style={{
                    color: '#ff7a00',
                    textShadow: '0 0 10px #ff7a00',
                  }}
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
                    cockpitAudio.playClick()
                    setShowMarsEduPopup((prev) => !prev)
                  }}
                  title="Click to view Mars Communication Delay Intel"
                >
                  <div className="latency-giant-timer">
                    <span>COMMUNICATION DELAY //</span>
                    <span className="timer-digits-glow">{formattedLatency}</span>
                    <span style={{ fontSize: 13, color: '#ff7744' }}>MINS</span>
                  </div>
                  <div className="emergency-status-signal">
                    ⚠️ DATA SIGNAL: UNAVAILABLE
                  </div>
                </div>

                {/* Explainer Card for Latency Delay */}
                {showMarsEduPopup && (
                  <div
                    className="mars-education-popup"
                    style={{ display: 'block' }}
                  >
                    <div className="mars-edu-title">
                      📡 THE MARS COMMUNICATION DELAY (EASY EXPLANATION)
                    </div>
                    <p>
                      Mars is millions of miles away from Earth. Radio signals take <strong>20 full minutes</strong> just to travel across space! If something breaks during this violent dust storm, scientists on Earth cannot help you in time. You must adjust your 3 survival sliders now and let your computer run the script automatically!
                    </p>
                  </div>
                )}

                <canvas
                  ref={marsCanvasRef}
                  id="mars-viewport-canvas"
                  className="viewport-canvas"
                />
                {crtActive && <div className="crt-overlay" />}
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
                            cockpitAudio.playClick()
                            setActiveTipKey('shielding')
                          }}
                        >
                          ℹ️ INFO
                        </button>
                        <span className="slider-val-readout">
                          {marsShield}%
                        </span>
                      </div>
                    </div>
                    <input
                      type="range"
                      className="mars-range"
                      min={0}
                      max={100}
                      value={marsShield}
                      style={
                        {
                          '--mars-val': `${marsShield}%`,
                        } as React.CSSProperties
                      }
                      onChange={(e) => {
                        const val = Number(e.target.value)
                        setMarsShield(val)
                        cockpitAudio.playSliderTick(val)
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
                            cockpitAudio.playClick()
                            setActiveTipKey('mars-life')
                          }}
                        >
                          ℹ️ INFO
                        </button>
                        <span className="slider-val-readout">
                          {marsLife}%
                        </span>
                      </div>
                    </div>
                    <input
                      type="range"
                      className="mars-range"
                      min={0}
                      max={100}
                      value={marsLife}
                      style={
                        {
                          '--mars-val': `${marsLife}%`,
                        } as React.CSSProperties
                      }
                      onChange={(e) => {
                        const val = Number(e.target.value)
                        setMarsLife(val)
                        cockpitAudio.playSliderTick(val)
                        speakMars(
                          `Life support air scrubbers set to ${val}%. Filtering out toxic red dust!`
                        )
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
                            cockpitAudio.playClick()
                            setActiveTipKey('mars-power')
                          }}
                        >
                          ℹ️ INFO
                        </button>
                        <span className="slider-val-readout">
                          {marsPower}%
                        </span>
                      </div>
                    </div>
                    <input
                      type="range"
                      className="mars-range"
                      min={0}
                      max={100}
                      value={marsPower}
                      style={
                        {
                          '--mars-val': `${marsPower}%`,
                        } as React.CSSProperties
                      }
                      onChange={(e) => {
                        const val = Number(e.target.value)
                        setMarsPower(val)
                        cockpitAudio.playSliderTick(val)
                        speakMars(
                          `Base power grid set to ${val}%. Directing electricity to our science computers and rover bays!`
                        )
                      }}
                    />
                  </div>
                </div>

                <button
                  className="btn-run-automated-script"
                  onClick={handleRunMarsScript}
                >
                  RUN AUTOMATED SCRIPT
                </button>
              </aside>
            </div>

            {/* Mars Surviving Astronaut Radio Comms Card */}
            <div
              className="astronaut-comms-card"
              style={{ borderColor: '#ff7a00' }}
              onClick={handleMarsAstronautClick}
              title="Click on the astronaut to hear from him!"
            >
              <div
                className="astronaut-avatar-wrap"
                style={{
                  borderColor: '#ff7a00',
                  boxShadow: '0 0 10px #ff7a00',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/astronaut.webp"
                  alt="Surviving Astronaut on Mars"
                  className="astronaut-img"
                  onError={(e) => {
                    const img = e.currentTarget
                    if (!img.src.includes('/terminal/')) {
                      img.src = '/terminal/astronaut.webp'
                    }
                  }}
                />
                <span
                  className="astronaut-online-dot"
                  style={{
                    background: '#ff7a00',
                    boxShadow: '0 0 8px #ff7a00',
                  }}
                />
              </div>
              <div className="comms-message-body">
                <div className="comms-header-row">
                  <span
                    className="astronaut-name-tag"
                    style={{ color: '#ff7a00' }}
                  >
                    👨‍🚀 CDR. REID // MARS EXPEDITION COMMANDER
                  </span>
                  <span
                    className="comms-badge-pulse"
                    style={{ borderColor: '#ff3344', color: '#ff3344' }}
                  >
                    RED STORM HAZARD
                  </span>
                </div>
                <div
                  className="astronaut-speech-bubble"
                  style={{
                    borderLeftColor: '#ff7a00',
                    opacity: marsSpeechOpacity,
                  }}
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
              <div className="buttons-center-bank">
                {scriptExecuted && onNext && (
                  <button
                    className="cockpit-btn"
                    style={{
                      background: 'linear-gradient(180deg, #00d8ff 0%, #0088cc 100%)',
                      borderColor: '#00d8ff',
                      color: '#02040a',
                      boxShadow: '0 0 16px rgba(0, 216, 255, 0.8)',
                    }}
                    onClick={() => {
                      cockpitAudio.playClick()
                      onNext()
                    }}
                  >
                    MISSION COMPLETE // RETURN TO HQ →
                  </button>
                )}
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
            cockpitAudio.playClick()
            setActiveTipKey(null)
          }}
        >
          <div
            className={`tip-card-box ${
              activeTip.theme === 'mars' ? 'mars-theme' : ''
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="tip-header">
              <span className="tip-title">{activeTip.title}</span>
              <button
                className="tip-close-btn"
                onClick={() => {
                  cockpitAudio.playClick()
                  setActiveTipKey(null)
                }}
              >
                ×
              </button>
            </div>
            <div className="tip-body">
              {activeTip.points.map((pt, i) => (
                <div key={i} className="tip-point">
                  <div className="point-label">{pt.label}</div>
                  <div className="point-desc">{pt.desc}</div>
                </div>
              ))}
            </div>
            <div className="tip-footer">
              <button
                className="cockpit-btn btn-adjust-secondary"
                onClick={() => {
                  cockpitAudio.playClick()
                  setActiveTipKey(null)
                }}
              >
                UNDERSTOOD
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terminal Execution Diagnostic Output Modal */}
      {terminalModalData.isOpen && (
        <div
          className="terminal-modal-overlay active"
          onClick={() => {
            cockpitAudio.playClick()
            setTerminalModalData((prev) => ({ ...prev, isOpen: false }))
          }}
        >
          <div
            className={`terminal-dialog ${
              terminalModalData.isMars ? 'theme-mars' : ''
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="terminal-header">
              <span>{terminalModalData.title}</span>
              <span style={{ color: '#64748b', fontSize: 11 }}>
                [ESC / CLICK TO CLOSE]
              </span>
            </div>
            <div
              className="terminal-body"
              style={{ whiteSpace: 'pre-line' }}
            >
              {terminalModalData.body}
            </div>
            <div
              className="terminal-footer"
              style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}
            >
              <button
                className="cockpit-btn btn-adjust-secondary"
                onClick={() => {
                  cockpitAudio.playClick()
                  setTerminalModalData((prev) => ({ ...prev, isOpen: false }))
                }}
              >
                ACKNOWLEDGE
              </button>
              {onNext && (
                <button
                  className="cockpit-btn"
                  style={{
                    background: terminalModalData.isMars
                      ? 'linear-gradient(180deg, #ff3b30 0%, #a81c12 100%)'
                      : 'linear-gradient(180deg, #00d8ff 0%, #0088cc 100%)',
                    borderColor: terminalModalData.isMars ? '#ff7a00' : '#00d8ff',
                    color: terminalModalData.isMars ? '#ffffff' : '#02040a',
                  }}
                  onClick={() => {
                    cockpitAudio.playClick()
                    setTerminalModalData((prev) => ({ ...prev, isOpen: false }))
                    onNext()
                  }}
                >
                  {terminalModalData.isMars
                    ? 'COMPLETE MISSION →'
                    : 'PROCEED TO MARS →'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
