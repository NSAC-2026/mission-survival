'use client'

import React, { useState } from 'react'
import { cockpitAudio } from '@/utils/audio'

type SystemView = 1 | 2 | 3 | 4
type ViewState = SystemView | 'space-weather' | 'launch-protocol'

const crewSystemContent: Record<
  SystemView,
  { title: string; kicker: string; body: string; spec: string; status: string }
> = {
  1: {
    title: 'EMU Suit Architecture',
    kicker: 'STRUCTURAL SYSTEM & HELMET',
    body: 'The Extravehicular Mobility Unit (EMU) is an independent anthropomorphic spacecraft. Its multi-layer thermal micrometeoroid garment (TMG) and hard upper torso protect against orbital debris and severe solar thermal extremes from -150°C to +120°C.',
    spec: 'PRESSURE HULL: 29.6 KPA · 7-PLY ORTHO-FABRIC',
    status: 'INTEGRITY 100% · SEALS LOCKED',
  },
  2: {
    title: 'Biometric & Neuro Telemetry',
    kicker: 'VITAL INSTRUMENTATION ARRAY',
    body: 'Continuous physiological monitoring assesses cardiac ECG rhythm, arterial SpO2 oxygenation, core temperature, and neural cognitive stress during hyper-G acceleration and EVA extravehicular operations.',
    spec: 'CARDIAC: 74 BPM · SPO2: 99% · CORE: 37.0°C',
    status: 'VITALS NOMINAL · TELEMETRY SYNC',
  },
  3: {
    title: 'ECLSS Life Support',
    kicker: 'ENVIRONMENTAL & COOLANT LOOP',
    body: 'The Primary Life Support System (PLSS) supplies pure oxygen at regulated pressure, removes carbon dioxide via Lithium Hydroxide (LiOH) scrubbers, and circulates chilled water through the Liquid Cooling and Ventilation Garment (LCVG) to prevent metabolic hyperthermia.',
    spec: 'O2 PRESSURE: 5.9 MPA · LIOH EFFICIENCY: 99.4%',
    status: 'COOLANT 8°C · O2 RESERVES 8.0 HRS',
  },
  4: {
    title: 'Crew Payload & Tools Bay',
    kicker: 'EVA TOOLS & SAFER PROPULSION',
    body: 'Equipped with the Simplified Aid for EVA Rescue (SAFER) self-rescue nitrogen propulsion unit, Display and Control Module (DCM), tether reel, and mission sample canisters. Mass allocation must be balanced against launcher payload thresholds.',
    spec: 'SAFER DELTA-V: 3.0 M/S · TETHER: 15M D-RING',
    status: 'EQUIPMENT LOCKED · LATCH SECURE',
  },
}

const handbookItems = [
  'EMU Suit Structural Architecture',
  'Astronaut Biometrics & Vitals',
  'ECLSS Life Support Systems',
  'Crew Payload & Mission Tools',
  'NASA DONKI Space Weather',
  'Electromagnetic Shielding Tradeoff',
  'Pre-Flight Mass & Delta-V Protocol',
]

function CrewTelemetryProjection() {
  return (
    <div className="vital-projection" aria-label="Crew biometric telemetry waveform">
      <div className="projection-label">CREW BIOMETRIC WAVEFORM · SENSOR ARRAY 01</div>
      <svg viewBox="0 0 320 150" aria-hidden="true">
        {/* Oscilloscope Grid */}
        <g className="vital-grid-lines">
          <line className="vital-grid-line" x1="0" y1="35" x2="320" y2="35" />
          <line className="vital-grid-line" x1="0" y1="75" x2="320" y2="75" />
          <line className="vital-grid-line" x1="0" y1="115" x2="320" y2="115" />
          <line className="vital-grid-line" x1="60" y1="0" x2="60" y2="150" />
          <line className="vital-grid-line" x1="140" y1="0" x2="140" y2="150" />
          <line className="vital-grid-line" x1="220" y1="0" x2="220" y2="150" />
          <line className="vital-grid-line" x1="300" y1="0" x2="300" y2="150" />
        </g>

        {/* Respiration Wave */}
        <path
          className="respiration-trace"
          d="M0 88 C40 70, 80 106, 120 88 C160 70, 200 106, 240 88 C280 70, 310 100, 320 88"
        />

        {/* Electrocardiogram (ECG) Heartbeat Trace */}
        <path
          className="ecg-trace"
          d="M0 75 H35 L42 70 L48 80 L54 30 L64 122 L72 50 L80 82 L88 75 H135 L142 70 L148 80 L154 30 L164 122 L172 50 L180 82 L188 75 H235 L242 70 L248 80 L254 30 L264 122 L272 50 L280 82 L288 75 H320"
        />

        {/* Pulse Blip Indicators */}
        <circle className="vital-pulse-blip" cx="64" cy="122" r="4.5" />
        <circle className="vital-pulse-blip" cx="164" cy="122" r="4.5" />
        <circle className="vital-pulse-blip" cx="264" cy="122" r="4.5" />
      </svg>

      <div className="vital-badges">
        <div className="vital-badge-item active">
          <span className="vital-badge-dot" />
          HEART: 74 BPM
        </div>
        <div className="vital-badge-item">SPO2: 99%</div>
        <div className="vital-badge-item">SUIT: 29.6 KPA</div>
      </div>

      <span className="projection-coord">CMDR A. VEGA · VITALS STABLE · APOGEE SUIT SEAL 100%</span>
    </div>
  )
}

