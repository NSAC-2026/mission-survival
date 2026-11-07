/**
 * Pure Orbital Mechanics Physics Engine for Level 2
 * Normalized coordinates: GM = 1, Planet Radius R = 1.
 * Earth Radius = 6371 km.
 * Fixed timestep velocity-Verlet integration.
 * NO React or DOM dependencies. Unit-testable.
 */

export const EARTH_RADIUS_KM = 6371
export const FIXED_DT = 0.002
export const MAX_SIM_STEPS = 40000

export interface Vector2 {
  x: number
  y: number
}

export type SimOutcome =
  | 'AIMING'
  | 'BURNING'
  | 'IN_FLIGHT'
  | 'STABLE'
  | 'CRASH'
  | 'ESCAPE'
  | 'ELLIPTICAL_UNSAFE'

export interface Classification {
  outcome: SimOutcome
  reason: string
  chapter: number | null
  isFinished: boolean
}

export interface OrbitState {
  r: Vector2
  v: Vector2
  a: Vector2
  altitude: number
  thrustPct: number
  r0: number
  vc: number
  accumulatedAngle: number
  previousAngle: number
  periapsis: number
  apoapsis: number
  specificEnergy: number
  eccentricity: number
  stepCount: number
  gravityCut: boolean
  isFinished: boolean
  outcome: SimOutcome
  outcomeReason: string
  suggestedChapter: number | null
  history: Vector2[]
}

/**
 * Calculates normalized initial radius from altitude in kilometers
 */
export function getInitialRadius(altitudeKm: number): number {
  return 1 + altitudeKm / EARTH_RADIUS_KM
}

/**
 * Calculates normalized circular orbital speed at given radius
 */
export function getCircularSpeed(r: number): number {
  return Math.sqrt(1 / r)
}

/**
 * Converts thrust percentage and altitude to real-world km/s readout
 */
export function getDisplayVelocity(altitudeKm: number, thrustPct: number): number {
  // Real Earth GM = 398600 km^3/s^2, r_real = 6371 + altitude
  const realVc = Math.sqrt(398600 / (EARTH_RADIUS_KM + altitudeKm))
  return realVc * (thrustPct / 100)
}

/**
 * Creates initial state at the burn point on the +x axis
 */
export function initialState(
  altitudeKm: number = 500,
  thrustPct: number = 100,
  options?: { gravityCut?: boolean }
): OrbitState {
  const r0 = getInitialRadius(altitudeKm)
  const vc = getCircularSpeed(r0)
  const vy = (thrustPct / 100) * vc

  const rx = r0
  const ry = 0
  const rDist = r0
  const r3 = rDist * rDist * rDist

  const gravityCut = !!options?.gravityCut
  const ax = gravityCut ? 0 : -rx / r3
  const ay = gravityCut ? 0 : -ry / r3

  const v2 = vy * vy
  const specificEnergy = v2 / 2 - 1 / rDist

  return {
    r: { x: rx, y: ry },
    v: { x: 0, y: vy },
    a: { x: ax, y: ay },
    altitude: altitudeKm,
    thrustPct,
    r0,
    vc,
    accumulatedAngle: 0,
    previousAngle: 0,
    periapsis: r0,
    apoapsis: r0,
    specificEnergy,
    eccentricity: 0,
    stepCount: 0,
    gravityCut,
    isFinished: false,
    outcome: 'AIMING',
    outcomeReason: 'VECTOR LOCKED · READY FOR IGNITION',
    suggestedChapter: null,
    history: [{ x: rx, y: ry }],
  }
}

/**
 * Evaluates outcome status based on current physics telemetry
 */
export function classify(state: OrbitState): Classification {
  const rDist = Math.hypot(state.r.x, state.r.y)

  // Released gravity demonstration (Ball on a string)
  if (state.gravityCut) {
    if (rDist > 4.5 || state.stepCount > 6000) {
      return {
        outcome: 'STABLE',
        reason: 'GRAVITY RELEASED – SPACECRAFT ESCAPED IN STRAIGHT LINE TANGENT',
        chapter: 3,
        isFinished: true,
      }
    }
    return {
      outcome: 'IN_FLIGHT',
      reason: 'INERTIAL DRIFT (ZERO GRAVITY)',
      chapter: null,
      isFinished: false,
    }
  }

  // Planet collision / Suborbital impact (R <= 1.0)
  if (rDist <= 1.0) {
    // Distinguish between severe ballistic crash vs low-periapsis orbital decay
    if (state.thrustPct < 80) {
      return {
        outcome: 'CRASH',
        reason: 'SUBORBITAL – IMPACT',
        chapter: 2, // Chapters 02 & 04
        isFinished: true,
      }
    } else {
      return {
        outcome: 'ELLIPTICAL_UNSAFE',
        reason: 'ORBIT DECAYING – PERIAPSIS TOO LOW',
        chapter: 5,
        isFinished: true,
      }
    }
  }

  // Hyperbolic / Parabolic Escape (energy >= 0 or distance > 6)
  if (state.specificEnergy >= 0 || rDist > 6.0) {
    return {
      outcome: 'ESCAPE',
      reason: 'ESCAPE TRAJECTORY – ORBIT LOST',
      chapter: 6,
      isFinished: true,
    }
  }

  // Check full revolution completion (2pi radians)
  if (state.accumulatedAngle >= 2 * Math.PI) {
    // Stable if periapsis clears surface/atmosphere (>= 1.02) and eccentricity < 0.25
    if (state.periapsis >= 1.02 && state.eccentricity < 0.25) {
      return {
        outcome: 'STABLE',
        reason: `STABLE ORBIT ACHIEVED · ${state.altitude} KM`,
        chapter: null,
        isFinished: true,
      }
    } else if (state.periapsis < 1.02) {
      return {
        outcome: 'ELLIPTICAL_UNSAFE',
        reason: 'ORBIT DECAYING – PERIAPSIS TOO LOW',
        chapter: 5,
        isFinished: true,
      }
    } else {
      return {
        outcome: 'ELLIPTICAL_UNSAFE',
        reason: 'UNSTABLE ORBIT – ECCENTRICITY TOO HIGH',
        chapter: 6,
        isFinished: true,
      }
    }
  }

  // Sim step cap reached
  if (state.stepCount >= MAX_SIM_STEPS) {
    return {
      outcome: state.periapsis >= 1.02 && state.eccentricity < 0.25 ? 'STABLE' : 'ELLIPTICAL_UNSAFE',
      reason: 'SIMULATION TIME LIMIT REACHED',
      chapter: 5,
      isFinished: true,
    }
  }

  // Still in flight
  return {
    outcome: 'IN_FLIGHT',
    reason: 'IN FLIGHT · TRAJECTORY ACTIVE',
    chapter: null,
    isFinished: false,
  }
}

