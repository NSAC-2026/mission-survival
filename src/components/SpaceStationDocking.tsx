'use client'

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { cockpitAudio } from '@/utils/audio'

type SystemView = 1 | 2 | 3 | 4
type ViewState = SystemView | 'osdr-health' | 'docking-sim'

const dockingSystemContent: Record<
  SystemView,
  { title: string; kicker: string; body: string; spec: string; status: string }
> = {
  1: {
    title: 'Androgynous Peripheral Docking System (APDS)',
    kicker: 'STRUCTURAL DOCKING PORT & LATCHES',
    body: 'The APDS is an active/passive hermaphroditic docking collar. A capture ring equipped with three triangular guide petals absorbs kinetic impact and centers the spacecraft before 12 motorized structural latch hooks draw the vehicles together to compress silicone pressure seals.',
    spec: 'RING DIAMETER: 1.42 M · 12 ACTIVE HOOKS',
    status: 'MECHANISM ARMED · GUIDE PETALS EXTENDED',
  },
  2: {
    title: 'Reaction Control System (RCS) Array',
    kicker: 'ATTITUDE CONTROL & DELTA-V',
    body: 'Quad-cluster hypergolic RCS thruster pods fire pulsed bursts of monomethylhydrazine (MMH) and nitrogen tetroxide (NTO). They provide 6-Degrees-of-Freedom (6-DoF) translational maneuvers (+X, +Y, +Z) and attitude stabilization (pitch, roll, yaw) with millimetric precision.',
    spec: 'BURST IMPULSE: 110 N · 6-DOF PROPORTIONAL',
    status: 'PRESSURE 2.4 MPA · MANIFOLD NOMINAL',
  },
  3: {
    title: 'LIDAR Proximity Guidance & Sensors',
    kicker: 'OPTICAL RANGEFINDER & TARGET ACQUISITION',
    body: 'Pulsed laser radar (LIDAR) units bounce infrared beams off retroreflector corner cubes mounted on ISS Harmony Node 2. Real-time telemetry continuously computes relative range, range rate (closing velocity), azimuth offset, and line-of-sight elevation.',
    spec: 'REFRESH: 50 HZ · ACCURACY: ±2 MM',
    status: 'TARGET LOCK: ISS HARMONY · AXIS NOMINAL',
  },
  4: {
    title: 'Pressurized Vestibule & Airlock Systems',
    kicker: 'INTER-MODULE UMBILICAL & HATCHES',
    body: 'Following hard docking lock, pressure equalization valves balance atmospheric pressure between the crew capsule (101.3 kPa) and the space station. Dual pressure hatches open into the pressurized transfer corridor with umbilical connections for 120V DC power and gigabit ethernet telemetry.',
    spec: 'CABIN PRESSURE: 101.3 KPA · LEAK RATE: 0.00%',
    status: 'EQUALIZATION VALVE ARMED · HATCH SECURE',
  },
}

const handbookItems = [
  'APDS Structural Docking Port',
  'RCS Reaction Control Thrusters',
  'Lidar Alignment & Optical Guidance',
  'Pressurized Transfer Airlock',
  'NASA OSDR Microgravity Biology',
  'Kinetic Momentum & Zero-G Drift',
  'Space Station Docking Simulator',
]

function DockingApproachProjection({
  range,
  closingVelocity,
}: {
  range: number
  closingVelocity: number
}) {
  return (
    <div className="approach-projection" aria-label="Orbital docking approach vector projection">
      <div className="projection-label">ORBITAL APPROACH PROJECTION 03</div>
      <svg viewBox="0 0 320 150" aria-hidden="true">
        {/* Orbital grid lines */}
        <g stroke="rgba(192, 104, 52, 0.16)" strokeWidth="0.7">
          <line x1="0" y1="35" x2="320" y2="35" />
          <line x1="0" y1="75" x2="320" y2="75" />
          <line x1="0" y1="115" x2="320" y2="115" />
          <line x1="60" y1="0" x2="60" y2="150" />
          <line x1="140" y1="0" x2="140" y2="150" />
          <line x1="220" y1="0" x2="220" y2="150" />
          <line x1="300" y1="0" x2="300" y2="150" />
        </g>

        {/* ISS Orbital Trajectory Arc */}
        <path
          d="M10 140 C80 90, 180 50, 310 40"
          fill="none"
          stroke="#6a3a2d"
          strokeWidth="2"
        />

        {/* Docking Approach Corridor Cone */}
        <polygon
          points="260,45 80,15 80,120"
          fill="rgba(192, 104, 52, 0.08)"
          stroke="rgba(237, 146, 85, 0.4)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {/* Approach Vector Line */}
        <path
          className="approach-vector-line"
          d="M80 85 C140 75, 200 60, 260 45"
        />

        {/* ISS Station Target Node */}
        <circle className="approach-iss-target" cx="260" cy="45" r="7" />
        <rect x="252" y="32" width="16" height="3" fill="#ffc68a" />
        <rect x="252" y="55" width="16" height="3" fill="#ffc68a" />

        {/* Approaching Craft Node */}
        <circle className="approach-craft-node" cx="130" cy="78" r="5" />
      </svg>

      <div className="vital-badges">
        <div className="vital-badge-item active">
          <span className="vital-badge-dot" />
          RANGE: {range.toFixed(1)} M
        </div>
        <div className="vital-badge-item">V-REL: {closingVelocity.toFixed(2)} M/S</div>
        <div className="vital-badge-item">AXIS: LOCKED</div>
      </div>

      <span className="projection-coord">TARGET: ISS NODE-2 HARMONY · APPROACH CORRIDOR LOCKED</span>
    </div>
  )
}

