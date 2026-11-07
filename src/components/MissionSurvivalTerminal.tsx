'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { cockpitAudio } from '@/utils/audio'

type MoonSystemView = 1 | 2 | 3 | 4
type MarsSystemView = 1 | 2 | 3 | 4

type MoonViewState = MoonSystemView | 'lunar-night'
type MarsViewState = MarsSystemView | 'dust-storm'

/* ============================================================
   LEVEL 4: MOON (ARTEMIS BASECAMP) CONTENT
   ============================================================ */

const moonSystemContent: Record<
  MoonSystemView,
  { title: string; kicker: string; body: string; spec: string; status: string }
> = {
  1: {
    title: 'Regolith Shield & Inflatable Habitat',
    kicker: 'STRUCTURAL DOME & RADIATION ARMOR',
    body: 'The Artemis Surface Habitat features a multi-layer Vectran inflatable pressure bladder encrusted with a 1.5-meter sintered lunar regolith protective shell. This provides shielding against micrometeoroids and dangerous galactic cosmic rays.',
    spec: 'REGOLITH THICKNESS: 1.5 M · PRESSURE: 101.3 KPA',
    status: 'HULL INTEGRITY 100% · SEALS LOCKED',
  },
  2: {
    title: 'ECLSS Oxygen Recycler & Sabatier Loop',
    kicker: 'CLOSED-LOOP LIFE SUPPORT',
    body: 'The Environmental Control & Life Support System (ECLSS) captures carbon dioxide exhaled by the crew, uses the Sabatier reactor to produce water, and performs water electrolysis to generate fresh, breathable oxygen.',
    spec: 'O2 PURITY: 99.2% · RECOVERY EFFICIENCY: 82%',
    status: 'AIR RECYCLING NOMINAL · 101.3 KPA',
  },
  3: {
    title: 'Thermal Heating Loop & Radiators',
    kicker: 'SUBSURFACE HEAT EXCHANGERS',
    body: 'During the 354-hour continuous lunar night, external temperatures at Shackleton Crater plunge to -130°C (-200°F). Closed-loop ethylene-glycol heating lines and electric resistance coils keep the crew quarters warm at +21°C.',
    spec: 'INTERNAL TEMP: +21°C · EXTERNAL: -130°C',
    status: 'HEATING LOOP ACTIVE · +21°C STABLE',
  },
  4: {
    title: 'Backup Lithium Battery Bank & Fuel Cells',
    kicker: 'SURFACE ENERGY STORAGE',
    body: 'Solar panels generate zero electricity during the two-week lunar night. All habitat life support systems run on high-density lithium-ion battery banks and regenerative hydrogen fuel cells.',
    spec: 'RESERVE CAPACITY: 35% · STORAGE: 450 KWH',
    status: 'DISCHARGE RATE: 1.8 KW · 7 DAYS REMAINING',
  },
}

const moonHandbookItems = [
  'Regolith Shield & Habitat Dome',
  'ECLSS Oxygen Recycler & Sabatier',
  'Thermal Heating & Radiator Loop',
  'Backup Lithium Battery Bank',
  '14-Day Lunar Night Challenge',
  'Power Diverter Tradeoff Protocol',
  'Artemis Basecamp Survival Lock',
]

/* ============================================================
   LEVEL 5: MARS (JEZERO OUTPOST) CONTENT
   ============================================================ */

const marsSystemContent: Record<
  MarsSystemView,
  { title: string; kicker: string; body: string; spec: string; status: string }
> = {
  1: {
    title: 'Electrostatic & Magnetic Dust Shield',
    kicker: 'STORM BARRIER & HULL DEFENSE',
    body: 'High-voltage electrostatic emitters and magnetic coil loops deflect 100 km/h Martian sand and fine basaltic dust particles, preventing surface habitat dome scouring, solar array abrasion, and hull decompression.',
    spec: 'DEFLECTION FIELD: 45 KV · VELOCITY TOLERANCE: 140 KM/H',
    status: 'DEFLECTION ACTIVE · 90% DEFLECTION',
  },
  2: {
    title: 'Toxic Perchlorate Air Scrubbers',
    kicker: 'ATMOSPHERIC CHEMICAL DECONTAMINATION',
    body: 'Martian regolith contains toxic magnesium and calcium perchlorates. Multi-stage catalytic scrubbers and HEPA filters in the habitat airlocks eliminate all hazardous oxidizers before air enters crew quarters.',
    spec: 'CATALYTIC PURITY: 99.9% · PERCHLORATE: 0.00 PPM',
    status: 'FILTERS ONLINE · AIRWAYS PURIFIED',
  },
  3: {
    title: 'Nuclear Radioisotope Generator (RTG)',
    kicker: 'KILOPOWER FISSION POWER CORE',
    body: 'Global Martian dust storms completely obscure sunlight for months at a time, rendering solar panels useless. The Stirling nuclear reactor core provides continuous, weather-independent 10 kWe baseline power.',
    spec: 'OUTPUT: 10 KWE CONTINUOUS · CORE TEMP: 800°C',
    status: 'NUCLEAR OUTPUT NOMINAL · 60% ALLOCATED',
  },
  4: {
    title: 'Autonomous Guidance Computer',
    kicker: 'AUTONOMOUS REACTION CONTROLLER',
    body: 'Radio signals traveling between Mars and Earth take 20 minutes to cross interplanetary space. Real-time manual remote control from Houston is impossible; local onboard flight computers autonomously execute emergency defense scripts.',
    spec: 'SPEED-OF-LIGHT DELAY: 20 MIN · SCRIPT EXECUTION: 12 MS',
    status: 'AUTONOMOUS SCRIPT ARMED · LOCAL EXECUTION',
  },
}

