'use client'

import React, { useState } from 'react'

function HelmetGraphic() {
  return (
    <svg viewBox="0 0 120 120" role="img" aria-label="Astronaut helmet profile">
      <defs>
        <linearGradient id="helmetShell" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#efffff" />
          <stop offset="1" stopColor="#8ce7ea" />
        </linearGradient>
        <linearGradient id="helmetVisor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#123343" />
          <stop offset="1" stopColor="#020a13" />
        </linearGradient>
      </defs>
      <path className="helmet-shell" d="M24 77V53C24 28 39 14 60 14s36 14 36 39v24c0 17-16 29-36 29S24 94 24 77Z" />
      <path className="helmet-visor" d="M34 58c0-19 10-29 26-29s26 10 26 29c0 20-8 32-26 32S34 78 34 58Z" />
      <path className="helmet-shine" d="M42 57c1-11 6-18 17-20" />
      <path className="helmet-rim" d="M30 82c8 12 18 17 30 17s22-5 30-17M44 103v7h32v-7" />
      <path className="helmet-side" d="M24 48H14v27h10M96 48h10v27H96M18 53h6M18 63h6M96 53h6M96 63h6" />
      <circle cx="52" cy="98" r="2" /><circle cx="60" cy="99" r="2" /><circle cx="68" cy="98" r="2" />
    </svg>
  )
}

