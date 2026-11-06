'use client'

import { useState, useMemo, useEffect, useCallback, useRef, type ReactNode } from 'react'

/* ==========================================================================
   WEB AUDIO SYNTHESIZER FOR LEVEL 3 DOCKING OPERATIONS
   ========================================================================== */
class DockingAudio {
  private ctx: AudioContext | null = null

  private init() {
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

  playThrusterPuff() {
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

  playLockChime() {
    this.init()
    if (!this.ctx) return
    try {
      const freqs = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
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

/* ==========================================================================
   SVG ICONS & SUB-COMPONENTS
   ========================================================================== */

function IssIcon() {
  return (
    <svg className="iss-icon" viewBox="0 0 260 150" aria-label="International Space Station" role="img">
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M38 64h70V41h35v23h72v22h-72v23h-35V86H38z" />
        <path d="M72 50V30h18v20M169 50V30h18v20M72 100v20h18v-20M169 100v20h18v-20" />
        <path d="M108 41V18h35v23M108 109v23h35v-23" />
        <path d="M20 50h45v42H20zM195 50h45v42h-45z" />
        <path d="M28 50v42M38 50v42M48 50v42M205 50v42M215 50v42M225 50v42" opacity=".7" />
        <path d="M121 64v22M130 64v22M139 64v22" opacity=".7" />
        <circle cx="130" cy="75" r="13" />
      </g>
    </svg>
  )
}

function CapsuleIcon() {
  return (
    <svg className="capsule-icon" viewBox="0 0 120 100" aria-label="Crew capsule" role="img">
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M24 68c-4-23 6-47 29-58l36 25c10 8 12 22 6 32l-10 16-40 1z" />
        <path d="M53 13l36 25-13 34-40 1" />
        <path d="M40 25l24 16-9 24-24 1M66 41l19 13M55 65l22 14" opacity=".8" />
        <path d="M29 69l-14 13M84 81l14 9" />
        <circle cx="65" cy="40" r="5" />
      </g>
    </svg>
  )
}

function RadarGrid() {
  return (
    <svg className="radar" viewBox="0 0 700 610" aria-hidden="true">
      <g fill="none" stroke="currentColor">
        <circle cx="350" cy="300" r="272" strokeWidth="3" />
        <circle cx="350" cy="300" r="208" strokeWidth="2" />
        <circle cx="350" cy="300" r="151" strokeWidth="3" />
        <circle cx="350" cy="300" r="93" strokeWidth="2" />
        <path d="M350 27v546M77 300h546M157 107l386 386M157 493L543 107" strokeWidth="1.5" opacity=".85" />
        <path
          d="M350 27v20M350 62v15M350 95v20M350 118v20M350 160v20M350 200v20M350 240v20M350 360v20M350 400v20M350 440v20M350 480v20M350 530v20M77 300h20M112 300h20M150 300h20M190 300h20M490 300h20M530 300h20M570 300h20M610 300h20"
          strokeWidth="2"
        />
        <path d="M350 300 L535 152 A238 238 0 0 1 570 247" strokeWidth="1" opacity=".18" />
        <path d="M435 84l15 18-20-3zM530 208l14 14-19-1zM224 456l-4-21 16 11z" fill="currentColor" stroke="none" />
        <path className="radar-sweep" d="M350 300 L350 28" />
      </g>
    </svg>
  )
}

function ExplanationCard({
  title,
  children,
  className = '',
}: {
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`explanation-card ${className}`} role="tooltip">
      <strong>{title}</strong>
      <p>{children}</p>
    </div>
  )
}

function EmergencyModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="emergency-modal" role="alertdialog" aria-modal="true" aria-labelledby="timeout-title">
      <div className="emergency-frame">
        <button className="emergency-close" onClick={onClose} aria-label="Close emergency warning">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
        <h2 id="timeout-title">🚨 MISSION TIMEOUT WARNING</h2>
        <div className="emergency-rule" />
        <ul className="emergency-copy">
          <li>Alert! You have pressed the thrusters excessively.</li>
          <li>
            Rapid maneuvering has created kinetic drift, causing the capsule to tilt out of alignment and plunge
            remaining Thruster Fuel to a critical level.
          </li>
          <li>Crew Stress is Elevated at 65%. Prolonged zero-gravity drift is inducing deep astronaut fatigue.</li>
        </ul>
        <div className="flight-tip">
          <strong>🚀 CAPTAIN&apos;S FLIGHT TIP</strong>
          <p>
            Stop spamming the direction controls! Tap the opposite direction button exactly ONCE to counter your orbital
            momentum, stabilize the alignment vector, and slide into the core target lock before your energy levels hit
            zero.
          </p>
        </div>
      </div>
    </div>
  )
}

/* ==========================================================================
   MAIN COMPONENT: SPACE STATION DOCKING (LEVEL 3)
   ========================================================================== */
interface SpaceStationDockingProps {
  onBack?: () => void
}

export default function SpaceStationDocking({ onBack }: SpaceStationDockingProps) {
  const [fuel, setFuel] = useState(74)
  const [thrustInputs, setThrustInputs] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [showEmergency, setShowEmergency] = useState(false)
  const [capsulePos, setCapsulePos] = useState({ x: 35, y: -12 })

  const audioRef = useRef<DockingAudio | null>(null)

  useEffect(() => {
    audioRef.current = new DockingAudio()
  }, [])

  // Fuel bar color logic
  const meterFillColor = useMemo(() => {
    if (fuel < 35) return '#f04435'
    if (fuel < 55) return '#ff9d3d'
    return '#ff793f'
  }, [fuel])

  // Check if capsule is within docking zone target
  const isAligned = useMemo(() => {
    return Math.abs(capsulePos.x) <= 22 && Math.abs(capsulePos.y) <= 18
  }, [capsulePos])

  // Move capsule and consume fuel
  const fireThruster = useCallback(
    (dx: number, dy: number) => {
      if (fuel <= 0 || isLocked) return

      audioRef.current?.playThrusterPuff()

      setFuel((prev) => {
        const nextFuel = Math.max(0, prev - 1)
        if (nextFuel === 25) {
          setShowEmergency(true)
          audioRef.current?.playAlarmBeep()
        }
        return nextFuel
      })

      setThrustInputs((prev) => {
        const next = prev + 1
        if (next === 45) {
          setShowEmergency(true)
          audioRef.current?.playAlarmBeep()
        }
        return next
      })

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
      if (isLocked) return
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
  }, [fireThruster, isLocked])

  // Handle Engage Automated Lock
  const handleLockClick = () => {
    if (isLocked) return

    if (isAligned) {
      audioRef.current?.playLockChime()
      setIsLocked(true)
      setCapsulePos({ x: 0, y: 0 })
    } else {
      audioRef.current?.playAlarmBeep()
      // Gently guide the user
      alert('ALIGNMENT REQUIRED: Maneuver your capsule into the central green DESIRED DOCKING ZONE before engaging the lock!')
    }
  }

  // Reset simulator
  const handleReset = () => {
    setFuel(74)
    setThrustInputs(0)
    setIsLocked(false)
    setShowEmergency(false)
    setCapsulePos({ x: 35, y: -12 })
  }

  return (
    <main className="docking-mission-shell">
      {/* Header Bar */}
      <header className="mission-header">
        <h1>Level 3: Space Station Docking</h1>
        <div className="window-controls" aria-hidden="true">
          <button type="button" onClick={handleReset} title="Reset Simulation">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => onBack?.()}
            title="Return to Space Station Mission Hub"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Layout Grid */}
      <div className="mission-layout">
        {/* Left: Interactive Docking Simulator Panel */}
        <section className="simulator-panel" aria-label="Live docking simulator">
          {/* Background Stars & Moon */}
          <div className="star star-one" />
          <div className="star star-two" />
          <div className="star star-three" />
          <div className="planet" />

          {/* Radar Navigation Target */}
          <div className="explanation-target radar-target">
            <RadarGrid />

            {/* Central Target Docking Zone */}
            <div className="docking-zone" tabIndex={0} aria-label="Desired docking zone">
              <span>DESIRED DOCKING ZONE</span>
              <ExplanationCard title="WHY DO STATIONS DOCK?" className="docking-explanation">
                Stations dock during missions to transfer astronauts, supplies, fuel, and science equipment safely. A
                precise connection also creates a stable airlock between spacecraft.
              </ExplanationCard>
            </div>

            <ExplanationCard title="🎯 RADAR NAVIGATION">
              This is your docking zone. The Space Station is locked in the center. Use the arrow keys or buttons to pilot
              your capsule towards it. Move slowly to avoid crashing!
            </ExplanationCard>
          </div>

          {/* Locked Space Station (ISS) in Center */}
          <div className="iss-node">
            <IssIcon />
            <span className="node-label">ISS {'//'} TARGET LOCK</span>
          </div>

          {/* Crew Capsule with Thruster Directional Controls */}
          <div
            className={`capsule-node ${isAligned ? 'aligned-capsule' : ''}`}
            style={{
              transform: `translate(${capsulePos.x}px, ${capsulePos.y}px)`,
            }}
          >
            <CapsuleIcon />
            <div className="thruster-controls">
              <button
                type="button"
                onClick={() => fireThruster(0, -7)}
                aria-label="Thrust up"
                disabled={isLocked || fuel <= 0}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m18 15-6-6-6 6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => fireThruster(-7, 0)}
                aria-label="Thrust left"
                disabled={isLocked || fuel <= 0}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => fireThruster(7, 0)}
                aria-label="Thrust right"
                disabled={isLocked || fuel <= 0}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => fireThruster(0, 7)}
                aria-label="Thrust down"
                disabled={isLocked || fuel <= 0}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </div>
          </div>

          {/* System Diagnostics Overlay */}
          <div className="diagnostic-card">
            <div className="card-kicker">STATUS ALERT {'//'} SYSTEM DIAGNOSTICS</div>
            <div className="card-rule" />
            <p>| &nbsp;{isLocked ? 'DOCKING COMPLETED // HATCHES SEALED.' : 'DOCKING PROCEDURE ACTIVE.'}</p>
            <p>
              CONTROLS: USE THRUSTERS
              <br />
              CAREFULLY! EVERY ADDITIONAL
              <br />
              MOVEMENT CONSUMES CRITICAL FUEL &amp;
              <br />
              DELTA-V RESERVES.
            </p>
          </div>

          {/* Simulator Real-Time Status */}
          <div className="simulator-status">
            THRUST INPUTS: {thrustInputs} <span>{'//'}</span> VECTOR CORRECTION{' '}
            {isLocked ? 'LOCKED' : isAligned ? 'OPTIMAL' : thrustInputs ? 'ACTIVE' : 'STANDBY'}
          </div>

          {/* Emergency Alert Modal */}
          {showEmergency && <EmergencyModal onClose={() => setShowEmergency(false)} />}
        </section>

        {/* Right: Mission Telemetry Sidebar */}
        <aside className="docking-telemetry-panel" aria-label="Mission overview telemetry">
          {/* Card 1: Thruster Fuel */}
          <section className="telemetry-card fuel-card">
            <h2>MISSION OVERVIEW {'//'} TELEMETRY</h2>
            <div className="telemetry-rule" />
            <div className="meter-heading">
              <span>THRUSTER FUEL</span>
              <strong>{fuel}%</strong>
            </div>

            <div className="explanation-target fuel-target">
              <div className="meter">
                <div
                  className="meter-fill"
                  style={{
                    width: `${fuel}%`,
                    backgroundColor: meterFillColor,
                  }}
                />
              </div>
              <ExplanationCard title="🔋 ENERGY RESERVES">
                Every arrow click fires your rocket boosters and burns fuel! If your fuel hits 0%, the capsule will float
                away helplessly in dark space, causing a mission failure.
              </ExplanationCard>
            </div>
            <p>
              FUEL: <b>{fuel}%</b> / CONSUMPTION: <em>+0.05 units/s</em>
            </p>
          </section>

          <div className="sidebar-dashes">--</div>

          {/* Card 2: NASA OSDR Health Data */}
          <section className="telemetry-card health-card">
            <h2>NASA OSDR: CREW HEALTH DATA</h2>
            <div className="explanation-target health-target">
              <div className="inner-health">
                <ExplanationCard title="🔬 NASA OSDR HEALTH REPORT">
                  NASA OSDR biological research shows that long exposure to microgravity (zero-g) weakens muscles and
                  bones! The faster you complete the docking, the safer your astronauts remain.
                </ExplanationCard>
                <div className="meter-heading">
                  <span>MICROGRAVITY STRESS INDEX</span>
                  <strong>65%</strong>
                </div>
                <div className="meter">
                  <div className="meter-fill stress-fill" style={{ width: '65%' }} />
                </div>
                <p>
                  STRESS: <b>65%</b> / LEVEL: <strong>ELEVATED</strong>
                </p>
                <div className="warning-copy">
                  WARNING: EXTENDED EXPOSURE |
                  <br />
                  NASA OSDR FACT: LONG MICROGRAVITY
                  <br />
                  EXPOSURE CAUSES MUSCLE FATIGUE.
                  <br />
                  COMPLETE DOCKING BEFORE CREW
                  <br />
                  STAMINA DROPS TO ZERO!
                </div>
              </div>
            </div>
          </section>

          {/* Card 3: Science Tip */}
          <section className="science-tip-card" aria-labelledby="science-tip-title">
            <h2 id="science-tip-title">SCIENCE TIP {'//'} WHAT IS DOCKING?</h2>
            <p>
              Docking is the careful connection of two spacecraft in orbit. Their ports must meet at a matching speed and
              angle so crew, supplies, and air can pass safely between them.
            </p>
          </section>
        </aside>
      </div>

      {/* Bottom Action: Engage Automated Lock */}
      <div className="explanation-target lock-target">
        <button
          type="button"
          className={`lock-button ${isLocked ? 'locked' : ''}`}
          onClick={handleLockClick}
        >
          {isLocked ? 'AUTOMATED LOCK ENGAGED' : 'ENGAGE AUTOMATED LOCK'}
        </button>
        <ExplanationCard title="🔒 FINAL AIRLOCK SECURE">
          Only press this button when your capsule is perfectly aligned inside the central green targeting box. It locks
          the docking hatches airtight to save the crew!
        </ExplanationCard>
      </div>
    </main>
  )
}