function SpaceStationBlueprint({ view }: { view: SystemView }) {
  return (
    <div className={`station-blueprint blueprint-state-${view}`}>
      <div className="blueprint-head">
        <span>ISS DOCKING PORT / SYSTEM {view}.0</span>
        <span>FRONT ELEVATION &amp; SCHEMATIC</span>
      </div>

      <svg viewBox="0 0 520 620" role="img" aria-label={`${dockingSystemContent[view].title} schematic`}>
        <defs>
          <linearGradient id="metalRing" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3d211a" />
            <stop offset="50%" stopColor="#7a3f2b" />
            <stop offset="100%" stopColor="#3d211a" />
          </linearGradient>
          <linearGradient id="coolantCyan" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7ee7f5" />
            <stop offset="100%" stopColor="#1e6b78" />
          </linearGradient>
          <filter id="orangeGlow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Blueprint Technical Coordinate Grid */}
        <g className="blueprint-grid">
          <path d="M40 80H480M40 160H480M40 240H480M40 320H480M40 400H480M40 480H480M40 560H480" />
          <path d="M100 40V580M180 40V580M260 40V580M340 40V580M420 40V580" />
          <circle cx="260" cy="300" r="4" fill="#dc8753" />
        </g>

        {/* BASE DOCKING COLLAR STRUCTURE (Concentric Circular Rings) */}
        <g className="station-docking-base">
          {/* Main Outer Hull Ring */}
          <circle cx="260" cy="300" r="190" fill="url(#metalRing)" stroke="#dc8753" strokeWidth="2.5" />
          <circle cx="260" cy="300" r="160" fill="#1b0e0c" stroke="#ed9255" strokeWidth="1.8" />
          <circle cx="260" cy="300" r="125" fill="#241310" stroke="#f0a36e" strokeWidth="1.5" />
          <circle cx="260" cy="300" r="90" fill="#110706" stroke="#c06834" strokeWidth="2" />

          {/* Transfer Hatch Central Opening */}
          <circle cx="260" cy="300" r="60" fill="#090403" stroke="#ffd4a8" strokeWidth="1.8" strokeDasharray="6 3" />

          {/* Radial Structural Ribs */}
          <line x1="260" y1="110" x2="260" y2="490" stroke="#7a3f2b" strokeWidth="1.2" />
          <line x1="70" y1="300" x2="450" y2="300" stroke="#7a3f2b" strokeWidth="1.2" />
          <line x1="125" y1="165" x2="395" y2="435" stroke="#7a3f2b" strokeWidth="0.8" strokeDasharray="3 3" />
          <line x1="125" y1="435" x2="395" y2="165" stroke="#7a3f2b" strokeWidth="0.8" strokeDasharray="3 3" />
        </g>

        {/* VIEW 1: APDS DOCKING PORT & STRUCTURAL GUIDE PETALS */}
        {view === 1 && (
          <g className="apds-view-layer">
            {/* 3 Triangular Guide Petals (Top, Bottom-Left, Bottom-Right) */}
            <polygon className="apds-guide-petal" points="260,110 235,175 285,175" />
            <polygon className="apds-guide-petal" points="135,370 185,320 200,360" />
            <polygon className="apds-guide-petal" points="385,370 335,320 320,360" />

            {/* 12 Motorized Structural Latch Hooks around the collar */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, idx) => {
              const rad = (angle * Math.PI) / 180
              const x = 260 + 142 * Math.cos(rad)
              const y = 300 + 142 * Math.sin(rad)
              return (
                <circle
                  key={idx}
                  cx={x}
                  cy={y}
                  r="5"
                  className="apds-latch-hook"
                  filter="url(#orangeGlow)"
                />
              )
            })}

            {/* Silicone Seal Gasket Ring */}
            <circle cx="260" cy="300" r="108" fill="none" stroke="#ffb366" strokeWidth="2" strokeDasharray="5 3" />

            {/* Callouts */}
            <line className="blueprint-callout-line" x1="260" y1="120" x2="360" y2="70" />
            <line className="blueprint-callout-line" x1="360" y1="70" x2="490" y2="70" />
            <rect className="blueprint-callout-tag" x="360" y="55" width="130" height="18" rx="2" />
            <text className="blueprint-callout-text" x="365" y="67">TRIANGULAR GUIDE PETAL (x3)</text>

            <line className="blueprint-callout-line" x1="395" y1="330" x2="440" y2="380" />
            <rect className="blueprint-callout-tag" x="390" y="380" width="125" height="18" rx="2" />
            <text className="blueprint-callout-text" x="395" y="392">12 ACTIVE LATCH HOOKS</text>

            <line className="blueprint-callout-line" x1="160" y1="260" x2="70" y2="230" />
            <line className="blueprint-callout-line" x1="70" y1="230" x2="10" y2="230" />
            <rect className="blueprint-callout-tag" x="10" y="215" width="115" height="18" rx="2" />
            <text className="blueprint-callout-text" x="15" y="227">SILICONE VACUUM SEAL</text>
          </g>
        )}

        {/* VIEW 2: RCS THRUSTER ARRAY & DELTA-V */}
        {view === 2 && (
          <g className="rcs-view-layer">
            {/* 4 Quad RCS Thruster Pods located at cardinal corners */}
            {/* Top Thruster Pod */}
            <rect className="rcs-thruster-pod" x="240" y="55" width="40" height="35" rx="4" />
            <path className="rcs-exhaust-plume" d="M260 55 V25 M245 65 H220 M275 65 H300" />

            {/* Bottom Thruster Pod */}
            <rect className="rcs-thruster-pod" x="240" y="510" width="40" height="35" rx="4" />
            <path className="rcs-exhaust-plume" d="M260 545 V575 M245 530 H220 M275 530 H300" />

            {/* Left Thruster Pod */}
            <rect className="rcs-thruster-pod" x="15" y="280" width="35" height="40" rx="4" />
            <path className="rcs-exhaust-plume" d="M15 300 H-10 M35 285 V260 M35 315 V340" />

            {/* Right Thruster Pod */}
            <rect className="rcs-thruster-pod" x="470" y="280" width="35" height="40" rx="4" />
            <path className="rcs-exhaust-plume" d="M505 300 H530 M485 285 V260 M485 315 V340" />

            {/* Propellant Feed Tubing */}
            <circle cx="260" cy="300" r="140" fill="none" stroke="#ffd0a0" strokeWidth="1.5" strokeDasharray="6 4" />

            {/* 6-DoF Axis Indicators in center */}
            <path d="M260 300 L260 250 M260 300 L300 320 M260 300 L220 320" stroke="#7ee7f5" strokeWidth="2.5" />
            <circle cx="260" cy="300" r="6" fill="#7ee7f5" />

            {/* Callouts */}
            <line className="blueprint-callout-line" x1="280" y1="75" x2="380" y2="75" />
            <rect className="blueprint-callout-tag" x="380" y="65" width="125" height="18" rx="2" />
            <text className="blueprint-callout-text" x="385" y="77">QUAD RCS POD (110N)</text>

            <line className="blueprint-callout-line" x1="260" y1="300" x2="350" y2="240" />
            <rect className="blueprint-callout-tag" x="350" y="230" width="130" height="18" rx="2" />
            <text className="blueprint-callout-text" x="355" y="242">6-DOF ATTITUDE CONTROL</text>

            <line className="blueprint-callout-line" x1="120" y1="300" x2="10" y2="350" />
            <rect className="blueprint-callout-tag" x="10" y="340" width="125" height="18" rx="2" />
            <text className="blueprint-callout-text" x="15" y="352">HYPERGOLIC MMH/NTO LINE</text>
          </g>
        )}

        {/* VIEW 3: LIDAR PROXIMITY GUIDANCE */}
        {view === 3 && (
          <g className="lidar-view-layer">
            {/* Lidar Transmitter Units mounted on docking collar */}
            <rect x="245" y="145" width="30" height="20" rx="3" fill="#150a08" stroke="#7ee7f5" strokeWidth="1.5" />
            <circle cx="260" cy="155" r="5" fill="#7ee7f5" filter="url(#orangeGlow)" />

            {/* Pulsed Lidar Beam Cone targeting center */}
            <polygon className="lidar-beam-cone" points="260,160 180,300 340,300" />
            <line x1="260" y1="160" x2="260" y2="300" stroke="#7ee7f5" strokeWidth="1.5" strokeDasharray="3 2" />

            {/* Optical Target Cross-Hairs */}
            <circle cx="260" cy="300" r="45" fill="none" stroke="#7ee7f5" strokeWidth="1.5" />
            <line x1="205" y1="300" x2="315" y2="300" stroke="#7ee7f5" strokeWidth="1" />
            <line x1="260" y1="245" x2="260" y2="355" stroke="#7ee7f5" strokeWidth="1" />

            {/* Retroreflector Corner Cubes */}
            <polygon points="190,290 200,300 190,310" fill="#ffbe85" />
            <polygon points="330,290 320,300 330,310" fill="#ffbe85" />

            {/* Callouts */}
            <line className="blueprint-callout-line" x1="275" y1="155" x2="380" y2="120" />
            <rect className="blueprint-callout-tag" x="380" y="110" width="125" height="18" rx="2" />
            <text className="blueprint-callout-text" x="385" y="122">LIDAR SENSOR (50 HZ)</text>

            <line className="blueprint-callout-line" x1="305" y1="300" x2="390" y2="280" />
            <rect className="blueprint-callout-tag" x="390" y="270" width="120" height="18" rx="2" />
            <text className="blueprint-callout-text" x="395" y="282">OPTICAL CROSSHAIR RETICLE</text>

            <line className="blueprint-callout-line" x1="190" y1="300" x2="80" y2="260" />
            <line className="blueprint-callout-line" x1="80" y1="260" x2="10" y2="260" />
            <rect className="blueprint-callout-tag" x="10" y="245" width="120" height="18" rx="2" />
            <text className="blueprint-callout-text" x="15" y="257">CORNER RETROREFLECTOR</text>
          </g>
        )}

        {/* VIEW 4: PRESSURIZED VESTIBULE & AIRLOCK */}
        {view === 4 && (
          <g className="vestibule-view-layer">
            {/* Pressurized Tunnel Cutaway */}
            <rect className="vestibule-passageway" x="200" y="200" width="120" height="200" rx="6" />

            {/* Dual Hatch Doors */}
            <line x1="200" y1="250" x2="320" y2="250" stroke="#ed9255" strokeWidth="4" />
            <line x1="200" y1="350" x2="320" y2="350" stroke="#ed9255" strokeWidth="4" />

            {/* Equalization Valves */}
            <circle cx="260" cy="250" r="8" fill="#441e16" stroke="#ffd4a8" strokeWidth="1.5" />
            <circle cx="260" cy="350" r="8" fill="#441e16" stroke="#ffd4a8" strokeWidth="1.5" />

            {/* Power & Data Umbilical Conduits */}
            <path
              d="M175 160 C180 230, 185 370, 180 440 M345 160 C340 230, 335 370, 340 440"
              fill="none"
              stroke="#5bd4e6"
              strokeWidth="2"
            />

            {/* Atmospheric flow markers */}
            <path d="M250 280 L260 290 L270 280 M250 310 L260 320 L270 310" fill="none" stroke="#7ee7f5" strokeWidth="1.5" />

            {/* Callouts */}
            <line className="blueprint-callout-line" x1="260" y1="250" x2="380" y2="210" />
            <rect className="blueprint-callout-tag" x="380" y="200" width="125" height="18" rx="2" />
            <text className="blueprint-callout-text" x="385" y="212">FORWARD EQUALIZATION VALVE</text>

            <line className="blueprint-callout-line" x1="320" y1="350" x2="400" y2="390" />
            <rect className="blueprint-callout-tag" x="400" y="380" width="110" height="18" rx="2" />
            <text className="blueprint-callout-text" x="405" y="392">AFT PRESSURE HATCH</text>

            <line className="blueprint-callout-line" x1="175" y1="240" x2="80" y2="190" />
            <rect className="blueprint-callout-tag" x="10" y="180" width="120" height="18" rx="2" />
            <text className="blueprint-callout-text" x="15" y="192">120V POWER UMBILICAL</text>
          </g>
        )}
      </svg>

      <div className="blueprint-footer">
        <span>ASSEMBLY LOCKED · APDS-95 SPEC</span>
        <span>SCALE 1:24</span>
      </div>
    </div>
  )
}