const marsHandbookItems = [
  'Electrostatic Storm Shielding',
  'Perchlorate Chemical Air Scrubbers',
  'Nuclear RTG Core Power',
  'Autonomous Flight Computers',
  'Global Martian Dust Storms',
  '20-Minute Radio Latency Protocol',
  'Jezero Colony Autonomous Script',
]

/* ============================================================
   LEVEL 4: MOON BLUEPRINT & PROJECTION
   ============================================================ */

function LunarOrbitProjection({ battery, isHeated }: { battery: number; isHeated: boolean }) {
  return (
    <div className="lunar-projection" aria-label="Shackleton crater lunar telemetry">
      <div className="projection-label">SHACKLETON CRATER TELEMETRY · ARTEMIS BASECAMP 04</div>
      <svg viewBox="0 0 320 150" aria-hidden="true">
        <g stroke="rgba(192, 104, 52, 0.16)" strokeWidth="0.7">
          <line x1="0" y1="35" x2="320" y2="35" />
          <line x1="0" y1="75" x2="320" y2="75" />
          <line x1="0" y1="115" x2="320" y2="115" />
          <line x1="60" y1="0" x2="60" y2="150" />
          <line x1="140" y1="0" x2="140" y2="150" />
          <line x1="220" y1="0" x2="220" y2="150" />
          <line x1="300" y1="0" x2="300" y2="150" />
        </g>

        {/* Lunar South Pole Crater Rim Curve */}
        <path
          d="M10 145 C60 110, 160 85, 310 90"
          fill="none"
          stroke="#7a3e29"
          strokeWidth="3"
        />

        {/* Moon Base Marker */}
        <circle cx="160" cy="98" r="7" fill="#66d9eb" stroke="#fff" strokeWidth="2" />
        <rect x="145" y="112" width="30" height="4" fill="#c06834" />

        {/* Battery Discharge Curve */}
        <path
          d="M30 40 L90 55 L160 70 L240 85 L290 100"
          fill="none"
          stroke={isHeated ? '#ff9e42' : '#66d9eb'}
          strokeWidth="2"
          strokeDasharray="4 3"
        />
      </svg>

      <div className="vital-badges">
        <div className="vital-badge-item active">
          <span className="vital-badge-dot" />
          BATTERY: {battery}%
        </div>
        <div className="vital-badge-item">TEMP: {isHeated ? '+21°C (WARM)' : '-130°C (COLD)'}</div>
        <div className="vital-badge-item">NIGHT: 7 DAYS LEFT</div>
      </div>

      <span className="projection-coord">SUNSET DAY 07/14 · SOLAR INPUT: 0.0 W · LUNAR NIGHT LOCK</span>
    </div>
  )
}

function MoonBaseBlueprint({ view }: { view: MoonSystemView }) {
  return (
    <div className={`moon-blueprint blueprint-state-${view}`}>
      <div className="blueprint-head">
        <span>ARTEMIS BASECAMP / SYSTEM {view}.0</span>
        <span>FRONT ELEVATION &amp; SCHEMATIC</span>
      </div>

      <svg viewBox="0 0 520 620" role="img" aria-label={`${moonSystemContent[view].title} schematic`}>
        <defs>
          <linearGradient id="domeFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#47231a" />
            <stop offset="100%" stopColor="#240f0b" />
          </linearGradient>
        </defs>

        <g className="blueprint-grid">
          <path d="M40 80H480M40 160H480M40 240H480M40 320H480M40 400H480M40 480H480M40 560H480" />
          <path d="M100 40V580M180 40V580M260 40V580M340 40V580M420 40V580" />
        </g>

        {/* Lunar Surface Ground Line */}
        <line x1="20" y1="460" x2="500" y2="460" stroke="#7a3e29" strokeWidth="4" />

        {/* Inflatable Habitat Dome Base */}
        <path
          className="habitat-dome-shell"
          d="M120 460 C120 230, 400 230, 400 460 Z"
        />

        {/* Regolith Outer Armor Shell */}
        <path
          className="habitat-regolith-shield"
          d="M105 460 C105 210, 415 210, 415 460"
        />

        {/* Airlock Tunnel at left */}
        <rect x="50" y="380" width="70" height="80" fill="#2d130e" stroke="#ed9255" strokeWidth="2" />
        <line x1="85" y1="380" x2="85" y2="460" stroke="#ed9255" strokeWidth="2" strokeDasharray="4 2" />

        {/* Rover Docking Port at right */}
        <rect x="400" y="390" width="70" height="70" fill="#2d130e" stroke="#ed9255" strokeWidth="2" />
        <circle cx="435" cy="425" r="15" fill="#140705" stroke="#66d9eb" strokeWidth="1.5" />

        {/* VIEW 1: REGOLITH & HABITAT DOME */}
        {view === 1 && (
          <g>
            <circle cx="260" cy="300" r="14" fill="#66d9eb" stroke="#fff" strokeWidth="2" />
            <line className="blueprint-callout-line" x1="260" y1="210" x2="360" y2="150" />
            <rect className="blueprint-callout-tag" x="360" y="140" width="130" height="18" rx="2" />
            <text className="blueprint-callout-text" x="365" y="152">1.5M REGOLITH SHIELD</text>

            <line className="blueprint-callout-line" x1="85" y1="380" x2="30" y2="330" />
            <rect className="blueprint-callout-tag" x="10" y="320" width="110" height="18" rx="2" />
            <text className="blueprint-callout-text" x="15" y="332">AIRLOCK CORRIDOR</text>
          </g>
        )}

        {/* VIEW 2: ECLSS OXYGEN RECYCLER */}
        {view === 2 && (
          <g>
            <rect className="eclss-recycler-unit" x="210" y="360" width="100" height="90" rx="6" />
            <circle cx="260" cy="405" r="18" fill="#150806" stroke="#5de4eb" strokeWidth="1.5" />
            <path d="M230 385 C245 375, 275 375, 290 385" stroke="#5de4eb" strokeWidth="2" fill="none" />

            <line className="blueprint-callout-line" x1="260" y1="360" x2="370" y2="310" />
            <rect className="blueprint-callout-tag" x="370" y="300" width="125" height="18" rx="2" />
            <text className="blueprint-callout-text" x="375" y="312">ECLSS O2 RECYCLER (82%)</text>
          </g>
        )}

        {/* VIEW 3: THERMAL HEATING LOOP */}
        {view === 3 && (
          <g>
            <path
              className="thermal-heater-grid"
              d="M160 440 H360 M170 410 H350 M190 370 H330 M210 330 H310 M230 290 H290"
            />
            <line className="blueprint-callout-line" x1="310" y1="330" x2="410" y2="300" />
            <rect className="blueprint-callout-tag" x="410" y="290" width="95" height="18" rx="2" />
            <text className="blueprint-callout-text" x="415" y="302">HEAT LOOPS (+21°C)</text>
          </g>
        )}

        {/* VIEW 4: BATTERY BANK */}
        {view === 4 && (
          <g>
            <rect x="220" y="470" width="80" height="40" fill="#381b14" stroke="#ffb86c" strokeWidth="2" rx="4" />
            <rect x="235" y="480" width="50" height="20" fill="#160806" stroke="#ffb86c" strokeWidth="1" />
            <text x="242" y="494" fill="#48e58a" fontFamily="Orbitron" fontSize="10" fontWeight="700">
              35%
            </text>

            <line className="blueprint-callout-line" x1="300" y1="490" x2="390" y2="520" />
            <rect className="blueprint-callout-tag" x="390" y="510" width="115" height="18" rx="2" />
            <text className="blueprint-callout-text" x="395" y="522">450 KWH BATTERY VAULT</text>
          </g>
        )}
      </svg>

      <div className="blueprint-footer">
        <span>ASSEMBLY LOCKED · SHACKLETON CRATER</span>
        <span>SCALE 1:32</span>
      </div>
    </div>
  )
}