/**
 * Integrates one fixed timestep using Velocity-Verlet
 */
export function step(state: OrbitState, dt: number = FIXED_DT): OrbitState {
  if (state.isFinished) return state

  const { r, v, a, gravityCut } = state

  // Step 1: Position update
  const nextRx = r.x + v.x * dt + 0.5 * a.x * dt * dt
  const nextRy = r.y + v.y * dt + 0.5 * a.y * dt * dt
  const nextRDist = Math.hypot(nextRx, nextRy)

  // Step 2: Next acceleration
  let nextAx = 0
  let nextAy = 0
  if (!gravityCut && nextRDist > 0.0001) {
    const nextR3 = nextRDist * nextRDist * nextRDist
    nextAx = -nextRx / nextR3
    nextAy = -nextRy / nextR3
  }

  // Step 3: Velocity update (half-step average of accelerations)
  const nextVx = v.x + 0.5 * (a.x + nextAx) * dt
  const nextVy = v.y + 0.5 * (a.y + nextAy) * dt

  // Track periapsis and apoapsis
  const periapsis = Math.min(state.periapsis, nextRDist)
  const apoapsis = Math.max(state.apoapsis, nextRDist)
  const eccentricity = (apoapsis - periapsis) / (apoapsis + periapsis)

  // Specific energy
  const nextV2 = nextVx * nextVx + nextVy * nextVy
  const specificEnergy = nextV2 / 2 - (gravityCut ? 0 : 1 / nextRDist)

  // Accumulated angle tracking with wrap-around
  let currentAngle = Math.atan2(nextRy, nextRx)
  if (currentAngle < 0) currentAngle += 2 * Math.PI

  let dAngle = currentAngle - state.previousAngle
  if (dAngle < -Math.PI) dAngle += 2 * Math.PI
  if (dAngle > Math.PI) dAngle -= 2 * Math.PI

  const accumulatedAngle = state.stepCount === 0 ? 0 : state.accumulatedAngle + dAngle

  // Sample history every 4 steps to keep memory clean
  const history =
    state.stepCount % 4 === 0
      ? [...state.history, { x: nextRx, y: nextRy }]
      : state.history

  const nextState: OrbitState = {
    ...state,
    r: { x: nextRx, y: nextRy },
    v: { x: nextVx, y: nextVy },
    a: { x: nextAx, y: nextAy },
    accumulatedAngle,
    previousAngle: currentAngle,
    periapsis,
    apoapsis,
    specificEnergy,
    eccentricity,
    stepCount: state.stepCount + 1,
    history,
  }

  // Classify outcome
  const classification = classify(nextState)
  nextState.outcome = classification.outcome
  nextState.outcomeReason = classification.reason
  nextState.suggestedChapter = classification.chapter
  nextState.isFinished = classification.isFinished

  return nextState
}

/**
 * Pre-computes predicted trajectory for live dashed preview
 */
export function predictTrajectory(
  altitudeKm: number,
  thrustPct: number,
  maxSteps: number = 8000,
  dt: number = 0.008
): {
  points: Vector2[]
  predictedOutcome: SimOutcome
  periapsis: number
  apoapsis: number
  eccentricity: number
  reason: string
  chapter: number | null
} {
  let sim = initialState(altitudeKm, thrustPct)
  const points: Vector2[] = [{ ...sim.r }]

  for (let s = 0; s < maxSteps; s++) {
    sim = step(sim, dt)
    // Subsample trajectory points for rendering performance
    if (s % 3 === 0) {
      points.push({ ...sim.r })
    }
    if (sim.isFinished) break
  }

  return {
    points,
    predictedOutcome: sim.outcome,
    periapsis: sim.periapsis,
    apoapsis: sim.apoapsis,
    eccentricity: sim.eccentricity,
    reason: sim.outcomeReason,
    chapter: sim.suggestedChapter,
  }
}