function SystemsView({
  view,
  onView,
  range,
  closingVelocity,
}: {
  view: SystemView
  onView: (view: SystemView) => void
  range: number
  closingVelocity: number
}) {
  const content = dockingSystemContent[view]
  return (
    <div className="systems-view">
      <div className="systems-left">
        <DockingApproachProjection range={range} closingVelocity={closingVelocity} />
        <section className="systems-copy hud-cut">
          <p className="section-kicker">{content.kicker}</p>
          <h1>Docking Systems</h1>
          <div className="system-selectors" aria-label="Choose docking system">
            {([1, 2, 3, 4] as const).map((number) => (
              <button
                className={view === number ? 'active' : ''}
                type="button"
                key={number}
                aria-label={`System ${number}: ${dockingSystemContent[number].title}`}
                onClick={() => {
                  cockpitAudio.playClick()
                  onView(number)
                }}
              >
                {number}
              </button>
            ))}
          </div>
          <div className="copy-rule" />
          <h2>{content.title}</h2>
          <p>{content.body}</p>
          <div className="copy-meta">
            <span>{content.spec}</span>
            <span>{content.status}</span>
          </div>
        </section>
      </div>
      <SpaceStationBlueprint view={view} />
    </div>
  )
}

function MicrogravityOSDRSimulator() {
  return (
    <div className="osdr-simulator">
      <section className="microgravity-stage">
        {/* Floating Zero-G Astronaut Silhouette */}
        <div className="floating-crew-silhouette">
          <svg viewBox="0 0 200 280" width="100%" height="100%" aria-hidden="true">
            {/* Zero-G Floating Astronaut Body */}
            <path
              d="M100 45 C115 45 125 55 125 70 C125 85 115 95 100 95 C85 95 75 85 75 70 C75 55 85 45 100 45 Z"
              fill="#e68d50"
              stroke="#ffd4a8"
              strokeWidth="2"
            />
            {/* Visor */}
            <path d="M92 60 C98 55 108 55 114 60 C114 70 92 70 92 60 Z" fill="#7ee7f5" />
            {/* Torso tilted */}
            <path
              d="M85 95 L115 95 L125 160 L75 160 Z"
              fill="#3a1e16"
              stroke="#ed9255"
              strokeWidth="2"
            />
            {/* Floating Arms */}
            <path
              d="M85 105 L55 130 L45 120 M115 105 L145 130 L155 120"
              fill="none"
              stroke="#ed9255"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Floating Legs */}
            <path
              d="M85 160 L70 210 L55 240 M115 160 L130 210 L145 240"
              fill="none"
              stroke="#ed9255"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>

          {/* Stress Pulse Rings */}
          <div className="stress-pulse-ring" style={{ top: '25%', left: '42%' }} />
          <div className="stress-pulse-ring" style={{ top: '55%', left: '45%', animationDelay: '0.8s' }} />
        </div>

        {/* Real-time OSDR Telemetry Chips */}
        <div className="stage-status-overlay">
          <span className="stage-status-chip">NASA OSDR DATASET: OSD-473 // CELLULAR METABOLISM</span>
          <span className="stage-status-chip">MICROGRAVITY EXPOSURE: DAY 042</span>
          <span className="stage-status-chip shield-inactive">MICROGRAVITY STRESS INDEX: 65% (ELEVATED)</span>
        </div>
      </section>

      <section className="sim-terminal hud-cut">
        <div className="terminal-label">NASA OSDR BIOMEDICAL MONITOR / MICROGRAVITY</div>
        <p>
          NASA&apos;s Open Science Data Repository (OSDR) biological research reveals that prolonged microgravity exposure
          induces fluid redistribution, vestibular disorientation, and progressive muscle atrophy.
        </p>

        {/* Microgravity Stress Meter */}
        <div style={{ margin: '14px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#c98a69' }}>
            <span>CREW MICROGRAVITY STRESS INDEX</span>
            <b>65% (ELEVATED WARNING)</b>
          </div>
          <div className="power-meter-bar">
            <div
              className="power-meter-fill"
              style={{ width: '65%', background: 'linear-gradient(90deg, #ed9255, #f04435)' }}
            />
          </div>
        </div>

        {/* OSDR Biological Insights Cards */}
        <div className="sim-tradeoff-panel">
          <div className="tradeoff-card active-alert">
            <div className="tradeoff-card-title">
              <span>MUSCULOSKELETAL STAMINA</span>
              <small>DECLINING</small>
            </div>
            <div className="tradeoff-card-body">68% Reserve</div>
            <div className="tradeoff-card-sub">Postural muscles experience microgravity disuse atrophy</div>
          </div>

          <div className="tradeoff-card active-safe">
            <div className="tradeoff-card-title">
              <span>CARDIOVASCULAR ADAPTATION</span>
              <small>COMPENSATING</small>
            </div>
            <div className="tradeoff-card-body">101.3 kPa Sealed</div>
            <div className="tradeoff-card-sub">Cephalic fluid shift normalized by suit counter-pressure</div>
          </div>
        </div>

        <div className="donki-info-box" style={{ marginTop: '16px' }}>
          <b>🚀 FLIGHT SURGEON TIP:</b> Excessive thruster burns and prolonged zero-g drift significantly compound crew
          fatigue. Avoid spamming directional thrusters! Fire one deliberate burst, let inertia guide you into the green
          docking target, and tap the counter-thruster once to arrest kinetic momentum.
        </div>
      </section>
    </div>
  )
}