/* ============================================================
   LEVEL 5: MARS BLUEPRINT & PROJECTION
   ============================================================ */

function MarsOrbitProjection({ latencyTimer }: { latencyTimer: string }) {
  return (
    <div className="mars-projection" aria-label="Jezero crater dust storm telemetry">
      <div className="projection-label">JEZERO CRATER DUST MONITOR · MARS OUTPOST 05</div>
      <svg viewBox="0 0 320 150" aria-hidden="true">
        <g stroke="rgba(255, 123, 75, 0.2)" strokeWidth="0.7">
          <line x1="0" y1="35" x2="320" y2="35" />
          <line x1="0" y1="75" x2="320" y2="75" />
          <line x1="0" y1="115" x2="320" y2="115" />
          <line x1="60" y1="0" x2="60" y2="150" />
          <line x1="140" y1="0" x2="140" y2="150" />
          <line x1="220" y1="0" x2="220" y2="150" />
          <line x1="300" y1="0" x2="300" y2="150" />
        </g>

        {/* Mars Globe Silhouette */}
        <circle cx="160" cy="180" r="120" fill="#2d100b" stroke="#cf552d" strokeWidth="2" />

        {/* Dust Storm Front Swirl Line */}
        <path
          d="M60 110 Q160 80 260 120"
          fill="none"
          stroke="#ff7b4b"
          strokeWidth="3"
        />

        {/* Jezero Crater Marker */}
        <circle cx="175" cy="95" r="6" fill="#ffbe6b" stroke="#fff" strokeWidth="1.5" />
      </svg>

      <div className="vital-badges">
        <div className="vital-badge-item active">
          <span className="vital-badge-dot" />
          RADIO LAG: {latencyTimer}
        </div>
        <div className="vital-badge-item">STORM: 100 KM/H</div>
        <div className="vital-badge-item">TAU OPACITY: 4.2</div>
      </div>

      <span className="projection-coord">JEZERO CRATER (18.38°N, 77.58°E) · 20-MIN SPEED-OF-LIGHT DELAY</span>
    </div>
  )
}

