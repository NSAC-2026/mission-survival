'use client'

import { useState, type SVGProps } from 'react'
import ProtonDashboard from './ProtonDashboard'
import AstronautProfile from './AstronautProfile'

type IconProps = SVGProps<SVGSVGElement>

function TutorialIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" {...props}>
      <path d="M6 24 32 11l26 13-26 13L6 24Z" />
      <path d="M17 31v13c8 7 22 7 30 0V31M55 27v18" />
      <circle cx="55" cy="49" r="3" />
    </svg>
  )
}

function RocketIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" {...props}>
      <path d="M39 8c8 1 13 5 16 13-2 11-9 21-20 30L13 29C22 18 29 11 39 8Z" />
      <circle cx="39" cy="23" r="6" />
      <path d="m19 35-8 3-4 11 15-3M29 45l-3 10-11 4 3-14M10 54l10-10" />
    </svg>
  )
}

const missions = [
  { label: 'Tutorials', detail: 'Training systems online', icon: TutorialIcon },
  { label: 'Space Station', detail: 'Approaching space station', icon: RocketIcon },
]

const launchMissions = [
  { name: 'Astronaut Launch', kind: 'astronaut' },
  { name: 'Proton Launch', kind: 'proton' },
  { name: 'Space Station', kind: 'station' },
  { name: 'First Stage Landing', kind: 'landing' },
  { name: 'Moon Mission', kind: 'moon' },
  { name: 'Mars Mission', kind: 'mars' },
]

