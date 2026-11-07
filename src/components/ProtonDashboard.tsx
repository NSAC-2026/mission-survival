'use client'

import { useState } from 'react'
import OrbitalAcademySimulation from './OrbitalAcademySimulation'

type SystemView = 1 | 2 | 3 | 4
type ViewState = SystemView | 5 | 'orbital-alpha' | 'orbital-beta'

const systemContent: Record<SystemView, { title: string; body: string }> = {
  1: {
    title: 'Structural system',
    body: 'A rocket is made of four major systems. The structural system is the frame and shell of a rocket. It holds all of the other systems.',
  },
  2: {
    title: 'Propulsion system',
    body: "The propulsion system contains the fuel and machinery to fire the rocket's engine. It provides the thrust that launches the rocket and allows it to maneuver in space.",
  },
  3: {
    title: 'Guidance system',
    body: "The guidance system controls the direction of the rocket's movement. It is responsible for keeping the rocket upright during launch, controlling its path through the atmosphere, and determining its movement in space.",
  },
  4: {
    title: 'Payload',
    body: 'The payload is any cargo, object, or person the rocket needs to deliver or transport into space. It is the primary reason a rocket is sent to space. The payload will be released into space.',
  },
}

const handbookItems = [
  'Parts of a Rocket',
  'Amount of Velocity',
  'Ball on a String',
  'Amount of Gravity',
  'How a stable orbit is made',
  'Unstable Orbits',
  'Decrease Velocity to Create an Unstable Orbit',
]

function OrbitProjection() {
  return (
    <div className="orbit-projection" aria-label="Spacecraft orbital projection">
      <div className="projection-label">ORBITAL PROJECTION 07</div>
      <svg viewBox="0 0 320 150" aria-hidden="true">
        <path className="orbit-earth" d="M-10 159C31 65 127 40 234 108" />
        <path className="orbit-path" d="M15 136C73 71 151 43 267 42" />
        <path className="orbit-path faint" d="M24 149C96 93 172 73 302 84" />
        <g className="orbit-craft" transform="translate(244 31) rotate(18)">
          <path d="M0 10h33l13 7-13 7H0l8-7-8-7Z" />
          <path d="M18 9V0M18 25v9" />
        </g>
      </svg>
      <span className="projection-coord">APOGEE 500 KM · VECTOR LOCKED</span>
    </div>
  )
}

