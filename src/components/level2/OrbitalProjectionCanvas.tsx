'use client'

import React, { useRef, useEffect, useCallback } from 'react'
import {
  Vector2,
  SimOutcome,
  EARTH_RADIUS_KM,
  getInitialRadius,
} from '@/lib/orbit-physics'

interface OrbitalProjectionCanvasProps {
  altitude: number
  thrustPct: number
  stateLabel: 'AIMING' | 'BURNING' | 'IN FLIGHT' | 'VECTOR LOCKED' | 'FAILED'
  predictedPoints?: Vector2[]
  actualPoints?: Vector2[]
  currentShipPos?: Vector2 | null
  currentShipVel?: Vector2 | null
  periapsis?: number
  apoapsis?: number
  outcome?: SimOutcome
  isSimulating?: boolean
}

export default function OrbitalProjectionCanvas({
  altitude,
  thrustPct,
  stateLabel,
  predictedPoints = [],
  actualPoints = [],
  currentShipPos = null,
  currentShipVel = null,
  periapsis,
  apoapsis,
  outcome,
  isSimulating = false,
}: OrbitalProjectionCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Coordinate transformation: normalized physics coords -> canvas screen pixels
  const transformCoord = useCallback(
    (
      pt: Vector2,
      cx: number,
      cy: number,
      planetRadiusPx: number,
      baseAltPx: number
    ): { x: number; y: number } => {
      const r = Math.hypot(pt.x, pt.y)
      if (r < 0.0001) return { x: cx, y: cy }

      const unitX = pt.x / r
      const unitY = pt.y / r

      // Calibrated visual radial scaling so 500km has 28px clearance from planet
      const r0At500 = getInitialRadius(500)
      const visualRadius = planetRadiusPx + ((r - 1) / (r0At500 - 1)) * baseAltPx

      const clampedRadius = Math.max(0, visualRadius)
      return {
        x: cx + clampedRadius * unitX,
        y: cy - clampedRadius * unitY, // Canvas y is downward
      }
    },
    []
  )

  // Main Render Routine
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const dpr = typeof window !== 'undefined' ? Math.max(1, window.devicePixelRatio || 1) : 1
    const rect = container.getBoundingClientRect()
    const width = Math.max(280, Math.floor(rect.width))
    const height = Math.max(160, Math.floor(rect.height - 27)) // subtract 27px header

    canvas.width = Math.floor(width * dpr)
    canvas.height = Math.floor(height * dpr)
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.save()
    ctx.scale(dpr, dpr)

    // Clear background
    ctx.clearRect(0, 0, width, height)

    // Center of planet coordinate system
    // Shifted slightly down-left for an authentic aerospace radar HUD look
    const cx = Math.floor(width * 0.44)
    const cy = Math.floor(height * 0.52)
    const planetRadiusPx = Math.floor(Math.min(width, height) * 0.22)
    const baseAltPx = Math.floor(planetRadiusPx * 0.65)

    // 1. Draw Faint Background Grid
    ctx.strokeStyle = 'rgba(192, 104, 52, 0.08)'
    ctx.lineWidth = 1
    const gridSize = 24
    ctx.beginPath()
    for (let x = 0; x < width; x += gridSize) {
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
    }
    ctx.stroke()

    // 2. Draw Wireframe Planet
    // Outer glow
    const planetGlow = ctx.createRadialGradient(cx, cy, planetRadiusPx * 0.7, cx, cy, planetRadiusPx * 1.3)
    planetGlow.addColorStop(0, 'rgba(192, 104, 52, 0.09)')
    planetGlow.addColorStop(0.8, 'rgba(106, 58, 45, 0.04)')
    planetGlow.addColorStop(1, 'transparent')
    ctx.fillStyle = planetGlow
    ctx.beginPath()
    ctx.arc(cx, cy, planetRadiusPx * 1.3, 0, Math.PI * 2)
    ctx.fill()

    // Planet body
    ctx.beginPath()
    ctx.arc(cx, cy, planetRadiusPx, 0, Math.PI * 2)
    ctx.fillStyle = '#170c0a'
    ctx.fill()
    ctx.strokeStyle = '#8a482d'
    ctx.lineWidth = 1.5
    ctx.stroke()

    // Planet equator & latitude line
    ctx.beginPath()
    ctx.ellipse(cx, cy, planetRadiusPx, planetRadiusPx * 0.35, -0.2, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(192, 104, 52, 0.22)'
    ctx.lineWidth = 1
    ctx.stroke()

    // Planet center tick
    ctx.strokeStyle = 'rgba(192, 104, 52, 0.4)'
    ctx.beginPath()
    ctx.moveTo(cx - 5, cy)
    ctx.lineTo(cx + 5, cy)
    ctx.moveTo(cx, cy - 5)
    ctx.lineTo(cx, cy + 5)
    ctx.stroke()

    // 3. Draw Predicted Trajectory (Dashed)
    if (predictedPoints.length > 1) {
      ctx.save()
      ctx.beginPath()
      ctx.setLineDash([4, 4])
      ctx.strokeStyle = outcome === 'CRASH' ? 'rgba(235, 87, 87, 0.65)' : 'rgba(212, 118, 62, 0.55)'
      ctx.lineWidth = 1.5

      const start = transformCoord(predictedPoints[0], cx, cy, planetRadiusPx, baseAltPx)
      ctx.moveTo(start.x, start.y)

      for (let i = 1; i < predictedPoints.length; i++) {
        const pt = transformCoord(predictedPoints[i], cx, cy, planetRadiusPx, baseAltPx)
        ctx.lineTo(pt.x, pt.y)
      }
      ctx.stroke()
      ctx.restore()
    }

    // 4. Draw Actual Path (Solid copper with fading tail)
    if (actualPoints.length > 1) {
      const len = actualPoints.length
      // Draw tail with gradient alpha
      const segmentSize = Math.max(1, Math.floor(len / 12))

      for (let s = 0; s < len - 1; s += segmentSize) {
        const endIdx = Math.min(len - 1, s + segmentSize)
        const alpha = 0.25 + 0.75 * (s / len)

        ctx.save()
        ctx.beginPath()
        ctx.strokeStyle = `rgba(240, 176, 124, ${alpha.toFixed(2)})`
        ctx.lineWidth = 2
        ctx.shadowColor = '#dc7039'
        ctx.shadowBlur = 6

        const p0 = transformCoord(actualPoints[s], cx, cy, planetRadiusPx, baseAltPx)
        ctx.moveTo(p0.x, p0.y)

        for (let i = s + 1; i <= endIdx; i++) {
          const pt = transformCoord(actualPoints[i], cx, cy, planetRadiusPx, baseAltPx)
          ctx.lineTo(pt.x, pt.y)
        }
        ctx.stroke()
        ctx.restore()
      }
    }

    // 5. Draw Apoapsis and Periapsis Markers
    if (apoapsis !== undefined && periapsis !== undefined && (actualPoints.length > 0 || predictedPoints.length > 0)) {
      const apKm = Math.round((apoapsis - 1) * EARTH_RADIUS_KM)
      const peKm = Math.round((periapsis - 1) * EARTH_RADIUS_KM)

      // Only draw if values are reasonable
      if (apKm > 0 && apKm < 20000) {
        ctx.save()
        ctx.font = '700 8px monospace'
        ctx.fillStyle = '#ed9255'

        // Ap marker text
        ctx.fillText(`AP ${apKm} KM`, 10, height - 12)
        if (peKm > -1000) {
          ctx.fillText(`PE ${peKm} KM`, 85, height - 12)
        }
        ctx.restore()
      }
    }

    // 6. Draw Spacecraft Icon
    const shipPt = currentShipPos || (actualPoints.length > 0 ? actualPoints[actualPoints.length - 1] : predictedPoints[0])
    if (shipPt) {
      const shipScreen = transformCoord(shipPt, cx, cy, planetRadiusPx, baseAltPx)

      // Calculate ship heading angle from velocity or tangent
      let angle = 0
      if (currentShipVel && (currentShipVel.x !== 0 || currentShipVel.y !== 0)) {
        angle = Math.atan2(-currentShipVel.y, currentShipVel.x)
      } else {
        // Tangent to radius vector
        angle = Math.atan2(shipPt.x, -shipPt.y)
      }

      ctx.save()
      ctx.translate(shipScreen.x, shipScreen.y)
      ctx.rotate(angle)

      // Thruster plume if BURNING or isSimulating
      if (isSimulating || stateLabel === 'BURNING') {
        ctx.beginPath()
        ctx.moveTo(-10, 0)
        ctx.lineTo(-20, -3)
        ctx.lineTo(-26, 0)
        ctx.lineTo(-20, 3)
        ctx.closePath()
        ctx.fillStyle = '#ffab39'
        ctx.shadowColor = '#ee3b1f'
        ctx.shadowBlur = 8
        ctx.fill()
      }

      // Spacecraft body (matching original wireframe ship)
      ctx.beginPath()
      ctx.moveTo(10, 0)
      ctx.lineTo(-4, 5)
      ctx.lineTo(-2, 2)
      ctx.lineTo(-8, 2)
      ctx.lineTo(-8, -2)
      ctx.lineTo(-2, -2)
      ctx.lineTo(-4, -5)
      ctx.closePath()

      ctx.fillStyle = '#f0b07c'
      ctx.shadowColor = '#dc7039'
      ctx.shadowBlur = 6
      ctx.fill()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 1
      ctx.stroke()

      // Solar crossbars
      ctx.beginPath()
      ctx.moveTo(-2, -7)
      ctx.lineTo(-2, 7)
      ctx.strokeStyle = '#ffc18f'
      ctx.lineWidth = 1.5
      ctx.stroke()

      ctx.restore()
    }

    ctx.restore()
  }, [
    altitude,
    thrustPct,
    stateLabel,
    predictedPoints,
    actualPoints,
    currentShipPos,
    currentShipVel,
    periapsis,
    apoapsis,
    outcome,
    isSimulating,
    transformCoord,
  ])

  return (
    <div
      ref={containerRef}
      className="orbit-projection"
      aria-label="Spacecraft orbital projection canvas"
    >
      <div className="projection-label">ORBITAL PROJECTION 07</div>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ display: 'block', width: '100%', height: 'calc(100% - 27px)' }}
      />
      <span className="projection-coord">
        APOGEE {altitude} KM · {stateLabel}
      </span>
    </div>
  )
}