function AstronautBlueprint({ view }: { view: SystemView }) {
  return (
    <div className={`astronaut-blueprint blueprint-state-${view}`}>
      <div className="blueprint-head">
        <span>ASTRONAUT EMU / SYSTEM {view}.0</span>
        <span>FRONT ELEVATION &amp; SCHEMATIC</span>
      </div>

      <svg viewBox="0 0 520 620" role="img" aria-label={`${crewSystemContent[view].title} schematic`}>
        <defs>
          <linearGradient id="visorGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f5cf82" />
            <stop offset="50%" stopColor="#d88b35" />
            <stop offset="100%" stopColor="#5a2a14" />
          </linearGradient>
          <linearGradient id="suitMetal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2c1713" />
            <stop offset="50%" stopColor="#5e2f20" />
            <stop offset="100%" stopColor="#2c1713" />
          </linearGradient>
          <linearGradient id="tankGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f0b168" />
            <stop offset="100%" stopColor="#7f341e" />
          </linearGradient>
          <filter id="orangeGlow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Technical Blueprint Coordinate Grid */}
        <g className="blueprint-grid">
          <path d="M40 80H480M40 160H480M40 240H480M40 320H480M40 400H480M40 480H480M40 560H480" />
          <path d="M100 40V580M180 40V580M260 40V580M340 40V580M420 40V580" />
          <circle cx="260" cy="115" r="3" fill="#dc8753" />
          <circle cx="260" cy="270" r="3" fill="#dc8753" />
          <circle cx="260" cy="460" r="3" fill="#dc8753" />
        </g>

        {/* BASE ASTRONAUT SUIT ANATOMY (Always present, styled according to system) */}
        <g className="emu-suit-base-group">
          {/* Lower Torso / Legs */}
          <path
            className="emu-suit-base"
            d="M200 370 L180 440 L175 540 L160 580 H235 L245 540 L250 440 L260 380 L270 440 L275 540 L285 580 H360 L345 540 L340 440 L320 370 Z"
          />

          {/* Boots */}
          <path className="emu-tread" d="M155 575 H238 V595 H150 L155 575 Z" />
          <path className="emu-tread" d="M282 575 H365 L370 595 H282 V575 Z" />
          <path className="emu-panel-stitch" d="M165 585 H228 M292 585 H355" />

          {/* Hard Upper Torso (HUT) */}
          <path
            className="emu-suit-base"
            d="M170 200 L145 230 L135 320 L180 370 H340 L385 320 L375 230 L350 200 H320 L315 170 H205 L200 200 Z"
          />

          {/* Arms & Articulated Gloves */}
          <path className="emu-suit-base" d="M145 230 L115 320 L110 400 L125 435 H145 L135 395 L145 320 Z" />
          <path className="emu-suit-base" d="M375 230 L405 320 L410 400 L395 435 H375 L385 395 L375 320 Z" />

          {/* Joint Mobility Rings */}
          <ellipse className="emu-joint-ring" cx="140" cy="240" rx="14" ry="8" />
          <ellipse className="emu-joint-ring" cx="380" cy="240" rx="14" ry="8" />
          <ellipse className="emu-joint-ring" cx="120" cy="385" rx="12" ry="6" />
          <ellipse className="emu-joint-ring" cx="400" cy="385" rx="12" ry="6" />

          {/* Helmet Dome & Neck Ring */}
          <rect className="emu-joint-ring" x="200" y="160" width="120" height="15" rx="4" />
          <path
            className="emu-suit-base"
            d="M205 160 C195 90, 325 90, 315 160 C315 168, 205 168, 205 160 Z"
          />

          {/* Visor */}
          <path
            className="emu-visor-gold"
            d="M218 148 C210 100, 310 100, 302 148 C295 158, 225 158, 218 148 Z"
          />
          <path className="emu-visor-shine" d="M232 118 C245 108, 275 108, 288 118" />

          {/* Helmet Utility Pods */}
          <rect className="emu-joint-ring" x="195" y="125" width="10" height="24" rx="2" />
          <rect className="emu-joint-ring" x="315" y="125" width="10" height="24" rx="2" />
        </g>

        {/* VIEW 1: STRUCTURAL EMU SUIT & HELMET */}
        {view === 1 && (
          <g className="structural-view-layer">
            {/* Panel & Seam Lines */}
            <path className="emu-suit-accent" d="M215 220 H305 V340 H215 Z" />
            <path className="emu-panel-stitch" d="M260 170 V370 M180 280 H340 M200 450 H320 M175 510 H245 M275 510 H345" />

            {/* Shoulder bearings */}
            <circle cx="155" cy="225" r="12" fill="#3a1e16" stroke="#ed9255" strokeWidth="1.5" />
            <circle cx="365" cy="225" r="12" fill="#3a1e16" stroke="#ed9255" strokeWidth="1.5" />

            {/* Callouts */}
            <line className="blueprint-callout-line" x1="305" y1="125" x2="385" y2="85" />
            <line className="blueprint-callout-line" x1="385" y1="85" x2="480" y2="85" />
            <rect className="blueprint-callout-tag" x="385" y="70" width="115" height="18" rx="2" />
            <text className="blueprint-callout-text" x="390" y="82">GOLD UV VISOR / EVVA</text>

            <line className="blueprint-callout-line" x1="340" y1="260" x2="410" y2="240" />
            <line className="blueprint-callout-line" x1="410" y1="240" x2="495" y2="240" />
            <rect className="blueprint-callout-tag" x="410" y="225" width="105" height="18" rx="2" />
            <text className="blueprint-callout-text" x="415" y="237">HUT 7-PLY ORTHO FABRIC</text>

            <line className="blueprint-callout-line" x1="140" y1="250" x2="70" y2="270" />
            <line className="blueprint-callout-line" x1="70" y1="270" x2="15" y2="270" />
            <rect className="blueprint-callout-tag" x="15" y="255" width="100" height="18" rx="2" />
            <text className="blueprint-callout-text" x="20" y="267">ROTARY BEARING</text>

            <line className="blueprint-callout-line" x1="360" y1="585" x2="420" y2="585" />
            <rect className="blueprint-callout-tag" x="420" y="575" width="90" height="18" rx="2" />
            <text className="blueprint-callout-text" x="425" y="587">EVA MAGNETIC BOOT</text>
          </g>
        )}

        {/* VIEW 2: BIOMETRIC & NEURO TELEMETRY */}
        {view === 2 && (
          <g className="biometrics-view-layer">
            {/* Cardiac ECG Sensor Nodes on Chest */}
            <path className="vital-lead-wire" d="M260 230 L235 255 L260 295 L285 255 Z" />
            <line className="vital-lead-wire" x1="260" y1="230" x2="260" y2="180" />
            <line className="vital-lead-wire" x1="235" y1="255" x2="140" y2="385" />
            <line className="vital-lead-wire" x1="285" y1="255" x2="380" y2="385" />

            <circle className="vital-sensor-node" cx="260" cy="230" r="5" />
            <circle className="vital-sensor-node" cx="235" cy="255" r="5" />
            <circle className="vital-sensor-node" cx="285" cy="255" r="5" />
            <circle className="vital-sensor-node" cx="260" cy="295" r="5" />

            {/* Wrist pulse oximeter nodes */}
            <circle className="vital-sensor-node" cx="120" cy="385" r="4.5" />
            <circle className="vital-sensor-node" cx="400" cy="385" r="4.5" />

            {/* Neural forehead sensor array */}
            <circle className="vital-sensor-node" cx="240" cy="115" r="3" />
            <circle className="vital-sensor-node" cx="250" cy="110" r="3" />
            <circle className="vital-sensor-node" cx="260" cy="110" r="3" />
            <circle className="vital-sensor-node" cx="270" cy="110" r="3" />
            <circle className="vital-sensor-node" cx="280" cy="115" r="3" />

            {/* ECG Scope Monitor Circle Callout */}
            <circle cx="410" cy="140" r="55" fill="#130908" stroke="#ed9255" strokeWidth="1.5" />
            <circle cx="410" cy="140" r="45" fill="none" stroke="rgba(237, 146, 85, 0.3)" strokeDasharray="3 3" />
            <path
              d="M370 140 H385 L390 132 L394 148 L399 115 L405 162 L411 125 L416 145 L422 140 H450"
              fill="none"
              stroke="#ed9255"
              strokeWidth="2"
              filter="url(#orangeGlow)"
            />

            {/* Telemetry Data Callouts */}
            <line className="blueprint-callout-line" x1="410" y1="195" x2="410" y2="220" />
            <rect className="blueprint-callout-tag" x="350" y="220" width="125" height="18" rx="2" />
            <text className="blueprint-callout-text" x="355" y="232">ECG: 74 BPM NOMINAL</text>

            <line className="blueprint-callout-line" x1="120" y1="385" x2="50" y2="385" />
            <rect className="blueprint-callout-tag" x="15" y="375" width="100" height="18" rx="2" />
            <text className="blueprint-callout-text" x="20" y="387">PULSE OX: 99% SPO2</text>

            <line className="blueprint-callout-line" x1="260" y1="295" x2="330" y2="340" />
            <line className="blueprint-callout-line" x1="330" y1="340" x2="450" y2="340" />
            <rect className="blueprint-callout-tag" x="330" y="330" width="125" height="18" rx="2" />
            <text className="blueprint-callout-text" x="335" y="342">CORE TEMP: 37.0°C NOMINAL</text>
          </g>
        )}

        {/* VIEW 3: ECLSS & LIFE SUPPORT */}
        {view === 3 && (
          <g className="eclss-view-layer">
            {/* PLSS Backpack Outline & High-Pressure Oxygen Tanks */}
            <rect className="payload-gear-body" x="175" y="180" width="170" height="180" rx="10" />

            {/* Oxygen Cylinders */}
            <rect className="eclss-tank-glow" x="195" y="200" width="40" height="120" rx="8" />
            <rect className="eclss-tank-glow" x="285" y="200" width="40" height="120" rx="8" />

            {/* LiOH CO2 Scrubber in center */}
            <rect x="245" y="210" width="30" height="80" rx="4" fill="#381b14" stroke="#ed9255" strokeWidth="1.2" />
            <line x1="245" y1="235" x2="275" y2="235" stroke="#ed9255" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="245" y1="260" x2="275" y2="260" stroke="#ed9255" strokeWidth="1" strokeDasharray="2 2" />

            {/* Sublimator Heat Exchanger */}
            <rect x="235" y="300" width="50" height="35" rx="3" fill="#22100d" stroke="#5de4eb" strokeWidth="1.4" />

            {/* Liquid Cooling & Ventilation Garment (LCVG) Water Loop */}
            <path
              className="coolant-tube-network"
              d="M235 320 C210 350, 195 400, 190 460 C185 510, 195 550, 205 570 M285 320 C310 350, 325 400, 330 460 C335 510, 325 550, 315 570"
            />
            <path
              className="coolant-tube-network"
              d="M200 230 C160 260, 140 310, 130 370 M320 230 C360 260, 380 310, 390 370"
            />

            {/* Callouts */}
            <line className="blueprint-callout-line" x1="195" y1="230" x2="90" y2="210" />
            <line className="blueprint-callout-line" x1="90" y1="210" x2="15" y2="210" />
            <rect className="blueprint-callout-tag" x="15" y="195" width="115" height="18" rx="2" />
            <text className="blueprint-callout-text" x="20" y="207">DUAL O2 TANKS (5.9 MPA)</text>

            <line className="blueprint-callout-line" x1="260" y1="250" x2="350" y2="200" />
            <line className="blueprint-callout-line" x1="350" y1="200" x2="480" y2="200" />
            <rect className="blueprint-callout-tag" x="350" y="185" width="125" height="18" rx="2" />
            <text className="blueprint-callout-text" x="355" y="197">LIOH CO2 SCRUBBER (99%)</text>

            <line className="blueprint-callout-line" x1="260" y1="330" x2="360" y2="350" />
            <line className="blueprint-callout-line" x1="360" y1="350" x2="490" y2="350" />
            <rect className="blueprint-callout-tag" x="360" y="335" width="130" height="18" rx="2" />
            <text className="blueprint-callout-text" x="365" y="347">LCVG COOLING LOOP (8°C)</text>
          </g>
        )}

        {/* VIEW 4: CREW PAYLOAD & MISSION TOOLS */}
        {view === 4 && (
          <g className="payload-view-layer">
            {/* Display & Control Module (DCM) on chest */}
            <rect className="payload-dcm-panel" x="225" y="230" width="70" height="60" rx="4" />
            <rect x="233" y="238" width="54" height="20" fill="#0d0504" stroke="#c06834" strokeWidth="1" />
            <text x="240" y="252" fill="#7ee7f5" fontFamily="Orbitron" fontSize="9" fontWeight="700">
              29.6
            </text>
            <circle className="payload-dcm-led" cx="238" cy="272" r="3" />
            <circle className="payload-dcm-led" cx="250" cy="272" r="3" />
            <circle cx="275" cy="272" r="6" fill="#c06834" stroke="#ffbe85" strokeWidth="1" />

            {/* SAFER Nitrogen Thruster Pods behind shoulders */}
            <rect className="payload-gear-body" x="125" y="175" width="45" height="70" rx="4" />
            <rect className="payload-gear-body" x="350" y="175" width="45" height="70" rx="4" />
            <polygon points="120,185 110,180 110,190" fill="#ffd0a0" />
            <polygon points="120,230 110,225 110,235" fill="#ffd0a0" />
            <polygon points="400,185 410,180 410,190" fill="#ffd0a0" />
            <polygon points="400,230 410,225 410,235" fill="#ffd0a0" />

            {/* Tether Reel & D-Ring */}
            <circle cx="170" cy="365" r="14" fill="#30150f" stroke="#ed9255" strokeWidth="1.5" />
            <path className="payload-tether-cable" d="M170 379 C160 410, 150 440, 140 480" />

            {/* Sample Canister Holster on thigh */}
            <rect x="330" y="410" width="28" height="60" rx="4" fill="#2d140e" stroke="#ed9255" strokeWidth="1.4" />
            <line x1="330" y1="425" x2="358" y2="425" stroke="#ed9255" strokeWidth="1" />

            {/* Callouts */}
            <line className="blueprint-callout-line" x1="125" y1="190" x2="60" y2="150" />
            <line className="blueprint-callout-line" x1="60" y1="150" x2="10" y2="150" />
            <rect className="blueprint-callout-tag" x="10" y="135" width="125" height="18" rx="2" />
            <text className="blueprint-callout-text" x="15" y="147">SAFER PROPULSION (24 N2)</text>

            <line className="blueprint-callout-line" x1="295" y1="260" x2="390" y2="280" />
            <line className="blueprint-callout-line" x1="390" y1="280" x2="490" y2="280" />
            <rect className="blueprint-callout-tag" x="390" y="265" width="105" height="18" rx="2" />
            <text className="blueprint-callout-text" x="395" y="277">CHEST DCM TELEMETRY</text>

            <line className="blueprint-callout-line" x1="170" y1="365" x2="90" y2="355" />
            <line className="blueprint-callout-line" x1="90" y1="355" x2="10" y2="355" />
            <rect className="blueprint-callout-tag" x="10" y="340" width="120" height="18" rx="2" />
            <text className="blueprint-callout-text" x="15" y="352">15M RETRACTABLE TETHER</text>

            <line className="blueprint-callout-line" x1="358" y1="440" x2="420" y2="440" />
            <rect className="blueprint-callout-tag" x="420" y="430" width="95" height="18" rx="2" />
            <text className="blueprint-callout-text" x="425" y="442">SAMPLE CANISTER</text>
          </g>
        )}
      </svg>

      <div className="blueprint-footer">
        <span>ASSEMBLY LOCKED · CLEARANCE LEVEL 04</span>
        <span>SCALE 1:16</span>
      </div>
    </div>
  )
}

