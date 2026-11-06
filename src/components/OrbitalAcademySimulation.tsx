'use client'

import React, { useState, useEffect } from 'react'

interface OrbitalAcademySimulationProps {
  initialMode?: 'stable' | 'unstable'
  onSelectLesson?: (lesson: 'stable' | 'unstable') => void
}

export default function OrbitalAcademySimulation({
  initialMode = 'stable',
  onSelectLesson,
}: OrbitalAcademySimulationProps) {
  const [mode, setMode] = useState<'stable' | 'unstable'>(initialMode)
  const [prevPropMode, setPrevPropMode] = useState(initialMode)
  const [velocity, setVelocity] = useState(initialMode === 'unstable' ? 5.8 : 7.8)
  const [showVectors, setShowVectors] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const [orbitAngle, setOrbitAngle] = useState(316)

  // Sync mode if initialMode prop changes (React pattern: adjust state during render)
  if (prevPropMode !== initialMode) {
    setPrevPropMode(initialMode)
    setMode(initialMode)
    setVelocity(initialMode === 'unstable' ? 5.8 : 7.8)
  }

  // Orbital physics simulation loop
  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setOrbitAngle((prev) => (prev + velocity * 0.35) % 360)
    }, 30)
    return () => clearInterval(interval)
  }, [isPlaying, velocity])

  const handleModeChange = (newMode: 'stable' | 'unstable') => {
    setMode(newMode)
    setVelocity(newMode === 'stable' ? 7.8 : 5.8)
    if (onSelectLesson) onSelectLesson(newMode)
  }

  // Calculate dynamic orbital radius based on velocity
  // 7.8 km/s is perfectly stable at 220px radius (440px diameter)
  const isStable = Math.abs(velocity - 7.8) < 0.3
  const isDecaying = velocity < 7.5
  const currentRadius = isStable ? 220 : Math.max(110, Math.min(270, 110 + (velocity - 4.5) * 35))

  return (
    <div className="orbital-academy-viewport">
      {/* Background Star Field */}
      <div className="academy-stars" aria-hidden="true">
        <span style={{ top: '12%', left: '18%', opacity: 0.7 }} />
        <span style={{ top: '25%', left: '82%', opacity: 0.6 }} />
        <span style={{ top: '38%', left: '12%', opacity: 0.4 }} />
        <span style={{ top: '55%', left: '90%', opacity: 0.8 }} />
        <span style={{ top: '72%', left: '22%', opacity: 0.5 }} />
        <span style={{ top: '80%', left: '75%', opacity: 0.7 }} />
        <span style={{ top: '15%', left: '60%', opacity: 0.6 }} />
        <span style={{ top: '65%', left: '35%', opacity: 0.4 }} />
        <span style={{ top: '88%', left: '48%', opacity: 0.75 }} />
        <span style={{ top: '30%', left: '38%', opacity: 0.5 }} />
        <span style={{ top: '45%', left: '70%', opacity: 0.65 }} />
      </div>

      {/* Lesson Header */}
      <header className="academy-header">
        <p className="academy-kicker">
          ORBITAL ACADEMY / {mode === 'stable' ? 'STABLE ORBITS' : 'UNSTABLE ORBITS'}
        </p>
        <h1>
          {mode === 'stable'
            ? 'How a Stable Orbit is Made'
            : 'Unstable Orbits & Orbital Decay'}
        </h1>
      </header>

      {/* Mode & Physics Switcher Toolbar */}
      <div className="academy-controls-bar">
        <div className="mode-toggle-group" role="group" aria-label="Orbit Mode">
          <button
            type="button"
            className={`academy-btn ${mode === 'stable' ? 'active' : ''}`}
            onClick={() => handleModeChange('stable')}
          >
            Stable Orbit (7.8 km/s)
          </button>
          <button
            type="button"
            className={`academy-btn ${mode === 'unstable' ? 'active' : ''}`}
            onClick={() => handleModeChange('unstable')}
          >
            Unstable Orbit (Decay)
          </button>
        </div>

        <div className="academy-velocity-slider">
          <label htmlFor="orbit-velocity">
            VELOCITY: <b>{velocity.toFixed(1)} km/s</b>{' '}
            <span className={`velocity-tag ${isStable ? 'stable' : isDecaying ? 'danger' : 'warning'}`}>
              {isStable ? 'BALANCED' : isDecaying ? 'GRAVITY OVERCOMING' : 'EXCESS INERTIA'}
            </span>
          </label>
          <input
            id="orbit-velocity"
            type="range"
            min="4.5"
            max="10.5"
            step="0.1"
            value={velocity}
            onChange={(e) => {
              const val = parseFloat(e.target.value)
              setVelocity(val)
              setMode(Math.abs(val - 7.8) < 0.3 ? 'stable' : 'unstable')
            }}
          />
        </div>

        <div className="academy-actions">
          <button
            type="button"
            className={`tool-btn ${showVectors ? 'active' : ''}`}
            onClick={() => setShowVectors(!showVectors)}
            title="Toggle Force Vectors"
          >
            {showVectors ? 'Hide Vectors' : 'Show Vectors'}
          </button>
          <button
            type="button"
            className="tool-btn"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? 'Pause' : 'Resume'}
          </button>
          <button
            type="button"
            className="tool-btn reset-btn"
            onClick={() => {
              setVelocity(7.8)
              setMode('stable')
            }}
          >
            Reset (7.8)
          </button>
        </div>
      </div>

      {/* Main Simulation Viewport */}
      <div className="orbital-simulation-stage">
        {/* Earth-Centered Orbital System */}
        <div className="orbital-system-container">
          {/* Stable Orbit Pathway Guide Circle */}
          <div
            className={`orbit-pathway-ring ${isStable ? 'stable-ring' : 'unstable-ring'}`}
            style={{
              width: `${currentRadius * 2}px`,
              height: `${currentRadius * 2}px`,
            }}
          />

          {/* Decaying Spiral Trail in Unstable Mode */}
          {isDecaying && (
            <svg
              className="decay-trail-svg"
              viewBox="0 0 500 500"
              aria-hidden="true"
            >
              <path
                d="M 250 30 C 370 30, 470 130, 470 250 C 470 350, 380 430, 270 430 C 180 430, 110 360, 110 270 C 110 190, 170 140, 240 140 C 290 140, 330 180, 330 230"
                fill="none"
                stroke="rgba(244, 91, 79, 0.45)"
                strokeWidth="2"
                strokeDasharray="4 6"
              />
            </svg>
          )}

          {/* Central Realistic Earth Globe */}
          <div className="academy-earth-globe" aria-label="Planet Earth">
            {/* 7 Continent Relief Layers */}
            <div className="continent continent-1" />
            <div className="continent continent-2" />
            <div className="continent continent-3" />
            <div className="continent continent-4" />
            <div className="continent continent-5" />
            <div className="continent continent-6" />
            <div className="continent continent-7" />

            {/* High altitude cloud systems */}
            <div className="cloud-band cloud-band-north" />
            <div className="cloud-band cloud-band-south" />

            {/* Atmosphere Rim and Night Shading */}
            <div className="atmosphere-shadow" />
          </div>

          {/* Rotating Axis & Satellite */}
          <div
            className="satellite-rotation-axis"
            style={{
              transform: `rotate(${orbitAngle}deg)`,
            }}
          >
            <div
              className="satellite-container"
              style={{
                transform: `translateY(-${currentRadius}px)`,
              }}
            >
              {/* Port Solar Array */}
              <div className="solar-array port-array">
                <span className="cell-divider" />
                <span className="cell-divider" />
                <span className="cell-divider" />
                <span className="cell-divider" />
              </div>

              {/* Insulated Satellite Bus Core */}
              <div className="satellite-bus">
                <span className="bus-dish" />
                <span className="bus-antenna" />
              </div>

              {/* Starboard Solar Array */}
              <div className="solar-array starboard-array">
                <span className="cell-divider" />
                <span className="cell-divider" />
                <span className="cell-divider" />
                <span className="cell-divider" />
              </div>

              {/* Force Vectors Visualizer */}
              {showVectors && (
                <div className="vector-overlays">
                  {/* Forward Velocity Vector (Tangent) */}
                  <div
                    className="velocity-vector-arrow"
                    style={{ width: `${Math.max(30, velocity * 8)}px` }}
                    title={`Forward Velocity: ${velocity.toFixed(1)} km/s`}
                  >
                    <span>Velocity {velocity.toFixed(1)} km/s</span>
                  </div>

                  {/* Earth Gravity Vector (Radial toward center) */}
                  <div
                    className="gravity-vector-arrow"
                    title="Earth Gravity Vector"
                  >
                    <span>Gravity 9.8 m/s²</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Card: "How an orbit is made" */}
        <aside className="academy-info-card" aria-label="Orbital mechanics explanation">
          <h2>🛸 HOW AN ORBIT IS MADE</h2>
          <p>
            An <strong>orbit</strong> is a continuous <strong>falling balancing act</strong>!
            Earth&apos;s <strong>gravity</strong> is constantly pulling the satellite down toward Earth,
            but it is moving sideways with forward <strong>speed (velocity)</strong> so fast that it keeps
            missing the planet.
          </p>
          <p className="mt-2 text-xs text-orange-200/80">
            {isStable
              ? '✨ PERFECT BALANCE: Forward velocity matches gravitational pull exactly, sustaining a permanent circular orbit.'
              : isDecaying
              ? '⚠️ VELOCITY TOO LOW: Forward momentum cannot overcome gravity. Inward atmospheric decay will occur!'
              : '🚀 VELOCITY TOO HIGH: Forward speed exceeds circular threshold, stretching into an elliptical escape arc!'}
          </p>
        </aside>

        {/* Science Tip HUD */}
        <aside className="academy-science-tip-hud" aria-label="Science Tip HUD">
          <h3>SCIENCE TIP</h3>
          <p>
            {isStable
              ? 'A stable orbit happens when forward velocity matches Earth’s gravity perfectly! The satellite falls towards Earth but never hits it.'
              : isDecaying
              ? 'When forward velocity drops below 7.8 km/s, Earth’s gravity pulls the craft inward faster than it moves forward. The orbit decays into a spiral!'
              : 'At velocities above 7.9 km/s, centrifugal inertia pulls the spacecraft further from Earth into an eccentric elliptical path.'}
          </p>
        </aside>
      </div>
    </div>
  )
}