function MarsBaseBlueprint({ view }: { view: MarsSystemView }) {
  return (
    <div className={`mars-blueprint blueprint-state-${view}`}>
      <div className="blueprint-head">
        <span>MARS OUTPOST / SYSTEM {view}.0</span>
        <span>FRONT ELEVATION &amp; SCHEMATIC</span>
      </div>

      <svg viewBox="0 0 520 620" role="img" aria-label={`${marsSystemContent[view].title} schematic`}>
        <g className="blueprint-grid">
          <path d="M40 80H480M40 160H480M40 240H480M40 320H480M40 400H480M40 480H480M40 560H480" />
          <path d="M100 40V580M180 40V580M260 40V580M340 40V580M420 40V580" />
        </g>

        {/* Martian Soil Line */}
        <line x1="20" y1="460" x2="500" y2="460" stroke="#cf552d" strokeWidth="4" />

        {/* Geodesic Dome */}
        <path
          className="habitat-dome-shell"
          d="M130 460 C130 240, 390 240, 390 460 Z"
        />

        {/* Electrostatic Shield Dome Arc */}
        <path
          className="electrostatic-deflection-line"
          d="M110 460 C110 215, 410 215, 410 460"
        />

        {/* Nuclear RTG Generator Mast */}
        <rect className="rtg-core-chamber" x="70" y="400" width="45" height="60" rx="4" />
        <line x1="92" y1="400" x2="92" y2="350" stroke="#ffb86c" strokeWidth="3" />
        <circle cx="92" cy="345" r="8" fill="#ff7b4b" />

        {/* Autonomous Antenna Mast */}
        <line x1="260" y1="240" x2="260" y2="160" stroke="#ffbe6b" strokeWidth="3" />
        <path d="M230 160 C260 130, 260 130, 290 160" fill="none" stroke="#ffbe6b" strokeWidth="2.5" />

        {/* VIEW 1: ELECTROSTATIC SHIELD */}
        {view === 1 && (
          <g>
            <line className="blueprint-callout-line" x1="260" y1="215" x2="380" y2="150" />
            <rect className="blueprint-callout-tag" x="380" y="140" width="125" height="18" rx="2" />
            <text className="blueprint-callout-text" x="385" y="152">45 KV DEFLECTION SHIELD</text>
          </g>
        )}

        {/* VIEW 2: PERCHLORATE SCRUBBERS */}
        {view === 2 && (
          <g>
            <rect x="220" y="370" width="80" height="80" fill="#3d160f" stroke="#5de4eb" strokeWidth="2" rx="6" />
            <line className="blueprint-callout-line" x1="300" y1="410" x2="400" y2="380" />
            <rect className="blueprint-callout-tag" x="400" y="370" width="115" height="18" rx="2" />
            <text className="blueprint-callout-text" x="405" y="382">PERCHLORATE SCRUBBER</text>
          </g>
        )}

        {/* VIEW 3: NUCLEAR RTG CORE */}
        {view === 3 && (
          <g>
            <line className="blueprint-callout-line" x1="70" y1="420" x2="10" y2="380" />
            <rect className="blueprint-callout-tag" x="10" y="370" width="110" height="18" rx="2" />
            <text className="blueprint-callout-text" x="15" y="382">10 KWE NUCLEAR CORE</text>
          </g>
        )}

        {/* VIEW 4: AUTONOMOUS COMPUTER */}
        {view === 4 && (
          <g>
            <rect x="235" y="400" width="50" height="50" fill="#1b0805" stroke="#48e58a" strokeWidth="2" rx="4" />
            <text x="242" y="428" fill="#48e58a" fontFamily="Orbitron" fontSize="10" fontWeight="700">
              AUTO
            </text>
            <line className="blueprint-callout-line" x1="260" y1="160" x2="360" y2="120" />
            <rect className="blueprint-callout-tag" x="360" y="110" width="130" height="18" rx="2" />
            <text className="blueprint-callout-text" x="365" y="122">AUTONOMOUS COMPUTERS</text>
          </g>
        )}
      </svg>

      <div className="blueprint-footer">
        <span>ASSEMBLY LOCKED · JEZERO CRATER</span>
        <span>SCALE 1:36</span>
      </div>
    </div>
  )
}

/* ============================================================
   MAIN COMPONENT: MISSION SURVIVAL TERMINAL (LEVEL 4 & 5)
   ============================================================ */

interface MissionSurvivalTerminalProps {
  initialLevel?: 4 | 5
  onBack?: () => void
  onNext?: () => void
}