function MissionGlyph({ kind }: { kind: string }) {
  if (kind === 'station') {
    return (
      <svg viewBox="0 0 100 80" aria-hidden="true">
        <path d="M10 17h80M19 10v14M28 10v14M72 10v14M81 10v14M47 4h7v38h-7zM42 29h17M51 42v12" />
        <path d="m55 57 31-22-8 27-21 13-9-7 7-11ZM67 51l8 8M53 62l14 7" />
      </svg>
    )
  }

  if (kind === 'landing') {
    return (
      <svg viewBox="0 0 100 80" aria-hidden="true">
        <path d="M50 8c7 10 8 30 2 48h-4C42 38 43 18 50 8ZM43 47l-13 14M57 47l13 14M22 62h56M50 27v17" />
      </svg>
    )
  }

  if (kind === 'moon') {
    return (
      <svg viewBox="0 0 100 80" aria-hidden="true">
        <circle cx="73" cy="23" r="17" />
        <circle cx="67" cy="17" r="3" />
        <circle cx="78" cy="29" r="4" />
        <path d="M49 11c7 10 8 30 2 48h-4c-6-18-5-38 2-48ZM42 49 31 62M56 49l10 13M22 63h54M29 27l-12 9 8 9 10-10M23 34l-7-7" />
        <path d="M57 7c16-9 34-1 36 13" strokeDasharray="3 5" />
      </svg>
    )
  }

  if (kind === 'mars') {
    return (
      <svg viewBox="0 0 100 80" aria-hidden="true">
        <circle className="planet-fill" cx="70" cy="24" r="20" />
        <path d="M17 58 52 23l10 10-35 35-14 3 4-13ZM27 55l9 9M20 53l-7-5M31 69l5 7" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 100 80" aria-hidden="true">
      <path d="M57 8c10 3 18 10 21 20-7 18-20 31-39 39L24 52C33 31 43 17 57 8Z" />
      <circle cx="58" cy="27" r="7" />
      <path d="m35 49-14 3-8 13 18-4M47 61l-3 12-13 5 5-17" />
      {kind === 'astronaut' && <path d="M33 58c-7 5-9 11-4 17M25 67l4 8 8-3" />}
    </svg>
  )
}

function Gauge({ label, value, color = 'green' }: { label: string; value: string; color?: string }) {
  return (
    <div className={`telemetry-gauge ${color}`}>
      <p>{label}</p>
      <div className="gauge-arc">
        <span className="gauge-needle" />
        <b>{value}</b>
      </div>
    </div>
  )
}

export default function SpaceGameMenu() {
  const [status, setStatus] = useState('All systems ready')
  const [showMore, setShowMore] = useState(false)
  const [screen, setScreen] = useState<'menu' | 'quick-play' | 'proton-dashboard' | 'astronaut-profile'>('menu')

  return (
    <main className="space-screen">
      <div className="space-photo" aria-hidden="true" />
      <div className="nebula nebula-left" aria-hidden="true" />
      <div className="nebula nebula-right" aria-hidden="true" />
      <div className="star-layer stars-near" aria-hidden="true" />
      <div className="star-layer stars-far" aria-hidden="true" />

      {screen === 'astronaut-profile' ? (
        <AstronautProfile onBack={() => setScreen('quick-play')} />
      ) : screen === 'proton-dashboard' ? (
        <ProtonDashboard onBack={() => setScreen('quick-play')} />
      ) : screen === 'menu' ? (
        <section className="menu-shell" aria-label="Mission Space main menu">
          <div className="top-signal" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <header className="game-title">
            <p className="eyebrow">
              <span />
              Interstellar Command
              <span />
            </p>
            <h1>
              <span className="mission">Mission</span>
              <span className="space">Space</span>
              <span className="beyond">Beyond Earth</span>
            </h1>
            <div className="title-orbit" aria-hidden="true">
              <i />
            </div>
          </header>

          <nav className="mission-grid" aria-label="Choose game mode">
            {missions.map(({ label, detail, icon: Icon }, index) => (
              <button
                className="mission-card"
                key={label}
                type="button"
                onClick={() => {
                  setStatus(detail)
                  if (label === 'Space Station') setScreen('quick-play')
                }}
              >
                <span className="card-index">0{index + 1}</span>
                <span className="corner corner-a" />
                <span className="corner corner-b" />
                <span className="icon-wrap">
                  <Icon className="mode-icon" />
                </span>
                <span className="mode-label">{label}</span>
              </button>
            ))}
          </nav>

          <div className="status" role="status">
            <span className="status-dot" />
            {status}
          </div>

          <button
            className="more-button"
            type="button"
            aria-expanded={showMore}
            onClick={() => setShowMore((current) => !current)}
          >
            <span className="dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            More
          </button>

          {showMore && (
            <div className="more-panel" role="region" aria-label="More options">
              <button type="button" onClick={() => setStatus('Settings selected')}>
                Settings
              </button>
              <span />
              <button type="button" onClick={() => setStatus('Flight records opened')}>
                Records
              </button>
            </div>
          )}

          <footer>
            <span>V.02.24</span>
            <span className="footer-mark">◈</span>
            <span>SECTOR 7G</span>
          </footer>
        </section>
      ) : (
        <section className="quick-play-shell" aria-label="Quick Play missions">
          <header className="quick-header">
            <button className="header-icon back-icon" type="button" aria-label="Back to main menu" onClick={() => setScreen('menu')}>
              <span />
            </button>
            <h1>Space Station</h1>
            <button className="header-icon settings-icon" type="button" aria-label="Settings">
              <span />
            </button>
          </header>

          <div className="quick-layout">
            <div className="mission-panel">
              <div className="launch-grid">
                {launchMissions.map((mission, index) => (
                  <button
                    className="launch-mission"
                    type="button"
                    key={mission.name}
                    onClick={() => {
                      if (mission.name === 'Astronaut Launch') setScreen('astronaut-profile')
                      if (mission.name === 'Proton Launch') setScreen('proton-dashboard')
                    }}
                  >
                    <span className="launch-tile">
                      <MissionGlyph kind={mission.kind} />
                      <b>{index + 1}.</b>
                    </span>
                    <span className="launch-name">{mission.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <aside className="telemetry-panel" aria-label="Mission telemetry">
              <section>
                <Gauge label="Cargo Trade-offs" value="Weight" color="cyan" />
                <div className="trade-lines">
                  <div><span className="cargo-weight" /> <i className="arrow green-arrow" /> <span className="cargo-capacity" /></div>
                  <div><span className="cargo-flask" /> <i className="arrow red-arrow" /> <span className="cargo-capacity" /></div>
                </div>
                <span className="capacity-label">Capacity</span>
              </section>

              <section className="fuel-section">
                <Gauge label="Fuel & Delta-v" value="Fuel" color="cyan" />
                <div className="meter-list">
                  <div><span>F</span><i><b style={{ width: '76%' }} /></i></div>
                  <div><span>V</span><i><b style={{ width: '58%' }} /></i></div>
                  <div><span>D</span><i><b style={{ width: '42%' }} /></i></div>
                </div>
              </section>

              <section className="emergency-section">
                <h2>Emergency<br />Operations</h2>
                <div className="beacons"><span /><span /></div>
                <div className="meter-list emergency-meters">
                  <div className="danger"><span>!</span><i><b style={{ width: '40%' }} /></i></div>
                  <div><span>O</span><i><b style={{ width: '28%' }} /></i></div>
                  <div><span>S</span><i><b style={{ width: '66%' }} /></i></div>
                </div>
              </section>
            </aside>
          </div>
        </section>
      )}
    </main>
  )
}