function SystemsView({
  view,
  onView,
}: {
  view: SystemView
  onView: (view: SystemView) => void
}) {
  const content = crewSystemContent[view]
  return (
    <div className="systems-view">
      <div className="systems-left">
        <CrewTelemetryProjection />
        <section className="systems-copy hud-cut">
          <p className="section-kicker">{content.kicker}</p>
          <h1>Astronaut Systems</h1>
          <div className="system-selectors" aria-label="Choose astronaut system">
            {([1, 2, 3, 4] as const).map((number) => (
              <button
                className={view === number ? 'active' : ''}
                type="button"
                key={number}
                aria-label={`System ${number}: ${crewSystemContent[number].title}`}
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
      <AstronautBlueprint view={view} />
    </div>
  )
}

function SpaceWeatherSimulator({
  shieldOn,
  onToggleShield,
}: {
  shieldOn: boolean
  onToggleShield: () => void
}) {
  const [showDonkiInfo, setShowDonkiInfo] = useState(false)

  return (
    <div className="space-weather-simulator">
      <section className={`space-weather-stage ${shieldOn ? 'shield-on' : 'shield-off'}`}>
        {/* Pulsating Sun Corona on left */}
        <div className="sun-corona" />

        {/* Dynamic CME Particle Streams */}
        <div className="cme-particle-field" aria-hidden="true">
          <span className="cme-stream-line" style={{ top: '22%', animationDelay: '0s' }} />
          <span className="cme-stream-line" style={{ top: '38%', animationDelay: '0.4s' }} />
          <span className="cme-stream-line" style={{ top: '52%', animationDelay: '0.8s' }} />
          <span className="cme-stream-line" style={{ top: '68%', animationDelay: '0.2s' }} />
          <span className="cme-stream-line" style={{ top: '82%', animationDelay: '1.1s' }} />
        </div>

        {/* Crew Pod & Deflection Shield Dome */}
        <div className="sim-pod-container">
          {shieldOn ? (
            <div className="magnetic-deflection-dome" aria-label="Magnetic shield active" />
          ) : (
            <div className="radiation-hazard-pulse" aria-label="Radiation hazard active" />
          )}

          {/* Pod SVG */}
          <svg viewBox="0 0 100 120" width="90" height="110" aria-hidden="true">
            <path
              d="M50 10 L85 50 L75 105 H25 L15 50 Z"
              fill="#2b130e"
              stroke={shieldOn ? '#5bd4e6' : '#ff4d4d'}
              strokeWidth="2.5"
            />
            <circle cx="50" cy="55" r="18" fill="#140a08" stroke="#ed9255" strokeWidth="2" />
            <circle cx="50" cy="55" r="8" fill={shieldOn ? '#48e58a' : '#ff4d4d'} />
          </svg>
        </div>

        {/* Status Chips */}
        <div className="stage-status-overlay">
          <span className="stage-status-chip">SOLAR ACTIVITY: X-CLASS 4.2 FLARE</span>
          <span className={`stage-status-chip ${shieldOn ? 'shield-active' : 'shield-inactive'}`}>
            {shieldOn ? 'EM SHIELD LOCKED · 99.8% DEFLECTION' : '⚠️ UNPROTECTED · 14.8 MSV/H RADIATION FLUX'}
          </span>
        </div>
      </section>

      <section className="sim-terminal hud-cut">
        <div className="terminal-label">SPACE WEATHER CONTROL / NASA DONKI DEFENSE</div>
        <p>
          NASA&apos;s Space Weather Database Of Notifications, Knowledge, and Information (DONKI) tracks coronal mass
          ejections (CMEs). Deep space missions must balance EM radiation shielding with ship power reserves.
        </p>

        <div className="sim-controls" style={{ margin: '14px 0' }}>
          <button
            className="launch-trigger"
            type="button"
            style={{ width: '100%', height: '42px', fontSize: '13px' }}
            onClick={() => {
              cockpitAudio.playClick()
              onToggleShield()
            }}
          >
            <span>EM SHIELD: {shieldOn ? 'ACTIVE (CLICK TO DISABLE)' : 'INACTIVE (CLICK TO ENGAGE)'}</span>
          </button>
        </div>

        {/* Power Distribution & Subsystem Tradeoffs */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#c98a69' }}>
            <span>AVAILABLE BATTERY &amp; POWER</span>
            <b>{shieldOn ? '20% (DEFLECTION DRAIN)' : '85% (FULL RESERVES)'}</b>
          </div>
          <div className="power-meter-bar">
            <div className="power-meter-fill" style={{ width: shieldOn ? '20%' : '85%' }} />
          </div>
        </div>

        <div className="sim-tradeoff-panel">
          <div className={`tradeoff-card ${shieldOn ? 'active-alert' : 'active-safe'}`}>
            <div className="tradeoff-card-title">
              <span>HYDROPONIC GREENHOUSE</span>
              <small>{shieldOn ? 'OFFLINE' : 'ONLINE'}</small>
            </div>
            <div className="tradeoff-card-body">{shieldOn ? 'Power Diverted' : 'Active Growth'}</div>
            <div className="tradeoff-card-sub">
              {shieldOn ? 'Life support on battery reserve' : 'Oxygen & food synthesis nominal'}
            </div>
          </div>

          <div className={`tradeoff-card ${shieldOn ? 'active-safe' : 'active-alert'}`}>
            <div className="tradeoff-card-title">
              <span>ASTRONAUT HEALTH</span>
              <small>{shieldOn ? 'SAFE' : 'CRITICAL'}</small>
            </div>
            <div className="tradeoff-card-body">{shieldOn ? '100% Shielded' : '25% Toxicity'}</div>
            <div className="tradeoff-card-sub">
              {shieldOn ? 'Radiation deflected by EM coils' : '⚠️ Danger: Solar flare exposure'}
            </div>
          </div>
        </div>

        <button
          className="donki-toggle-link"
          type="button"
          onClick={() => {
            cockpitAudio.playClick()
            setShowDonkiInfo((prev) => !prev)
          }}
        >
          {showDonkiInfo ? '▼ Hide NASA DONKI Briefing' : '▶ What is NASA DONKI? (Click for info)'}
        </button>

        {showDonkiInfo && (
          <div className="donki-info-box">
            <b>NASA DONKI (Space Weather Database):</b> Real-time monitoring system operated by the Community
            Coordinated Modeling Center. When DONKI flags an X-Class flare, energetic protons travel near light speed.
            Without magnetic deflection, cosmic radiation damages both DNA and critical spacecraft electronics.
          </div>
        )}
      </section>
    </div>
  )
}

function LaunchProtocolSimulator({
  cargo,
  fuel,
  onCargoChange,
  onFuelChange,
  status,
  onExecuteProtocol,
  onNext,
}: {
  cargo: number
  fuel: number
  onCargoChange: (val: number) => void
  onFuelChange: (val: number) => void
  status: string
  onExecuteProtocol: () => void
  onNext?: () => void
}) {
  const isAccepted = status === 'PROTOCOL ACCEPTED'
  const isCargoSafe = cargo <= 78
  const isFuelSafe = fuel >= 65

  // Center of Gravity Y position calculated dynamically
  const cgPercent = Math.max(22, Math.min(68, 50 + (cargo - 56) * 0.35 - (fuel - 74) * 0.25))

  return (
    <div className="protocol-simulator">
      <section className="cg-balance-stage">
        {/* Rocket Stage Cutaway */}
        <div className="rocket-cross-section">
          {/* Capsule & Crew Nose */}
          <div className="capsule-nose">
            <div className="capsule-window" />
          </div>

          {/* Cargo Equipment Bay */}
          <div className="cargo-bay-section">
            <div className="cargo-fill-level" style={{ height: `${cargo}%` }} />
          </div>

          {/* Liquid Propellant Fuel Tank */}
          <div className="fuel-tank-section">
            <div className="fuel-fill-level" style={{ height: `${fuel}%` }} />
          </div>
        </div>

        {/* Dynamic Center of Gravity Indicator */}
        <div className="cg-indicator-line" style={{ top: `${cgPercent}%` }}>
          <span className="cg-indicator-badge">CG FULCRUM</span>
          <span className="cg-indicator-badge" style={{ color: isCargoSafe && isFuelSafe ? '#48e58a' : '#ff9999' }}>
            {isCargoSafe && isFuelSafe ? 'STABLE' : 'UNSTABLE'}
          </span>
        </div>

        {/* Safe Flight Envelope Bracket */}
        <div className="cg-safe-zone-bracket">
          <span>SAFE ENVELOPE</span>
        </div>

        {/* Real-time telemetry overlay */}
        <div className="stage-status-overlay">
          <span className="stage-status-chip">PAYLOAD MASS: {(cargo * 18).toFixed(0)} KG (MAX 1,400 KG)</span>
          <span className="stage-status-chip">DELTA-V BUDGET: {(fuel * 135).toFixed(0)} M/S (MIN 8,800 M/S)</span>
          <span className={`stage-status-chip ${isCargoSafe && isFuelSafe ? 'shield-active' : 'shield-inactive'}`}>
            {isCargoSafe && isFuelSafe ? 'CENTER OF GRAVITY: BALANCED' : 'CG OFFSET: FLIGHT UNSTABLE'}
          </span>
        </div>
      </section>

      <section className="sim-terminal hud-cut">
        <div className="terminal-label">PRE-FLIGHT CALIBRATION / CARGO &amp; DELTA-V</div>
        <p>
          Configure equipment payload mass against propellant Delta-V reserves. Excess cargo causes aerodynamic
          instability (Cargo ≤ 78%), while insufficient propellant prevents reaching 500 km orbit (Fuel ≥ 65%).
        </p>

        <div className="stepper-slider-group">
          {/* Cargo Slider */}
          <div className="stepper-slider-row">
            <span className="stepper-label">Cargo Mass</span>
            <button
              className="stepper-btn"
              type="button"
              onClick={() => {
                cockpitAudio.playClick()
                onCargoChange(Math.max(0, cargo - 4))
              }}
            >
              −
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={cargo}
              onChange={(e) => onCargoChange(Number(e.target.value))}
            />
            <button
              className="stepper-btn"
              type="button"
              onClick={() => {
                cockpitAudio.playClick()
                onCargoChange(Math.min(100, cargo + 4))
              }}
            >
              +
            </button>
            <span className="stepper-val" style={{ color: isCargoSafe ? '#48e58a' : '#ff4d4d' }}>
              {cargo}%
            </span>
          </div>

          {/* Fuel Slider */}
          <div className="stepper-slider-row">
            <span className="stepper-label">Propellant Δv</span>
            <button
              className="stepper-btn"
              type="button"
              onClick={() => {
                cockpitAudio.playClick()
                onFuelChange(Math.max(0, fuel - 4))
              }}
            >
              −
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={fuel}
              onChange={(e) => onFuelChange(Number(e.target.value))}
            />
            <button
              className="stepper-btn"
              type="button"
              onClick={() => {
                cockpitAudio.playClick()
                onFuelChange(Math.min(100, fuel + 4))
              }}
            >
              +
            </button>
            <span className="stepper-val" style={{ color: isFuelSafe ? '#48e58a' : '#ff4d4d' }}>
              {fuel}%
            </span>
          </div>
        </div>

        <div className="sim-controls">
          <button
            className="launch-trigger"
            type="button"
            style={{ width: '100%', height: '44px', fontSize: '13px' }}
            onClick={() => {
              cockpitAudio.playClick()
              onExecuteProtocol()
            }}
          >
            <span>VERIFY &amp; ENGAGE LAUNCH PROTOCOL</span>
          </button>
        </div>

        <div className={`launch-result ${status ? 'visible' : ''}`} style={{ marginTop: '14px' }}>
          {isAccepted
            ? 'PROTOCOL ACCEPTED · CREW & MASS VERIFIED FOR PROTON LAUNCH'
            : 'RESOURCE WARNING · ADJUST CARGO (≤78%) OR DELTA-V (≥65%)'}
        </div>

        {isAccepted && onNext && (
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
              PROCEED TO LEVEL 2: PROTON LAUNCH ▶
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

export default function AstronautProfile({
  onBack,
  onNext,
}: {
  onBack: () => void
  onNext?: () => void
}) {
  const [view, setView] = useState<ViewState>(1)
  const [activeTab, setActiveTab] = useState<'case' | 'handbook'>('handbook')
  const [muted, setMuted] = useState(false)
  const [showGlossary, setShowGlossary] = useState(false)

  // Simulation states
  const [cargo, setCargo] = useState(56)
  const [fuel, setFuel] = useState(74)
  const [shieldOn, setShieldOn] = useState(true)
  const [status, setStatus] = useState('SYSTEMS READY')

  const handleExecuteProtocol = () => {
    if (cargo <= 78 && fuel >= 65) {
      cockpitAudio.playSuccessChime()
      setStatus('PROTOCOL ACCEPTED')
    } else {
      cockpitAudio.playThrusterPuff()
      setStatus('ADJUST RESOURCES')
    }
  }

  const selectHandbookItem = (index: number) => {
    cockpitAudio.playClick()
    if (index === 0) setView(1)
    if (index === 1) setView(2)
    if (index === 2) setView(3)
    if (index === 3) setView(4)
    if (index === 4) setView('space-weather')
    if (index === 5) setView('space-weather')
    if (index === 6) setView('launch-protocol')
  }

  return (
    <section className="proton-dashboard astronaut-dashboard" aria-label="Astronaut Launch & Orientation Dashboard">
      <header className="proton-topbar">
        <button
          className="proton-back"
          type="button"
          onClick={() => {
            cockpitAudio.playClick()
            onBack()
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
            CREW SYSTEMS
          </button>
          <button
            type="button"
            className={view === 'space-weather' ? 'active' : ''}
            onClick={() => {
              cockpitAudio.playClick()
              setView('space-weather')
            }}
          >
            SPACE WEATHER &amp; DONKI
          </button>
          <button
            type="button"
            className={view === 'launch-protocol' ? 'active' : ''}
            onClick={() => {
              cockpitAudio.playClick()
              setView('launch-protocol')
            }}
          >
            LAUNCH PROTOCOL
          </button>
        </div>

        <button
          className="sequence-button"
          type="button"
          onClick={() => {
            cockpitAudio.playClick()
            if (view === 'launch-protocol') {
              setView(1)
            } else if (view === 'space-weather') {
              setView('launch-protocol')
            } else {
              setView('space-weather')
            }
          }}
        >
          {view === 'launch-protocol' ? 'Crew Systems' : view === 'space-weather' ? 'Launch Protocol' : 'Space Weather'}
        </button>
      </header>

      <div className="proton-layout">
        <main className="proton-content">
          {view === 'space-weather' ? (
            <SpaceWeatherSimulator
              shieldOn={shieldOn}
              onToggleShield={() => setShieldOn((prev) => !prev)}
            />
          ) : view === 'launch-protocol' ? (
            <LaunchProtocolSimulator
              cargo={cargo}
              fuel={fuel}
              onCargoChange={setCargo}
              onFuelChange={setFuel}
              status={status}
              onExecuteProtocol={handleExecuteProtocol}
              onNext={onNext}
            />
          ) : (
            <SystemsView view={view} onView={(v) => setView(v)} />
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
            <nav className="handbook-list" aria-label="Astronaut Orientation lessons">
              <p>CREW HANDBOOK</p>
              {handbookItems.map((item, index) => {
                const isActive =
                  (index === 0 && view === 1) ||
                  (index === 1 && view === 2) ||
                  (index === 2 && view === 3) ||
                  (index === 3 && view === 4) ||
                  (index === 4 && view === 'space-weather') ||
                  (index === 5 && view === 'space-weather') ||
                  (index === 6 && view === 'launch-protocol')
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
              <h2>ASTRONAUT PROFILE</h2>
              <dl>
                <div>
                  <dt>Assigned Crew</dt>
                  <dd>Commander A. Vega</dd>
                </div>
                <div>
                  <dt>Mission Profile</dt>
                  <dd>Mission 01 · Crew Orientation</dd>
                </div>
                <div>
                  <dt>Clearance Level</dt>
                  <dd>Level 04 Command Officer</dd>
                </div>
                <div>
                  <dt>Space Weather</dt>
                  <dd>X-Class Solar Flare (DONKI)</dd>
                </div>
                <div>
                  <dt>Radiation Shield</dt>
                  <dd>{shieldOn ? 'Active (Coils Energized)' : 'Standby (Unprotected)'}</dd>
                </div>
                <div>
                  <dt>Pre-Flight Status</dt>
                  <dd>{status === 'PROTOCOL ACCEPTED' ? 'Protocol Accepted · Ready' : 'Calibration Pending'}</dd>
                </div>
              </dl>
            </div>
          )}

          {onNext && (
            <div className="campaign-advance-banner" style={{ margin: '14px 0 0', padding: '12px' }}>
              <div className="campaign-advance-info">
                <h3 style={{ fontSize: '13px' }}>
                  {status === 'PROTOCOL ACCEPTED' ? '🚀 PROTOCOL ACCEPTED' : '👨‍🚀 CREW ORIENTATION'}
                </h3>
                <p style={{ fontSize: '11px' }}>
                  {status === 'PROTOCOL ACCEPTED'
                    ? 'Astronaut payload balanced and radiation shielding configured.'
                    : 'Verify crew suit systems and mass calibration.'}
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
                LEVEL 2: PROTON LAUNCH ▶
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
            <div className="glossary-popover" role="dialog" aria-label="Astronaut Orientation Glossary">
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
                <b>EMU (Extravehicular Mobility Unit)</b> — independent anthropomorphic spacesuit providing thermal,
                vacuum, and micrometeoroid protection.
              </p>
              <p>
                <b>NASA DONKI</b> — Space Weather Database Of Notifications, Knowledge, and Information; tracks real-time
                solar flares and coronal mass ejections.
              </p>
              <p>
                <b>ECLSS</b> — Environmental Control and Life Support System; manages pressure, oxygen replenishment, and
                CO2 removal.
              </p>
              <p>
                <b>Delta-V (Δv)</b> — velocity increment capability generated by spacecraft propulsion engines.
              </p>
              <p>
                <b>X-Class Flare</b> — most intense solar flare category, emitting extreme ionizing radiation.
              </p>
              <p>
                <b>Center of Gravity (CG)</b> — balance fulcrum point of the loaded rocket essential for aerodynamic
                flight stability.
              </p>
            </div>
          )}
        </aside>
      </div>
    </section>
  )
}