export default function MissionSurvivalTerminal({
  initialLevel = 4,
  onBack,
  onNext,
}: MissionSurvivalTerminalProps) {
  const isLevel4 = initialLevel === 4

  // Navigation states
  const [moonView, setMoonView] = useState<MoonViewState>(1)
  const [marsView, setMarsView] = useState<MarsViewState>(1)
  const [activeTab, setActiveTab] = useState<'case' | 'handbook'>('handbook')
  const [muted, setMuted] = useState(false)
  const [showGlossary, setShowGlossary] = useState(false)

  // Level 4 (Moon) states
  const [powerDiverted, setPowerDiverted] = useState(false)
  const [moonConfirmed, setMoonConfirmed] = useState(false)

  // Level 5 (Mars) states
  const [marsShield, setMarsShield] = useState(90)
  const [marsLife, setMarsLife] = useState(75)
  const [marsPower, setMarsPower] = useState(60)
  const [scriptExecuted, setScriptExecuted] = useState(false)
  const [latencySeconds, setLatencySeconds] = useState(20 * 60)

  // Countdown timer for 20-minute radio lag
  useEffect(() => {
    const timer = setInterval(() => {
      setLatencySeconds((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const latencyFormatted = useMemo(() => {
    const mins = String(Math.floor(latencySeconds / 60)).padStart(2, '0')
    const secs = String(latencySeconds % 60).padStart(2, '0')
    return `${mins}:${secs}`
  }, [latencySeconds])

  const handleMoonToggleDivert = () => {
    cockpitAudio.playClick()
    setPowerDiverted((prev) => !prev)
  }

  const handleConfirmMoon = () => {
    cockpitAudio.playSuccessChime()
    setMoonConfirmed(true)
  }

  const handleRunMarsScript = () => {
    cockpitAudio.playSuccessChime()
    setScriptExecuted(true)
  }

  const selectHandbookItem = (index: number) => {
    cockpitAudio.playClick()
    if (isLevel4) {
      if (index === 0) setMoonView(1)
      if (index === 1) setMoonView(2)
      if (index === 2) setMoonView(3)
      if (index === 3) setMoonView(4)
      if (index === 4) setMoonView('lunar-night')
      if (index === 5) setMoonView('lunar-night')
      if (index === 6) setMoonView('lunar-night')
    } else {
      if (index === 0) setMarsView(1)
      if (index === 1) setMarsView(2)
      if (index === 2) setMarsView(3)
      if (index === 3) setMarsView(4)
      if (index === 4) setMarsView('dust-storm')
      if (index === 5) setMarsView('dust-storm')
      if (index === 6) setMarsView('dust-storm')
    }
  }

  return (
    <section
      className={`proton-dashboard ${isLevel4 ? 'moon-dashboard' : 'mars-dashboard'}`}
      aria-label={isLevel4 ? 'Artemis Moon Basecamp Console' : 'Jezero Mars Outpost Console'}
    >
      {/* Level 2 Topbar Navigation */}
      <header className="proton-topbar">
        <button
          className="proton-back"
          type="button"
          onClick={() => {
            cockpitAudio.playClick()
            onBack?.()
          }}
        >
          <span /> Back to missions
        </button>

        <div className="mission-phase">
          {isLevel4 ? (
            <>
              <button
                type="button"
                className={typeof moonView === 'number' && moonView <= 4 ? 'active' : ''}
                onClick={() => {
                  cockpitAudio.playClick()
                  setMoonView(1)
                }}
              >
                LUNAR SYSTEMS
              </button>
              <button
                type="button"
                className={moonView === 'lunar-night' ? 'active' : ''}
                onClick={() => {
                  cockpitAudio.playClick()
                  setMoonView('lunar-night')
                }}
              >
                LUNAR NIGHT SURVIVAL
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className={typeof marsView === 'number' && marsView <= 4 ? 'active' : ''}
                onClick={() => {
                  cockpitAudio.playClick()
                  setMarsView(1)
                }}
              >
                MARTIAN SYSTEMS
              </button>
              <button
                type="button"
                className={marsView === 'dust-storm' ? 'active' : ''}
                onClick={() => {
                  cockpitAudio.playClick()
                  setMarsView('dust-storm')
                }}
              >
                DUST STORM DEFENSE
              </button>
            </>
          )}
        </div>

        <button
          className="sequence-button"
          type="button"
          onClick={() => {
            cockpitAudio.playClick()
            if (isLevel4) {
              setMoonView((curr) => (curr === 'lunar-night' ? 1 : 'lunar-night'))
            } else {
              setMarsView((curr) => (curr === 'dust-storm' ? 1 : 'dust-storm'))
            }
          }}
        >
          {isLevel4
            ? moonView === 'lunar-night'
              ? 'Lunar Systems'
              : 'Night Survival'
            : marsView === 'dust-storm'
            ? 'Martian Systems'
            : 'Dust Defense'}
        </button>
      </header>

      {/* Main Layout Grid */}
      <div className="proton-layout">
        <main className="proton-content">
          {isLevel4 ? (
            moonView === 'lunar-night' ? (
              /* LEVEL 4: LUNAR NIGHT SURVIVAL SIMULATOR */
              <div className="lunar-simulator-view">
                <section className="lunar-survival-stage">
                  <div className="lunar-dome-cutaway">
                    {powerDiverted ? (
                      <div className="dome-thermal-glow" aria-label="Thermal heaters active" />
                    ) : (
                      <div className="dome-frost-chill" aria-label="Sub-zero freezing chill" />
                    )}

                    <svg viewBox="0 0 200 160" width="100%" height="100%" aria-hidden="true">
                      <path
                        d="M20 150 C20 40, 180 40, 180 150 Z"
                        fill={powerDiverted ? '#38160e' : '#142738'}
                        stroke={powerDiverted ? '#ff9e42' : '#66d9eb'}
                        strokeWidth="3"
                      />
                      <circle cx="100" cy="90" r="15" fill={powerDiverted ? '#ff9e42' : '#5de4eb'} />
                      <line x1="20" y1="150" x2="180" y2="150" stroke="#7a3e29" strokeWidth="4" />
                    </svg>
                  </div>

                  <div className="stage-status-overlay">
                    <span className="stage-status-chip">SHACKLETON CRATER NIGHT · DAY 07/14</span>
                    <span className={`stage-status-chip ${powerDiverted ? 'shield-active' : 'shield-inactive'}`}>
                      {powerDiverted ? 'HEATERS ACTIVE: +21°C // O2 RECYCLER OFF' : 'FREEZING ALERT: -130°C // O2 NOMINAL'}
                    </span>
                  </div>
                </section>

                <section className="sim-terminal hud-cut">
                  <div className="terminal-label">LUNAR NIGHT POWER ALLOCATION / SHACKLETON CRATER</div>
                  <p>
                    The 14-day lunar night has extinguished all solar power. Balance your 35% battery reserve between
                    life-saving thermal heating and oxygen recycling.
                  </p>

                  <div className="sim-controls" style={{ margin: '14px 0' }}>
                    <button
                      className="launch-trigger"
                      type="button"
                      style={{ width: '100%', height: '44px', fontSize: '13px' }}
                      onClick={handleMoonToggleDivert}
                    >
                      <span>
                        {powerDiverted
                          ? 'POWER DIVERTED: 80% HEAT // 25% OXYGEN (CLICK TO REVERT)'
                          : 'LIFE SUPPORT ACTIVE: 82% OXYGEN // 20% HEAT (CLICK TO DIVERT)'}
                      </span>
                    </button>
                  </div>

                  {/* Battery Meter */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#c98a69' }}>
                      <span>LITHIUM BATTERY STORAGE</span>
                      <b>35% (7 DAYS REMAINING)</b>
                    </div>
                    <div className="power-meter-bar">
                      <div className="power-meter-fill" style={{ width: '35%' }} />
                    </div>
                  </div>

                  {/* Tradeoff Cards */}
                  <div className="sim-tradeoff-panel">
                    <div className={`tradeoff-card ${powerDiverted ? 'active-safe' : 'active-alert'}`}>
                      <div className="tradeoff-card-title">
                        <span>HABITAT HEATING</span>
                        <small>{powerDiverted ? '+21°C WARM' : '-130°C FREEZING'}</small>
                      </div>
                      <div className="tradeoff-card-body">{powerDiverted ? '80% Power' : '20% Minimum'}</div>
                      <div className="tradeoff-card-sub">
                        {powerDiverted ? 'Ethylene-glycol loop prevents crew hypothermia' : 'Extreme cold risks freezing crew'}
                      </div>
                    </div>

                    <div className={`tradeoff-card ${powerDiverted ? 'active-alert' : 'active-safe'}`}>
                      <div className="tradeoff-card-title">
                        <span>ECLSS OXYGEN</span>
                        <small>{powerDiverted ? 'STANDBY' : 'RECYCLING'}</small>
                      </div>
                      <div className="tradeoff-card-body">{powerDiverted ? '25% Reserve' : '82% Nominal'}</div>
                      <div className="tradeoff-card-sub">
                        {powerDiverted ? 'Breathing emergency reserve tanks' : 'CO2 scrubbers actively running'}
                      </div>
                    </div>
                  </div>

                  <div className="sim-controls" style={{ marginTop: '14px' }}>
                    <button
                      className="launch-trigger"
                      type="button"
                      style={{ width: '100%', height: '42px', fontSize: '12px' }}
                      onClick={handleConfirmMoon}
                    >
                      <span>CONFIRM LUNAR POWER ALLOCATION</span>
                    </button>
                  </div>

                  <div className={`launch-result ${moonConfirmed ? 'visible' : ''}`} style={{ marginTop: '12px' }}>
                    ALLOCATION LOCKED · LIFE SUPPORT BALANCED THROUGH LUNAR NIGHT
                  </div>

                  {moonConfirmed && onNext && (
                    <div className="protocol-advance-wrapper">
                      <button
                        type="button"
                        className="campaign-advance-btn"
                        style={{ width: '100%', padding: '12px', fontSize: '12px' }}
                        onClick={() => {
                          cockpitAudio.playClick()
                          onNext()
                        }}
                      >
                        ADVANCE TO LEVEL 5: MARS MISSION ▶
                      </button>
                    </div>
                  )}
                </section>
              </div>
            ) : (
              /* LEVEL 4: SYSTEMS VIEW */
              <div className="systems-view">
                <div className="systems-left">
                  <LunarOrbitProjection battery={35} isHeated={powerDiverted} />
                  <section className="systems-copy hud-cut">
                    <p className="section-kicker">{moonSystemContent[moonView as MoonSystemView].kicker}</p>
                    <h1>Moon Base Systems</h1>
                    <div className="system-selectors" aria-label="Choose lunar base system">
                      {([1, 2, 3, 4] as const).map((number) => (
                        <button
                          className={moonView === number ? 'active' : ''}
                          type="button"
                          key={number}
                          onClick={() => {
                            cockpitAudio.playClick()
                            setMoonView(number)
                          }}
                        >
                          {number}
                        </button>
                      ))}
                    </div>
                    <div className="copy-rule" />
                    <h2>{moonSystemContent[moonView as MoonSystemView].title}</h2>
                    <p>{moonSystemContent[moonView as MoonSystemView].body}</p>
                    <div className="copy-meta">
                      <span>{moonSystemContent[moonView as MoonSystemView].spec}</span>
                      <span>{moonSystemContent[moonView as MoonSystemView].status}</span>
                    </div>
                  </section>
                </div>
                <MoonBaseBlueprint view={moonView as MoonSystemView} />
              </div>
            )
          ) : (
            /* LEVEL 5: MARS VIEWS */
            marsView === 'dust-storm' ? (
              /* LEVEL 5: MARS DUST STORM DEFENSE SIMULATOR */
              <div className="mars-simulator-view">
                <section className="mars-dust-storm-stage">
                  {/* Howling Dust Particle Streams */}
                  <div className="dust-particle-stream" aria-hidden="true">
                    <span className="dust-particle-line" style={{ top: '20%', animationDelay: '0s' }} />
                    <span className="dust-particle-line" style={{ top: '38%', animationDelay: '0.3s' }} />
                    <span className="dust-particle-line" style={{ top: '56%', animationDelay: '0.6s' }} />
                    <span className="dust-particle-line" style={{ top: '74%', animationDelay: '0.1s' }} />
                  </div>

                  {/* Electrostatic Shield Dome */}
                  <div className="mars-electrostatic-dome" />

                  {/* Mars Base Habitat SVG */}
                  <div style={{ position: 'relative', zIndex: 6, width: '130px', height: '110px' }}>
                    <svg viewBox="0 0 130 110" width="100%" height="100%" aria-hidden="true">
                      <path d="M15 100 C15 30, 115 30, 115 100 Z" fill="#38140c" stroke="#ff7b4b" strokeWidth="2.5" />
                      <line x1="65" y1="35" x2="65" y2="15" stroke="#ffbe6b" strokeWidth="2" />
                      <circle cx="65" cy="12" r="5" fill="#48e58a" />
                      <line x1="5" y1="100" x2="125" y2="100" stroke="#cf552d" strokeWidth="3" />
                    </svg>
                  </div>

                  <div className="stage-status-overlay">
                    <span className="stage-status-chip">JEZERO CRATER STORM // 100 KM/H</span>
                    <span className="stage-status-chip">EARTH RADIO LAG: {latencyFormatted}</span>
                    <span className="stage-status-chip shield-active">
                      DEFENSE: {marsShield}% SHIELD · {marsLife}% LIFE · {marsPower}% RTG
                    </span>
                  </div>
                </section>

                <section className="sim-terminal hud-cut">
                  <div className="terminal-label">AUTONOMOUS DEFENSE CONTROL / JEZERO CRATER</div>
                  <p>
                    Radio communications to Earth take 20 minutes across space. Real-time manual steering is impossible!
                    Configure your outpost defenses, then run the autonomous survival script.
                  </p>

                  {/* Sliders */}
                  <div className="stepper-slider-group">
                    {/* Storm Shield */}
                    <div className="stepper-slider-row">
                      <span className="stepper-label">Storm Shield</span>
                      <button
                        className="stepper-btn"
                        type="button"
                        onClick={() => {
                          cockpitAudio.playClick()
                          setMarsShield((v) => Math.max(50, v - 5))
                        }}
                      >
                        −
                      </button>
                      <input
                        type="range"
                        min="50"
                        max="100"
                        value={marsShield}
                        onChange={(e) => setMarsShield(Number(e.target.value))}
                      />
                      <button
                        className="stepper-btn"
                        type="button"
                        onClick={() => {
                          cockpitAudio.playClick()
                          setMarsShield((v) => Math.min(100, v + 5))
                        }}
                      >
                        +
                      </button>
                      <span className="stepper-val" style={{ color: marsShield >= 80 ? '#48e58a' : '#ff4733' }}>
                        {marsShield}%
                      </span>
                    </div>

                    {/* Life Support */}
                    <div className="stepper-slider-row">
                      <span className="stepper-label">Air Scrubbers</span>
                      <button
                        className="stepper-btn"
                        type="button"
                        onClick={() => {
                          cockpitAudio.playClick()
                          setMarsLife((v) => Math.max(40, v - 5))
                        }}
                      >
                        −
                      </button>
                      <input
                        type="range"
                        min="40"
                        max="100"
                        value={marsLife}
                        onChange={(e) => setMarsLife(Number(e.target.value))}
                      />
                      <button
                        className="stepper-btn"
                        type="button"
                        onClick={() => {
                          cockpitAudio.playClick()
                          setMarsLife((v) => Math.min(100, v + 5))
                        }}
                      >
                        +
                      </button>
                      <span className="stepper-val" style={{ color: marsLife >= 70 ? '#48e58a' : '#ff4733' }}>
                        {marsLife}%
                      </span>
                    </div>

                    {/* RTG Power */}
                    <div className="stepper-slider-row">
                      <span className="stepper-label">Nuclear RTG</span>
                      <button
                        className="stepper-btn"
                        type="button"
                        onClick={() => {
                          cockpitAudio.playClick()
                          setMarsPower((v) => Math.max(30, v - 5))
                        }}
                      >
                        −
                      </button>
                      <input
                        type="range"
                        min="30"
                        max="100"
                        value={marsPower}
                        onChange={(e) => setMarsPower(Number(e.target.value))}
                      />
                      <button
                        className="stepper-btn"
                        type="button"
                        onClick={() => {
                          cockpitAudio.playClick()
                          setMarsPower((v) => Math.min(100, v + 5))
                        }}
                      >
                        +
                      </button>
                      <span className="stepper-val" style={{ color: marsPower <= 75 ? '#48e58a' : '#ffbe6b' }}>
                        {marsPower}%
                      </span>
                    </div>
                  </div>

                  <div className="sim-controls">
                    <button
                      className="launch-trigger"
                      type="button"
                      style={{ width: '100%', height: '46px', fontSize: '13px' }}
                      onClick={handleRunMarsScript}
                    >
                      <span>RUN AUTONOMOUS DEFENSE SCRIPT</span>
                    </button>
                  </div>

                  <div className={`launch-result ${scriptExecuted ? 'visible' : ''}`} style={{ marginTop: '14px' }}>
                    {scriptExecuted
                      ? 'AUTONOMOUS SCRIPT EXECUTED · ALL MARS OUTPOST SYSTEMS NOMINAL'
                      : 'CONFIGURED FOR LOCAL AUTONOMOUS EXECUTION · PRESS RUN TO ENGAGE'}
                  </div>

                  {scriptExecuted && onNext && (
                    <div className="protocol-advance-wrapper">
                      <button
                        type="button"
                        className="campaign-advance-btn"
                        style={{ width: '100%', padding: '12px', fontSize: '12px' }}
                        onClick={() => {
                          cockpitAudio.playClick()
                          onNext()
                        }}
                      >
                        🏆 EXPEDITION COMPLETE: RETURN TO MISSION COMMAND ▶
                      </button>
                    </div>
                  )}
                </section>
              </div>
            ) : (
              /* LEVEL 5: SYSTEMS VIEW */
              <div className="systems-view">
                <div className="systems-left">
                  <MarsOrbitProjection latencyTimer={latencyFormatted} />
                  <section className="systems-copy hud-cut">
                    <p className="section-kicker">{marsSystemContent[marsView as MarsSystemView].kicker}</p>
                    <h1>Mars Base Systems</h1>
                    <div className="system-selectors" aria-label="Choose Mars base system">
                      {([1, 2, 3, 4] as const).map((number) => (
                        <button
                          className={marsView === number ? 'active' : ''}
                          type="button"
                          key={number}
                          onClick={() => {
                            cockpitAudio.playClick()
                            setMarsView(number)
                          }}
                        >
                          {number}
                        </button>
                      ))}
                    </div>
                    <div className="copy-rule" />
                    <h2>{marsSystemContent[marsView as MarsSystemView].title}</h2>
                    <p>{marsSystemContent[marsView as MarsSystemView].body}</p>
                    <div className="copy-meta">
                      <span>{marsSystemContent[marsView as MarsSystemView].spec}</span>
                      <span>{marsSystemContent[marsView as MarsSystemView].status}</span>
                    </div>
                  </section>
                </div>
                <MarsBaseBlueprint view={marsView as MarsSystemView} />
              </div>
            )
          )}
        </main>

        {/* Right Handbook & Case Sidebar */}
        <aside className="handbook-sidebar">
          <div className="handbook-tabs">
            <button
              className={activeTab === 'case' ? 'active' : ''}
              type="button"
              onClick={() => {
                cockpitAudio.playClick()
                setActiveTab('case')
              }}
            >
              Case
            </button>
            <button
              className={activeTab === 'handbook' ? 'active' : ''}
              type="button"
              onClick={() => {
                cockpitAudio.playClick()
                setActiveTab('handbook')
              }}
            >
              Handbook
            </button>
          </div>

          {activeTab === 'handbook' ? (
            <nav className="handbook-list" aria-label="Survival lessons">
              <p>{isLevel4 ? 'LUNAR HANDBOOK' : 'MARTIAN HANDBOOK'}</p>
              {(isLevel4 ? moonHandbookItems : marsHandbookItems).map((item, index) => {
                const isActive = isLevel4
                  ? (index === 0 && moonView === 1) ||
                    (index === 1 && moonView === 2) ||
                    (index === 2 && moonView === 3) ||
                    (index === 3 && moonView === 4) ||
                    (index >= 4 && moonView === 'lunar-night')
                  : (index === 0 && marsView === 1) ||
                    (index === 1 && marsView === 2) ||
                    (index === 2 && marsView === 3) ||
                    (index === 3 && marsView === 4) ||
                    (index >= 4 && marsView === 'dust-storm')
                return (
                  <button
                    className={isActive ? 'active' : ''}
                    type="button"
                    key={item}
                    onClick={() => selectHandbookItem(index)}
                  >
                    <span>0{index + 1}</span>
                    {item}
                  </button>
                )
              })}
            </nav>
          ) : (
            <div className="case-summary">
              <p>ACTIVE CASE</p>
              <h2>{isLevel4 ? 'ARTEMIS BASECAMP' : 'JEZERO OUTPOST'}</h2>
              <dl>
                <div>
                  <dt>Location</dt>
                  <dd>{isLevel4 ? 'Shackleton Crater (Moon South Pole)' : 'Jezero Crater (Mars)'}</dd>
                </div>
                <div>
                  <dt>Power Source</dt>
                  <dd>{isLevel4 ? 'Lithium Battery Bank (35%)' : 'Nuclear RTG Core (10 kWe)'}</dd>
                </div>
                <div>
                  <dt>Environmental Hazard</dt>
                  <dd>{isLevel4 ? '14-Day Lunar Night (-130°C)' : 'Global Dust Storm (100 km/h)'}</dd>
                </div>
                <div>
                  <dt>Communications</dt>
                  <dd>{isLevel4 ? 'Direct-to-Earth Line of Sight' : `Radio Latency: ${latencyFormatted}`}</dd>
                </div>
                <div>
                  <dt>Survival Status</dt>
                  <dd>
                    {isLevel4
                      ? moonConfirmed
                        ? 'Allocation Confirmed · Protected'
                        : 'Power Allocation Pending'
                      : scriptExecuted
                      ? 'Autonomous Script Executed'
                      : 'Autonomous Defense Ready'}
                  </dd>
                </div>
              </dl>
            </div>
          )}

          {onNext && (
            <div className="campaign-advance-banner" style={{ margin: '14px 0 0', padding: '12px' }}>
              <div className="campaign-advance-info">
                <h3 style={{ fontSize: '13px' }}>
                  {isLevel4
                    ? moonConfirmed
                      ? '🚀 LUNAR SURVIVAL SECURED'
                      : '🌙 ARTEMIS BASECAMP'
                    : scriptExecuted
                    ? '🏆 EXPEDITION COMPLETED'
                    : '🔴 JEZERO OUTPOST'}
                </h3>
                <p style={{ fontSize: '11px' }}>
                  {isLevel4
                    ? 'Battery balanced through the 14-day lunar night. Ready for Mars!'
                    : 'Mars outpost defended against global dust storm. Mission accomplished!'}
                </p>
              </div>
              <button
                type="button"
                className="campaign-advance-btn"
                style={{ padding: '8px 14px', fontSize: '11px' }}
                onClick={() => {
                  cockpitAudio.playClick()
                  onNext()
                }}
              >
                {isLevel4 ? 'LEVEL 5: MARS MISSION ▶' : 'RETURN TO MISSION HUB ▶'}
              </button>
            </div>
          )}

          <div className="handbook-footer">
            <button
              type="button"
              onClick={() => {
                cockpitAudio.playClick()
                setShowGlossary((current) => !current)
              }}
            >
              Glossary
            </button>
            <button
              type="button"
              onClick={() => {
                const nextMuted = cockpitAudio.toggleMute()
                setMuted(nextMuted)
              }}
            >
              {muted ? 'Unmute' : 'Mute'}
            </button>
          </div>

          {showGlossary && (
            <div className="glossary-popover" role="dialog" aria-label="Survival Glossary">
              <button
                type="button"
                aria-label="Close glossary"
                onClick={() => {
                  cockpitAudio.playClick()
                  setShowGlossary(false)
                }}
              >
                ×
              </button>
              <h2>{isLevel4 ? 'Lunar Flight Glossary' : 'Martian Flight Glossary'}</h2>
              {isLevel4 ? (
                <>
                  <p>
                    <b>Regolith Shield</b> — sintered moon soil covering habitat domes to shield against micrometeorites
                    and cosmic rays.
                  </p>
                  <p>
                    <b>ECLSS Sabatier</b> — closed-loop system capturing carbon dioxide and producing water and oxygen.
                  </p>
                  <p>
                    <b>Lunar Night</b> — continuous 354-hour period of total darkness at the Moon with no solar power.
                  </p>
                  <p>
                    <b>Ethylene-Glycol Loop</b> — liquid coolant pumped through subsurface radiators to maintain +21°C.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <b>Electrostatic Shield</b> — high-voltage electric field that deflects abrasive high-speed dust particles.
                  </p>
                  <p>
                    <b>Perchlorates</b> — toxic oxidizer chemicals in Martian dust that damage lungs without air scrubbers.
                  </p>
                  <p>
                    <b>RTG Core</b> — Radioisotope Thermoelectric Generator producing continuous nuclear fission power.
                  </p>
                  <p>
                    <b>Radio Latency</b> — 20-minute speed-of-light communications delay between Mars and Earth.
                  </p>
                </>
              )}
            </div>
          )}
        </aside>
      </div>
    </section>
  )
}