function LiveDockingSimulator({
  capsulePos,
  isAligned,
  isLocked,
  fuel,
  thrustInputs,
  onFireThruster,
  onEngageLock,
  onNext,
}: {
  capsulePos: { x: number; y: number }
  isAligned: boolean
  isLocked: boolean
  fuel: number
  thrustInputs: number
  onFireThruster: (dx: number, dy: number) => void
  onEngageLock: () => void
  onNext?: () => void
}) {
  const range = Math.sqrt(capsulePos.x ** 2 + capsulePos.y ** 2)

  return (
    <div className="docking-simulator-view">
      <section className="docking-radar-stage">
        {/* Rotating Concentric Radar Grid */}
        <svg className="radar-grid-svg" viewBox="0 0 700 600" aria-hidden="true">
          <circle cx="350" cy="300" r="270" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4" />
          <circle cx="350" cy="300" r="200" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
          <circle cx="350" cy="300" r="130" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4" />
          <circle cx="350" cy="300" r="65" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />

          {/* Crosshair Axes */}
          <line x1="350" y1="30" x2="350" y2="570" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          <line x1="80" y1="300" x2="620" y2="300" stroke="currentColor" strokeWidth="1" opacity="0.5" />

          {/* Rotating Radar Sweep Beam */}
          <line className="radar-sweep-beam" x1="350" y1="300" x2="350" y2="30" />
        </svg>

        {/* Central Desired Docking Zone Target Corridor */}
        <div className="docking-target-zone">
          <span>DESIRED DOCKING ZONE</span>
        </div>

        {/* Central Locked ISS Station Icon */}
        <div className="station-iss-node">
          <svg viewBox="0 0 260 150" aria-label="International Space Station">
            <g fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M38 64h70V41h35v23h72v22h-72v23h-35V86H38z" />
              <path d="M72 50V30h18v20M169 50V30h18v20M72 100v20h18v-20M169 100v20h18v-20" />
              <path d="M108 41V18h35v23M108 109v23h35v-23" />
              <path d="M20 50h45v42H20zM195 50h45v42h-45z" />
              <path d="M28 50v42M38 50v42M48 50v42M205 50v42M215 50v42M225 50v42" opacity=".7" />
              <circle cx="130" cy="75" r="13" />
            </g>
          </svg>
          <span className="station-iss-label">ISS // HARMONY NODE-2</span>
        </div>

        {/* Maneuverable Crew Capsule with Thruster Directional Buttons */}
        <div
          className={`maneuver-capsule-node ${isAligned ? 'is-aligned' : ''}`}
          style={{
            transform: `translate(${capsulePos.x}px, ${capsulePos.y}px)`,
          }}
        >
          <svg className="maneuver-capsule-svg" viewBox="0 0 120 100" aria-label="Crew capsule">
            <g fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M24 68c-4-23 6-47 29-58l36 25c10 8 12 22 6 32l-10 16-40 1z" />
              <path d="M53 13l36 25-13 34-40 1" />
              <circle cx="65" cy="40" r="5" />
            </g>
          </svg>

          {/* Directional Thruster Buttons surrounding capsule */}
          <div className="capsule-thruster-buttons">
            <button
              className="thruster-btn-up"
              type="button"
              aria-label="Thrust Up"
              disabled={isLocked || fuel <= 0}
              onClick={() => onFireThruster(0, -7)}
            >
              ▲
            </button>
            <button
              className="thruster-btn-down"
              type="button"
              aria-label="Thrust Down"
              disabled={isLocked || fuel <= 0}
              onClick={() => onFireThruster(0, 7)}
            >
              ▼
            </button>
            <button
              className="thruster-btn-left"
              type="button"
              aria-label="Thrust Left"
              disabled={isLocked || fuel <= 0}
              onClick={() => onFireThruster(-7, 0)}
            >
              ◀
            </button>
            <button
              className="thruster-btn-right"
              type="button"
              aria-label="Thrust Right"
              disabled={isLocked || fuel <= 0}
              onClick={() => onFireThruster(7, 0)}
            >
              ▶
            </button>
          </div>
        </div>

        {/* Radar Overlay Status */}
        <div className="docking-overlay-status">
          <span className="docking-status-tag">THRUST BURNS: {thrustInputs}</span>
          <span className={`docking-status-tag ${isAligned ? 'active' : ''}`}>
            {isLocked ? 'STATUS: DOCKED' : isAligned ? 'STATUS: ALIGNED' : 'STATUS: APPROACHING'}
          </span>
        </div>
      </section>

      <section className="sim-terminal hud-cut">
        <div className="terminal-label">APPROACH &amp; DOCKING CONTROL / ISS HARMONY</div>
        <p>
          Maneuver your capsule into the green central target corridor. Once aligned within range, engage automated lock
          to establish airtight structural latch seals.
        </p>

        {/* Telemetry Readouts */}
        <div className="stepper-slider-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#c98a69' }}>
            <span>RANGE TO DOCKING PORT</span>
            <b style={{ color: '#fff', fontFamily: 'Orbitron' }}>{range.toFixed(1)} M</b>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#c98a69' }}>
            <span>LATERAL OFFSET (X, Y)</span>
            <b style={{ color: isAligned ? '#48e58a' : '#ffbe85' }}>
              X: {capsulePos.x}M · Y: {capsulePos.y}M
            </b>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#c98a69' }}>
              <span>RCS THRUSTER FUEL</span>
              <b>{fuel}%</b>
            </div>
            <div className="power-meter-bar">
              <div
                className="power-meter-fill"
                style={{
                  width: `${fuel}%`,
                  background:
                    fuel < 30
                      ? 'linear-gradient(90deg, #f04435, #ff6b5a)'
                      : fuel < 55
                      ? 'linear-gradient(90deg, #ff9d3d, #ffd480)'
                      : 'linear-gradient(90deg, #ed9255, #ffba7a)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Engage Automated Lock Button */}
        <div className="sim-controls" style={{ marginTop: '16px' }}>
          <button
            className={`launch-trigger ${isLocked ? 'locked' : ''}`}
            type="button"
            style={{ width: '100%', height: '46px', fontSize: '13px' }}
            disabled={isLocked}
            onClick={onEngageLock}
          >
            <span>{isLocked ? 'AUTOMATED LOCK ENGAGED' : 'ENGAGE AUTOMATED LOCK'}</span>
          </button>
        </div>

        {/* Lock Result Status */}
        <div className={`launch-result ${isLocked ? 'visible' : ''}`} style={{ marginTop: '14px' }}>
          {isLocked
            ? 'DOCKING SECURED · HATCHES AIRTIGHT · CREW TRANSFER READY'
            : isAligned
            ? 'ALIGNED: PRESS LOCK TO SECURE AIRTIGHT SEALS'
            : 'ALIGNMENT REQUIRED: SLIDE INTO CENTRAL GREEN TARGET ZONE'}
        </div>

        {isLocked && onNext && (
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
              ADVANCE TO LEVEL 4: MOON BASECAMP ▶
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

export default function SpaceStationDocking({
  onBack,
  onNext,
}: {
  onBack?: () => void
  onNext?: () => void
}) {
  const [view, setView] = useState<ViewState>(1)
  const [activeTab, setActiveTab] = useState<'case' | 'handbook'>('handbook')
  const [muted, setMuted] = useState(false)
  const [showGlossary, setShowGlossary] = useState(false)

  // Simulation states
  const [fuel, setFuel] = useState(74)
  const [thrustInputs, setThrustInputs] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [capsulePos, setCapsulePos] = useState({ x: 35, y: -12 })

  // Check if capsule is within target zone
  const isAligned = useMemo(() => {
    return Math.abs(capsulePos.x) <= 22 && Math.abs(capsulePos.y) <= 18
  }, [capsulePos])

  const range = useMemo(() => {
    return Math.sqrt(capsulePos.x ** 2 + capsulePos.y ** 2)
  }, [capsulePos])

  const closingVelocity = useMemo(() => {
    return isLocked ? 0 : 0.12
  }, [isLocked])

  // Move capsule and burn fuel
  const fireThruster = useCallback(
    (dx: number, dy: number) => {
      if (fuel <= 0 || isLocked) return

      cockpitAudio.playThrusterPuff()

      setFuel((prev) => Math.max(0, prev - 1))
      setThrustInputs((prev) => prev + 1)
      setCapsulePos((prev) => ({
        x: Math.max(-140, Math.min(140, prev.x + dx)),
        y: Math.max(-110, Math.min(110, prev.y + dy)),
      }))
    },
    [fuel, isLocked]
  )

  // Keyboard navigation support (Arrow keys + WASD)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLocked || view !== 'docking-sim') return
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault()
        fireThruster(0, -6)
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault()
        fireThruster(0, 6)
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault()
        fireThruster(-6, 0)
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault()
        fireThruster(6, 0)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [fireThruster, isLocked, view])

  const handleEngageLock = () => {
    if (isLocked) return

    if (isAligned) {
      cockpitAudio.playLockChime()
      setIsLocked(true)
      setCapsulePos({ x: 0, y: 0 })
    } else {
      cockpitAudio.playAlarmBeep()
    }
  }

  const selectHandbookItem = (index: number) => {
    cockpitAudio.playClick()
    if (index === 0) setView(1)
    if (index === 1) setView(2)
    if (index === 2) setView(3)
    if (index === 3) setView(4)
    if (index === 4) setView('osdr-health')
    if (index === 5) setView('osdr-health')
    if (index === 6) setView('docking-sim')
  }

  return (
    <section className="proton-dashboard docking-dashboard" aria-label="Space Station Docking Command Console">
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
          <button
            type="button"
            className={typeof view === 'number' && view <= 4 ? 'active' : ''}
            onClick={() => {
              cockpitAudio.playClick()
              setView(1)
            }}
          >
            DOCKING SYSTEMS
          </button>
          <button
            type="button"
            className={view === 'osdr-health' ? 'active' : ''}
            onClick={() => {
              cockpitAudio.playClick()
              setView('osdr-health')
            }}
          >
            NASA OSDR MICROGRAVITY
          </button>
          <button
            type="button"
            className={view === 'docking-sim' ? 'active' : ''}
            onClick={() => {
              cockpitAudio.playClick()
              setView('docking-sim')
            }}
          >
            DOCKING SIMULATOR
          </button>
        </div>

        <button
          className="sequence-button"
          type="button"
          onClick={() => {
            cockpitAudio.playClick()
            if (view === 'docking-sim') {
              setView(1)
            } else if (view === 'osdr-health') {
              setView('docking-sim')
            } else {
              setView('osdr-health')
            }
          }}
        >
          {view === 'docking-sim' ? 'Docking Systems' : view === 'osdr-health' ? 'Docking Radar' : 'OSDR Health'}
        </button>
      </header>

      <div className="proton-layout">
        <main className="proton-content">
          {view === 'osdr-health' ? (
            <MicrogravityOSDRSimulator />
          ) : view === 'docking-sim' ? (
            <LiveDockingSimulator
              capsulePos={capsulePos}
              isAligned={isAligned}
              isLocked={isLocked}
              fuel={fuel}
              thrustInputs={thrustInputs}
              onFireThruster={fireThruster}
              onEngageLock={handleEngageLock}
              onNext={onNext}
            />
          ) : (
            <SystemsView
              view={view}
              onView={(v) => setView(v)}
              range={range}
              closingVelocity={closingVelocity}
            />
          )}
        </main>

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
            <nav className="handbook-list" aria-label="Docking lessons">
              <p>DOCKING HANDBOOK</p>
              {handbookItems.map((item, index) => {
                const isActive =
                  (index === 0 && view === 1) ||
                  (index === 1 && view === 2) ||
                  (index === 2 && view === 3) ||
                  (index === 3 && view === 4) ||
                  (index === 4 && view === 'osdr-health') ||
                  (index === 5 && view === 'osdr-health') ||
                  (index === 6 && view === 'docking-sim')
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
              <h2>SPACE STATION DOCKING</h2>
              <dl>
                <div>
                  <dt>Target Station</dt>
                  <dd>International Space Station (ISS)</dd>
                </div>
                <div>
                  <dt>Target Module</dt>
                  <dd>Harmony Node 2 (Forward Port)</dd>
                </div>
                <div>
                  <dt>Relative Range</dt>
                  <dd>{range.toFixed(1)} Meters</dd>
                </div>
                <div>
                  <dt>Thruster Fuel</dt>
                  <dd>{fuel}% Remaining</dd>
                </div>
                <div>
                  <dt>OSDR Stress Index</dt>
                  <dd>65% (Microgravity Elevated)</dd>
                </div>
                <div>
                  <dt>Docking Status</dt>
                  <dd>
                    {isLocked ? 'Locked & Sealed' : isAligned ? 'Target Aligned' : 'Active Approach'}
                  </dd>
                </div>
              </dl>
            </div>
          )}

          {onNext && (
            <div className="campaign-advance-banner" style={{ margin: '14px 0 0', padding: '12px' }}>
              <div className="campaign-advance-info">
                <h3 style={{ fontSize: '13px' }}>
                  {isLocked ? '🎯 DOCKING SECURED' : '🛰️ RENDEZVOUS ACTIVE'}
                </h3>
                <p style={{ fontSize: '11px' }}>
                  {isLocked
                    ? 'Capsule sealed with International Space Station. Crew and cargo transferred safely.'
                    : 'Maneuver capsule into desired corridor and lock.'}
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
                LEVEL 4: MOON MISSION ▶
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
            <div className="glossary-popover" role="dialog" aria-label="Space Station Docking Glossary">
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
              <h2>Flight Glossary</h2>
              <p>
                <b>APDS</b> — Androgynous Peripheral Docking System; capture ring with triangular guide petals and 12
                structural latch hooks.
              </p>
              <p>
                <b>RCS (Reaction Control System)</b> — thruster cluster providing 6-Degrees-of-Freedom translation and
                attitude orientation.
              </p>
              <p>
                <b>LIDAR Rangefinder</b> — pulsed laser emitting optical pulses to measure exact distance and closing
                velocity to the docking target.
              </p>
              <p>
                <b>NASA OSDR</b> — Open Science Data Repository; research documenting biological effects of zero-g on
                human cells, muscles, and bones.
              </p>
              <p>
                <b>Kinetic Momentum</b> — tendency of a spacecraft to maintain velocity in vacuum; requires deliberate
                counter-burns to cancel.
              </p>
              <p>
                <b>Equalization Valve</b> — valve that equilibrates pressure between capsule and station before hatches
                are opened.
              </p>
            </div>
          )}
        </aside>
      </div>
    </section>
  )
}