function RocketBlueprint({ view }: { view: SystemView }) {
  return (
    <div className={`rocket-blueprint blueprint-state-${view}`}>
      <div className="blueprint-head">
        <span>PROTON-M / SYSTEM {view}.0</span>
        <span>FRONT ELEVATION</span>
      </div>
      <svg viewBox="0 0 520 620" role="img" aria-label={`${systemContent[view].title} rocket schematic`}>
        <defs>
          <linearGradient id="rocketMetal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#3b2019" />
            <stop offset=".5" stopColor="#a65b32" />
            <stop offset="1" stopColor="#3a1e19" />
          </linearGradient>
          <linearGradient id="tankGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f0b168" />
            <stop offset="1" stopColor="#7f341e" />
          </linearGradient>
          <filter id="orangeGlow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <g className="blueprint-grid">
          <path d="M40 80H480M40 160H480M40 240H480M40 320H480M40 400H480M40 480H480M40 560H480" />
          <path d="M100 40V580M180 40V580M260 40V580M340 40V580M420 40V580" />
        </g>

        {view === 1 && (
          <g className="structural-rocket">
            <path className="hull-fill" d="M230 72Q260 18 290 72L295 182 324 242 343 460 378 515 370 565H150L142 515 177 460 196 242 225 182Z" />
            <path d="M225 182h70M196 242h128M177 460h166M152 515h216M260 42v523" />
            <path d="M196 255 158 311l-15 199M324 255l38 56 15 199M199 475l-28 88M321 475l28 88" />
            <path className="panel-lines" d="M215 198h90M205 275h110M194 350h132M187 425h146M170 490h180" />
            <circle cx="260" cy="215" r="4" /><circle cx="260" cy="470" r="4" />
          </g>
        )}

        {view === 2 && (
          <g className="propulsion-rocket">
            <path className="rocket-outline" d="M230 72Q260 18 290 72L295 182 324 242 343 460 378 515 370 565H150L142 515 177 460 196 242 225 182Z" />
            <path className="tank" d="M231 91h58v93h-58zM216 211h88v112h-88zM207 340h106v105H207z" />
            <path className="tank-detail" d="M234 110h52M234 163h52M220 234h80M220 298h80M211 363h98M211 421h98" />
            <path className="prop-lines" d="M244 184v27M276 184v27M236 323v17M284 323v17M234 445v47M286 445v47M234 470h52" />
            <path className="engine" d="m212 487-17 62h42l-8-62zM291 487l-8 62h42l-17-62zM244 480l-6 78h44l-6-78z" />
            <path className="booster" d="M196 253 160 309l-17 203 31 40 24-87zM324 253l36 56 17 203-31 40-24-87z" />
            <g filter="url(#orangeGlow)"><circle cx="260" cy="384" r="8" /><circle cx="260" cy="277" r="7" /></g>
          </g>
        )}

        {view === 3 && (
          <g className="guidance-rocket">
            <path className="hull-fill" d="M184 490 202 214h116l18 276z" />
            <path className="nose-section" d="M226 214 230 83Q260 24 290 83l4 131z" />
            <path d="M204 354h112M197 452h126M226 214h68" />
            <path className="callout" d="M292 170 354 128" />
            <circle className="inset-ring" cx="401" cy="158" r="90" />
            <circle className="inset-ring inner" cx="401" cy="158" r="72" />
            <g className="circuitry">
              <circle cx="401" cy="158" r="34" />
              <circle cx="401" cy="158" r="18" />
              <path d="M401 68v56M401 192v56M311 158h56M435 158h56M338 95l39 39M425 182l39 39M338 221l39-39M425 134l39-39" />
              <path d="M370 93h32l14 18 29 4M344 145l22-17M445 188l17-29M374 218l27-26" />
            </g>
          </g>
        )}

        {view === 4 && (
          <g className="payload-rocket">
            <path className="payload-base" d="M208 353h104l13 188H195zM194 541h132" />
            <path className="fairing left" d="M246 80Q193 124 166 219l73 73 12-154z" />
            <path className="fairing right" d="M274 80q53 44 80 139l-73 73-12-154z" />
            <g className="satellite" filter="url(#orangeGlow)">
              <rect x="240" y="222" width="40" height="42" rx="5" />
              <path d="M240 230h-48v27h48M280 230h48v27h-48M204 231v25M216 231v25M304 231v25M316 231v25" />
              <path d="M260 222v-24M251 198h18M260 264v28" />
            </g>
            <path className="payload-platform" d="M220 314h80l12 39H208z" />
          </g>
        )}
      </svg>
      <div className="blueprint-footer">
        <span>ASSEMBLY LOCKED</span>
        <span>SCALE 1:48</span>
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
  const content = systemContent[view]
  return (
    <div className="systems-view">
      <div className="systems-left">
        <OrbitProjection />
        <section className="systems-copy hud-cut">
          <p className="section-kicker">SYSTEM ARCHITECTURE</p>
          <h1>Rocket Systems</h1>
          <div className="system-selectors" aria-label="Choose rocket system">
            {([1, 2, 3, 4] as const).map((number) => (
              <button
                className={view === number ? 'active' : ''}
                type="button"
                key={number}
                aria-label={`System ${number}: ${systemContent[number].title}`}
                onClick={() => onView(number)}
              >
                {number}
              </button>
            ))}
          </div>
          <div className="copy-rule" />
          <h2>{content.title}</h2>
          <p>{content.body}</p>
          <div className="copy-meta">
            <span>MODULE 0{view}</span>
            <span>STATUS · ONLINE</span>
          </div>
        </section>
      </div>
      <RocketBlueprint view={view} />
    </div>
  )
}

function LaunchSimulator() {
  const [thrust, setThrust] = useState(62)
  const [launched, setLaunched] = useState(false)
  const successful = thrust >= 72

  return (
    <div className="launch-simulator">
      <section className={`earth-profile ${launched ? 'is-launched' : ''}`}>
        <div className="altitude-marker">
          <span>SPACE BEGINS</span>
          <b>100 KM</b>
          <span>EARTH ENDS</span>
        </div>
        <div className="sim-stars" />
        <div className="sim-rocket">
          <span className="rocket-body" />
          <span className="rocket-flame" />
        </div>
        <div className="launch-tower"><i /><i /><i /></div>
        <div className="exhaust-clouds"><i /><i /><i /><i /><i /></div>
        <div className="earth-ground" />
        <div className="altitude-scale"><span>500 KM</span><span>250 KM</span><span>0 KM</span></div>
      </section>

      <section className="sim-terminal hud-cut">
        <div className="terminal-label">LAUNCH CONTROL / PROTON-M</div>
        <p>
          Your job is to figure out what amount of thrust is needed to launch your rocket 500 km above Earth&apos;s
          surface.
        </p>
        <p>After you set your thrust value, run your simulation to see if your rocket will launch.</p>

        <div className="sim-controls">
          <div className="thrust-controller">
            <span>THRUST</span>
            <button type="button" aria-label="Increase thrust" onClick={() => setThrust((value) => Math.min(100, value + 4))}>+</button>
            <b>{thrust}%</b>
            <button type="button" aria-label="Decrease thrust" onClick={() => setThrust((value) => Math.max(0, value - 4))}>−</button>
          </div>
          <div className="force-vector">
            <span className="up-arrow" />
            <b>THRUST</b>
            <span className="down-arrow" />
            <b>GRAVITY</b>
          </div>
          <button className="launch-trigger" type="button" onClick={() => setLaunched(true)}>
            <span>LAUNCH</span>
          </button>
        </div>

        <div className={`launch-result ${launched ? 'visible' : ''}`}>
          {successful ? 'ORBIT ACHIEVED · 500 KM' : 'INSUFFICIENT THRUST · ADJUST AND RETRY'}
        </div>
      </section>
    </div>
  )
}

export default function ProtonDashboard({
  onBack,
  onNext,
}: {
  onBack: () => void
  onNext?: () => void
}) {
  const [view, setView] = useState<ViewState>(2)
  const [activeTab, setActiveTab] = useState<'case' | 'handbook'>('handbook')
  const [muted, setMuted] = useState(true)
  const [showGlossary, setShowGlossary] = useState(false)

  const selectHandbookItem = (index: number) => {
    if (index === 0) setView(2)
    if (index === 1) setView(1)
    if (index === 2) setView(3)
    if (index === 3) setView(4)
    if (index === 4) setView('orbital-alpha')
    if (index === 5) setView('orbital-beta')
    if (index === 6) setView('orbital-beta')
  }

  return (
    <section className="proton-dashboard" aria-label="Proton Launch educational dashboard">
      <header className="proton-topbar">
        <button className="proton-back" type="button" onClick={onBack}>
          <span /> Back to missions
        </button>
        <div className="mission-phase">
          <button
            type="button"
            className={typeof view === 'number' && view <= 4 ? 'active' : ''}
            onClick={() => setView(1)}
          >
            SYSTEMS
          </button>
          <button
            type="button"
            className={view === 'orbital-alpha' ? 'active' : ''}
            onClick={() => setView('orbital-alpha')}
          >
            ORBITAL ALPHA
          </button>
          <button
            type="button"
            className={view === 'orbital-beta' ? 'active' : ''}
            onClick={() => setView('orbital-beta')}
          >
            ORBITAL BETA
          </button>
          <button
            type="button"
            className={view === 5 ? 'active' : ''}
            onClick={() => setView(5)}
          >
            LAUNCH SEQUENCE
          </button>
        </div>
        <button
          className="sequence-button"
          type="button"
          onClick={() => {
            if (view === 5) {
              setView(1)
            } else if (view === 'orbital-alpha' || view === 'orbital-beta') {
              setView(5)
            } else {
              setView('orbital-alpha')
            }
          }}
        >
          {view === 5 ? 'Rocket Systems' : view === 'orbital-alpha' || view === 'orbital-beta' ? 'Launch Simulator' : 'Orbit Simulation'}
        </button>
      </header>

      <div className="proton-layout">
        <main className="proton-content">
          {view === 5 ? (
            <LaunchSimulator />
          ) : view === 'orbital-alpha' ? (
            <OrbitalAcademySimulation
              initialMode="stable"
              onSelectLesson={(lesson) => setView(lesson === 'stable' ? 'orbital-alpha' : 'orbital-beta')}
            />
          ) : view === 'orbital-beta' ? (
            <OrbitalAcademySimulation
              initialMode="unstable"
              onSelectLesson={(lesson) => setView(lesson === 'stable' ? 'orbital-alpha' : 'orbital-beta')}
            />
          ) : (
            <SystemsView view={view} onView={(v) => setView(v)} />
          )}
        </main>

        <aside className="handbook-sidebar">
          <div className="handbook-tabs">
            <button className={activeTab === 'case' ? 'active' : ''} type="button" onClick={() => setActiveTab('case')}>Case</button>
            <button className={activeTab === 'handbook' ? 'active' : ''} type="button" onClick={() => setActiveTab('handbook')}>Handbook</button>
          </div>

          {activeTab === 'handbook' ? (
            <nav className="handbook-list" aria-label="Handbook lessons">
              <p>NAVIGATION HANDBOOK</p>
              {handbookItems.map((item, index) => {
                const isActive =
                  (index === 0 && view === 2) ||
                  (index === 1 && view === 1) ||
                  (index === 2 && view === 3) ||
                  (index === 3 && view === 4) ||
                  (index === 4 && view === 'orbital-alpha') ||
                  (index === 5 && view === 'orbital-beta') ||
                  (index === 6 && (view === 'orbital-beta' || view === 5))
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
              <h2>{view === 'orbital-alpha' || view === 'orbital-beta' ? 'ORBITAL ACADEMY' : 'PROTON-M'}</h2>
              <dl>
                <div>
                  <dt>Objective</dt>
                  <dd>
                    {view === 'orbital-alpha'
                      ? 'Stable Circular Orbit (7.8 km/s)'
                      : view === 'orbital-beta'
                      ? 'Decay Analysis / Orbital Equilibrium'
                      : '500 km orbit'}
                  </dd>
                </div>
                <div>
                  <dt>Vehicle</dt>
                  <dd>
                    {view === 'orbital-alpha' || view === 'orbital-beta'
                      ? 'Earth Orbiter / Sensor Array'
                      : 'Three-stage rocket'}
                  </dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>
                    {view === 'orbital-alpha'
                      ? 'Stable Orbit Locked'
                      : view === 'orbital-beta'
                      ? 'Unstable Orbit Simulated'
                      : 'Training ready'}
                  </dd>
                </div>
              </dl>
            </div>
          )}

          {onNext && (
            <div className="campaign-advance-banner" style={{ margin: '14px 0 0', padding: '12px' }}>
              <div className="campaign-advance-info">
                <h3 style={{ fontSize: '13px' }}>🚀 ORBIT ACHIEVED</h3>
                <p style={{ fontSize: '11px' }}>Proton-M launch systems and orbit mechanics verified.</p>
              </div>
              <button
                type="button"
                className="campaign-advance-btn"
                style={{ padding: '8px 14px', fontSize: '11px' }}
                onClick={() => onNext()}
              >
                LEVEL 3: DOCKING ▶
              </button>
            </div>
          )}

          <div className="handbook-footer">
            <button type="button" onClick={() => setShowGlossary((current) => !current)}>Glossary</button>
            <button type="button" onClick={() => setMuted((current) => !current)}>{muted ? 'Unmute' : 'Mute'}</button>
          </div>

          {showGlossary && (
            <div className="glossary-popover" role="dialog" aria-label="Glossary">
              <button type="button" aria-label="Close glossary" onClick={() => setShowGlossary(false)}>×</button>
              <h2>Flight Glossary</h2>
              <p><b>Thrust</b> — force that moves a rocket upward.</p>
              <p><b>Payload</b> — cargo carried by a spacecraft.</p>
              <p><b>Orbit</b> — a curved path around a body in space caused by continuous falling toward the planet while moving sideways.</p>
              <p><b>Velocity</b> — speed in a specific direction required to counteract gravitational pull.</p>
              <p><b>Unstable Orbit</b> — orbital decay caused when forward velocity drops below the gravitational threshold.</p>
            </div>
          )}
        </aside>
      </div>
    </section>
  )
}