export default function AstronautProfile({ onBack }: { onBack: () => void }) {
  const [cargo, setCargo] = useState(56)
  const [fuel, setFuel] = useState(74)
  const [shieldOn, setShieldOn] = useState(true)
  const [donkiHovered, setDonkiHovered] = useState(false)
  const [donkiPinned, setDonkiPinned] = useState(false)
  const [status, setStatus] = useState('SYSTEMS READY')

  return (
    <section className="astronaut-frame" aria-label="Astronaut Profile Dashboard">
      <header className="astronaut-header">
        <button className="astronaut-header-button astronaut-back" type="button" aria-label="Back to missions" onClick={onBack}>
          <span />
        </button>
        <div>
          <p>MISSION 01 · CREW ORIENTATION</p>
          <h1>Astronaut Launch</h1>
        </div>
        <button className="astronaut-header-button astronaut-settings" type="button" aria-label="Profile settings">
          <span />
        </button>
      </header>

      <main className="astronaut-modules">
        <section className="identity-card bevel-card">
          <div className="module-heading">
            <span>01</span>
            <h2>Astronaut Identity Card</h2>
          </div>

          <dl className="identity-metadata">
            <div><dt>Team Name:</dt><dd>ORBITAL-7</dd></div>
            <div><dt>Assigned Astronaut:</dt><dd>A. VEGA</dd></div>
            <div><dt>Astronaut Profile:</dt><dd>COMMAND PILOT</dd></div>
          </dl>

          <div className="profile-row">
            <div className="profile-slot"><HelmetGraphic /></div>
            <div className="member-data">
              <span>MEMBER SINCE</span>
              <b>MISSION DAY 001</b>
              <i />
              <small>CLEARANCE</small>
              <strong>LEVEL 04</strong>
            </div>
          </div>

          <div className="mission-progress">
            <div className="progress-label">
              <span>MISSION PROGRESS</span>
              <b>30 - 100</b>
            </div>
            <div className="progress-track"><i /></div>
          </div>
        </section>

        <section className="resource-card bevel-card">
          <div className="module-heading">
            <span>02</span>
            <h2>Resource Monitor</h2>
          </div>

          <div className="resource-widget">
            <div className="resource-title">
              <span className="weight-symbol" />
              <div><small>CARGO SYSTEM</small><h3>Cargo Weight vs Capacity</h3></div>
              <b>{cargo}%</b>
            </div>
            <input
              aria-label="Cargo weight versus capacity"
              type="range"
              min="0"
              max="100"
              value={cargo}
              onChange={(event) => setCargo(Number(event.target.value))}
              style={{ '--value': `${cargo}%` } as React.CSSProperties}
            />
            <div className="range-labels"><span>0</span><span>UNIT</span><span>SAFE</span></div>
          </div>

          <div className="resource-divider" />

          <div className="resource-widget fuel-widget">
            <div className="resource-title">
              <span className="battery-symbol"><i /></span>
              <div><small>PROPULSION SYSTEM</small><h3>Fuel Allocation &amp; Delta-V</h3></div>
              <b>{fuel}%</b>
            </div>
            <input
              aria-label="Fuel allocation and Delta-V"
              type="range"
              min="0"
              max="100"
              value={fuel}
              onChange={(event) => setFuel(Number(event.target.value))}
              style={{ '--value': `${fuel}%` } as React.CSSProperties}
            />
            <div className="range-labels"><span>EMPTY</span><span>DELTA-V</span><span>FULL</span></div>
          </div>

          <section
            className={`space-weather-card ${shieldOn ? 'shield-on' : 'shield-off'}`}
            aria-label="NASA DONKI Space Weather Monitor"
            onPointerEnter={(event) => {
              if (event.pointerType === 'mouse') setDonkiHovered(true)
            }}
            onPointerLeave={() => setDonkiHovered(false)}
            onClick={(event) => {
              if (!(event.target as HTMLElement).closest('button, .donki-explanation')) {
                setDonkiPinned((open) => !open)
              }
            }}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                setDonkiHovered(false)
                setDonkiPinned(false)
              }
            }}
          >
            <div className="space-weather-header">
              <h3>⚡ Space Weather Report</h3>
              <span className="weather-alert-light" aria-label={shieldOn ? 'Shielding operational' : 'Active radiation alert'} />
            </div>
            <button
              className="donki-help-trigger"
              type="button"
              aria-expanded={donkiHovered || donkiPinned}
              aria-controls="donki-explanation"
              onClick={() => {
                setDonkiHovered(false)
                setDonkiPinned((open) => !open)
              }}
            >
              What is NASA DONKI?
            </button>
            <div className="space-weather-data">
              <p>Solar Activity Index: <strong>High (X-Class Flare)</strong></p>
              <p className="weather-state">
                {shieldOn ? <>Status: <em>Shielding Operational</em></> : <>Deflection Status: <b>REQUIRED</b></>}
              </p>
            </div>

            <button
              className="shield-toggle"
              type="button"
              aria-pressed={shieldOn}
              onClick={() => setShieldOn((active) => !active)}
            >
              <span><i /></span>
              EM Shield
              <b>{shieldOn ? 'ACTIVE' : 'INACTIVE'}</b>
            </button>

            <div className="power-meter">
              <div className="tradeoff-label">
                <span>Power &amp; Battery Meter</span>
                <b>{shieldOn ? '20%' : '85%'}</b>
              </div>
              <div className="power-track"><i style={{ width: shieldOn ? '20%' : '85%' }} /></div>
              {shieldOn && <strong className="shield-drain">−40% Shield Drain</strong>}
            </div>

            <div className="tradeoff-modules">
              <div className={`greenhouse-module ${shieldOn ? 'offline' : 'online'}`}>
                <span className="greenhouse-icon"><i /><i /><i /></span>
                <small>Hydroponic Greenhouse</small>
                <b>{shieldOn ? 'OFFLINE: Power Diverted' : 'ACTIVE: Growth Nominal'}</b>
              </div>
              <div className={`health-module ${shieldOn ? 'safe' : 'critical'}`}>
                <span className="health-pulse" />
                <small>Astronaut Health</small>
                <strong>{shieldOn ? '100%' : '25%'}</strong>
                <b>{shieldOn ? 'SAFE' : '⚠️ RADIATION TOXICITY DETECTED'}</b>
              </div>
            </div>
            <div
              id="donki-explanation"
              className={`donki-explanation ${donkiHovered || donkiPinned ? 'is-open' : ''}`}
              role="dialog"
              aria-labelledby="donki-explanation-title"
              aria-hidden={!(donkiHovered || donkiPinned)}
              inert={!(donkiHovered || donkiPinned)}
            >
              <div className="donki-explanation-heading">
                <h4 id="donki-explanation-title">☀️ WHAT IS NASA DONKI?</h4>
                <button
                  type="button"
                  aria-label="Close NASA DONKI explanation"
                  onClick={() => {
                    setDonkiHovered(false)
                    setDonkiPinned(false)
                  }}
                >×</button>
              </div>
              <p>
                DONKI is NASA&apos;s real space weather tracker! It monitors massive solar storms and radiation
                blasting from the Sun. When it says &apos;REQUIRED&apos;, a solar flare is heading your way! You must
                turn on your EM Shield to protect your astronauts, or they will get sick from radiation.
              </p>
              <p className="donki-tradeoff">
                ⚠️ Shield ON = -40% Power Supply | Shield OFF = Heavy Crew Damage
              </p>
            </div>
          </section>
        </section>
      </main>

      <div className="protocol-status" role="status">
        <span className={status === 'SYSTEMS READY' ? 'ready' : ''} />
        {status}
      </div>
      <button
        className="launch-protocol"
        type="button"
        onClick={() => setStatus(cargo <= 78 && fuel >= 65 ? 'PROTOCOL ACCEPTED' : 'ADJUST RESOURCES')}
      >
        <span>Launch Protocol</span>
        <i />
      </button>
    </section>
  )
}
