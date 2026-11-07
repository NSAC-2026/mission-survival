'use client'

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import {
  OrbitState,
  SimOutcome,
  initialState,
  step,
  predictTrajectory,
  getDisplayVelocity,
  FIXED_DT,
} from '@/lib/orbit-physics'
import {
  Level2State,
  Level2Phase,
  BetaChallengeId,
  loadSavedLevel2State,
  isAssemblyComplete,
  getMissingPartName,
} from '@/lib/level2-state'
import { cockpitAudio } from '@/utils/audio'
import OrbitalProjectionCanvas from './level2/OrbitalProjectionCanvas'

type SystemView = 1 | 2 | 3 | 4

const systemContent: Record<SystemView, { title: string; subtitle: string; body: string }> = {
  1: {
    title: 'Structural system',
    subtitle: 'Stage 1 – Core Booster & Engines',
    body: 'A rocket is made of four major systems. The structural system is the frame and shell of a rocket. It holds all of the other systems and contains the primary rocket engines.',
  },
  2: {
    title: 'Propulsion system',
    subtitle: 'Stage 2 – Main Fuel & Oxidizer Tanks',
    body: "The propulsion system contains the fuel and machinery to fire the rocket's engine. It provides the thrust that launches the rocket and allows it to maneuver in space.",
  },
  3: {
    title: 'Guidance system',
    subtitle: 'Stage 3 – Avionics & Inertial Sensors',
    body: "The guidance system controls the direction of the rocket's movement. It is responsible for keeping the rocket upright during launch, controlling its path through the atmosphere, and determining its movement in space.",
  },
  4: {
    title: 'Payload',
    subtitle: 'Stage 4 – Spacecraft Fairing & Satellite',
    body: 'The payload is any cargo, object, or person the rocket needs to deliver or transport into space. It is the primary reason a rocket is sent to space. The payload will be released into space.',
  },
}

interface ChapterData {
  title: string
  kicker: string
  content: string
}

const handbookData: Record<number, ChapterData> = {
  1: {
    title: 'Parts of a Rocket',
    kicker: 'CHAPTER 01 · ARCHITECTURE',
    content:
      'A rocket consists of 4 vital systems: Structural System (the frame and engines), Propulsion System (fuel and oxidizer tanks), Guidance System (gyroscopes and flight computers), and Payload (the cargo or satellite carried into orbit). All four systems must function together for successful launch.',
  },
  2: {
    title: 'Amount of Velocity',
    kicker: 'CHAPTER 02 · ORBITAL SPEED',
    content:
      'To stay in a circular orbit 500 km above Earth, a spacecraft must maintain a circular velocity of approximately 7.8 km/s (28,000 km/h). If forward velocity is insufficient, Earth’s gravity pulls the trajectory down faster than the planet curves away, resulting in a suborbital crash.',
  },
  3: {
    title: 'Ball on a String',
    kicker: 'CHAPTER 03 · CENTRIPETAL MECHANICS',
    content:
      'Orbiting is like spinning a ball on a string. The tension in the string pulls the ball toward the center. If you release the string, the ball does NOT spiral outwards—it flies off instantly in a straight line tangent to its path. In space, gravity is that invisible string.',
  },
  4: {
    title: 'Amount of Gravity',
    kicker: 'CHAPTER 04 · GRAVITATIONAL FORCE',
    content:
      'Gravity does not stop in space! At 500 km altitude, Earth’s gravity is still ~86% as strong as on the surface. Astronauts float not because there is no gravity, but because they and their spacecraft are in continuous free-fall around the planet together.',
  },
  5: {
    title: 'How a stable orbit is made',
    kicker: 'CHAPTER 05 · EQUILIBRIUM',
    content:
      'A stable orbit happens when forward speed balances gravity so precisely that as the spacecraft falls toward Earth, the surface curves away beneath it at the exact same rate. The periapsis (lowest point) must remain well above the atmosphere (> 100 km) and eccentricity must remain near circular (< 0.25).',
  },
  6: {
    title: 'Unstable Orbits',
    kicker: 'CHAPTER 06 · ESCAPE & DECAY',
    content:
      'An orbit becomes unstable when forward velocity is imbalanced. If thrust is too high (excess kinetic energy), the spacecraft breaks Earth’s gravitational bonds on a hyperbolic escape path. If thrust is slightly low, the periapsis dips into the atmosphere, creating drag that rapidly decays the orbit.',
  },
  7: {
    title: 'Decrease Velocity to Create an Unstable Orbit',
    kicker: 'CHAPTER 07 · DE-ORBIT MANEUVERS',
    content:
      'To return home from space or de-orbit a spacecraft, you do not steer toward the planet. Instead, you point your engines forward and fire in reverse (retrograde burn). This decreases forward velocity, lowering the periapsis on the opposite side of Earth into the dense atmosphere for safe re-entry.',
  },
}

function RocketBlueprint({
  view,
  installedParts,
  isSimulating,
  onSelectView,
}: {
  view: SystemView
  installedParts: [boolean, boolean, boolean, boolean]
  isSimulating?: boolean
  simOutcome?: SimOutcome
  onSelectView?: (view: SystemView) => void
}) {
  const installedCount = installedParts.filter(Boolean).length
  const allInstalled = installedCount === 4

  const footerText =
    installedCount === 0
      ? 'ASSEMBLY LOCKED'
      : allInstalled
      ? 'ASSEMBLY READY'
      : `ASSEMBLY INCOMPLETE (${installedCount}/4)`

  return (
    <div className={`rocket-blueprint blueprint-state-${view}`} aria-label="Proton-M Rocket Schematic">
      <div className="blueprint-head">
        <span>PROTON-M / SYSTEM {view}.0</span>
        <span>FRONT ELEVATION</span>
      </div>

      {/* Interactive Blueprint Stage Callout Buttons */}
      {onSelectView && (
        <div className="blueprint-stage-callouts" aria-label="Select Rocket System from Schematic">
          {([4, 3, 2, 1] as const).map((stageNum) => {
            const isInstalled = installedParts[stageNum - 1]
            const isCurrent = view === stageNum
            return (
              <button
                key={stageNum}
                type="button"
                className={`blueprint-callout-pill stage-${stageNum} ${isCurrent ? 'active' : ''} ${
                  isInstalled ? 'is-installed' : ''
                }`}
                onClick={() => onSelectView(stageNum)}
                aria-label={`Select System ${stageNum}: ${systemContent[stageNum].title}`}
              >
                <span className="pill-dot">0{stageNum}</span>
                <span className="pill-title">{systemContent[stageNum].title}</span>
                <span className="pill-badge">{isInstalled ? '✓ READY' : '+ SELECT'}</span>
              </button>
            )
          })}
        </div>
      )}

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
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g className="blueprint-grid">
          <path d="M40 80H480M40 160H480M40 240H480M40 320H480M40 400H480M40 480H480M40 560H480" />
          <path d="M100 40V580M180 40V580M260 40V580M340 40V580M420 40V580" />
        </g>

        {/* Stage 1: Structural & Engine section */}
        <g
          className="structural-rocket"
          style={{
            opacity: installedParts[0] ? 1 : 0.35,
            transition: 'opacity 0.3s ease',
          }}
        >
          <path
            className="hull-fill"
            style={{ fill: installedParts[0] ? 'url(#rocketMetal)' : 'none' }}
            d="M230 72Q260 18 290 72L295 182 324 242 343 460 378 515 370 565H150L142 515 177 460 196 242 225 182Z"
          />
          <path d="M225 182h70M196 242h128M177 460h166M152 515h216M260 42v523" />
          <path d="M196 255 158 311l-15 199M324 255l38 56 15 199M199 475l-28 88M321 475l28 88" />
          <path className="panel-lines" d="M215 198h90M205 275h110M194 350h132M187 425h146M170 490h180" />
          <circle cx="260" cy="215" r="4" />
          <circle cx="260" cy="470" r="4" />

          {/* Engine Exhaust Flame during simulation burn */}
          {isSimulating && (
            <g filter="url(#orangeGlow)">
              <polygon points="210,565 240,615 250,565" fill="#ffab39" opacity="0.9" />
              <polygon points="250,565 260,620 270,565" fill="#ffd0a0" opacity="0.95" />
              <polygon points="270,565 280,615 310,565" fill="#ffab39" opacity="0.9" />
            </g>
          )}
        </g>

        {/* Stage 2: Propulsion tanks & boosters */}
        <g
          className="propulsion-rocket"
          style={{
            opacity: installedParts[1] ? 1 : 0.35,
            transition: 'opacity 0.3s ease',
          }}
        >
          <path
            className="tank"
            style={{ fill: installedParts[1] ? 'url(#tankGlow)' : 'none' }}
            d="M231 91h58v93h-58zM216 211h88v112h-88zM207 340h106v105H207z"
          />
          <path className="tank-detail" d="M234 110h52M234 163h52M220 234h80M220 298h80M211 363h98M211 421h98" />
          <path className="prop-lines" d="M244 184v27M276 184v27M236 323v17M284 323v17M234 445v47M286 445v47M234 470h52" />
          <path className="engine" d="m212 487-17 62h42l-8-62zM291 487l-8 62h42l-17-62zM244 480l-6 78h44l-6-78z" />
          <path className="booster" d="M196 253 160 309l-17 203 31 40 24-87zM324 253l36 56 17 203-31 40-24-87z" />
          <g filter="url(#orangeGlow)">
            <circle cx="260" cy="384" r="8" fill={installedParts[1] ? '#f0b168' : '#3a1e19'} />
            <circle cx="260" cy="277" r="7" fill={installedParts[1] ? '#f0b168' : '#3a1e19'} />
          </g>
        </g>

        {/* Stage 3: Guidance & Avionics */}
        <g
          className="guidance-rocket"
          style={{
            opacity: installedParts[2] ? 1 : 0.35,
            transition: 'opacity 0.3s ease',
          }}
        >
          <path className="callout" d="M292 170 354 128" />
          <circle className="inset-ring" cx="401" cy="158" r="90" />
          <circle className="inset-ring inner" cx="401" cy="158" r="72" />
          <g className="circuitry">
            <circle cx="401" cy="158" r="34" />
            <circle cx="401" cy="158" r="18" fill={installedParts[2] ? '#e18a50' : 'none'} />
            <path d="M401 68v56M401 192v56M311 158h56M435 158h56M338 95l39 39M425 182l39 39M338 221l39-39M425 134l39-39" />
            <path d="M370 93h32l14 18 29 4M344 145l22-17M445 188l17-29M374 218l27-26" />
          </g>
        </g>

        {/* Stage 4: Payload fairing & satellite */}
        <g
          className="payload-rocket"
          style={{
            opacity: installedParts[3] ? 1 : 0.35,
            transition: 'opacity 0.3s ease',
          }}
        >
          <path className="payload-base" d="M208 353h104l13 188H195zM194 541h132" />
          <path
            className="fairing left"
            style={{ fill: installedParts[3] ? 'url(#rocketMetal)' : 'none' }}
            d="M246 80Q193 124 166 219l73 73 12-154z"
          />
          <path
            className="fairing right"
            style={{ fill: installedParts[3] ? 'url(#rocketMetal)' : 'none' }}
            d="M274 80q53 44 80 139l-73 73-12-154z"
          />
          <g className="satellite" filter="url(#orangeGlow)">
            <rect
              x="240"
              y="222"
              width="40"
              height="42"
              rx="5"
              fill={installedParts[3] ? '#e18a50' : '#4a251a'}
            />
            <path d="M240 230h-48v27h48M280 230h48v27h-48M204 231v25M216 231v25M304 231v25M316 231v25" />
            <path d="M260 222v-24M251 198h18M260 264v28" />
          </g>
          <path className="payload-platform" d="M220 314h80l12 39H208z" />
        </g>
      </svg>

      <div className="blueprint-footer">
        <span>{footerText}</span>
        <span>SCALE 1:48</span>
      </div>
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
  const [state, setState] = useState<Level2State>(() => loadSavedLevel2State())
  const [muted, setMuted] = useState(false)
  const [showGlossary, setShowGlossary] = useState(false)
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null)

  // Live simulation and predicted points
  const [simState, setSimState] = useState<OrbitState | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const animFrameRef = useRef<number | null>(null)
  const simStateRef = useRef<OrbitState | null>(null)
  const lastTimeRef = useRef<number>(0)
  const accumulatorRef = useRef<number>(0)

  // Compute live predicted points using useMemo (no cascading renders)
  const effectiveThrust =
    state.activePhase === 'orbital-beta' && state.activeChallenge === 'retro-burn'
      ? Math.max(0, 100 - state.retroPct)
      : state.thrustPct

  const predictedPoints = useMemo(() => {
    const pred = predictTrajectory(state.altitude, effectiveThrust)
    return pred.points
  }, [state.altitude, effectiveThrust])

  // Handle assembly install action
  const handleInstallPart = (partNumber: 1 | 2 | 3 | 4) => {
    cockpitAudio.playClick()
    const nextParts: [boolean, boolean, boolean, boolean] = [...state.installedParts]
    nextParts[partNumber - 1] = true

    const allNowInstalled = nextParts.every(Boolean)
    if (allNowInstalled) {
      cockpitAudio.playSuccessChime()
    }

    setState((prev) => ({
      ...prev,
      installedParts: nextParts,
      assemblyWarning: null,
    }))
  }

  // Handle phase tab navigation
  const handleSelectPhase = (targetPhase: Level2Phase) => {
    cockpitAudio.playClick()

    // Enforce Sequential Gating with user feedback
    if (targetPhase === 'orbital-alpha') {
      if (!isAssemblyComplete(state.installedParts)) {
        const missing = getMissingPartName(state.installedParts)
        setState((prev) => ({
          ...prev,
          assemblyWarning: `Assembly Incomplete: Missing ${missing}. Install all 4 rocket modules to proceed.`,
        }))
        return
      }
    } else if (targetPhase === 'orbital-beta') {
      if (!state.burnCleared) {
        setState((prev) => ({
          ...prev,
          assemblyWarning: 'Orbital Beta Locked: Execute a successful circular orbit burn in Orbital Alpha (~7.8 km/s) first.',
        }))
        return // locked
      }
    } else if (targetPhase === 'launch-sequence') {
      if (
        !isAssemblyComplete(state.installedParts) ||
        !state.burnCleared ||
        state.completedChallenges.length < 3
      ) {
        const remaining = 3 - state.completedChallenges.length
        setState((prev) => ({
          ...prev,
          assemblyWarning: `Launch Gate Locked: Complete all 3 experiments in Orbital Beta (${remaining} remaining).`,
        }))
        return // locked
      }
    }

    setState((prev) => ({
      ...prev,
      activePhase: targetPhase,
      assemblyWarning: null,
      lastOutcome: null,
    }))
    setSimState(null)
  }

  // Handle challenge tab selection
  const handleSelectChallenge = (challengeId: BetaChallengeId) => {
    cockpitAudio.playClick()
    setState((prev) => ({
      ...prev,
      activeChallenge: challengeId,
      lastOutcome: null,
      assemblyWarning: null,
    }))
    setSimState(null)
  }

  // Handle failure hint chapter jump
  const handleOpenHintChapter = (chapterNum: number) => {
    cockpitAudio.playClick()
    setSelectedChapter(chapterNum)
    setState((prev) => {
      const unlocked = prev.unlockedChapters.includes(chapterNum)
        ? prev.unlockedChapters
        : [...prev.unlockedChapters, chapterNum]
      const seen = prev.seenChapters.includes(chapterNum)
        ? prev.seenChapters
        : [...prev.seenChapters, chapterNum]
      return {
        ...prev,
        activeTab: 'handbook',
        unlockedChapters: unlocked,
        seenChapters: seen,
      }
    })
  }

  // Handbook chapter item click handler (unlocks on 2nd click if locked)
  const handleChapterClick = (chapterNum: number) => {
    cockpitAudio.playClick()
    const isUnlocked = state.unlockedChapters.includes(chapterNum)

    if (!isUnlocked) {
      const clicks = (state.chapterClickCounts[chapterNum] || 0) + 1
      if (clicks >= 2) {
        // Unlock on second click
        setState((prev) => ({
          ...prev,
          unlockedChapters: [...prev.unlockedChapters, chapterNum],
          seenChapters: [...prev.seenChapters, chapterNum],
          chapterClickCounts: { ...prev.chapterClickCounts, [chapterNum]: 0 },
        }))
        setSelectedChapter(chapterNum)
        return
      } else {
        setState((prev) => ({
          ...prev,
          chapterClickCounts: { ...prev.chapterClickCounts, [chapterNum]: clicks },
        }))
        return
      }
    }

    setSelectedChapter(chapterNum)
    setState((prev) => ({
      ...prev,
      seenChapters: prev.seenChapters.includes(chapterNum)
        ? prev.seenChapters
        : [...prev.seenChapters, chapterNum],
    }))
  }

  // Simulation completion outcome handler
  const handleSimulationFinished = useCallback((finalState: OrbitState) => {
    const outcome = finalState.outcome
    const reason = finalState.outcomeReason
    const chapter = finalState.suggestedChapter

    if (outcome === 'STABLE') {
      cockpitAudio.playSuccessChime()
    }

    setState((prev) => {
      let burnCleared = prev.burnCleared
      const completedChallenges = [...prev.completedChallenges]
      let levelComplete = prev.levelComplete
      let stars = prev.stars

      // Phase 2: Orbital Alpha burn cleared
      if (prev.activePhase === 'orbital-alpha' && outcome === 'STABLE') {
        burnCleared = true
      }

      // Phase 3: Orbital Beta challenges
      if (prev.activePhase === 'orbital-beta') {
        if (
          prev.activeChallenge === 'ball-on-string' &&
          (finalState.gravityCut || outcome === 'STABLE')
        ) {
          if (!completedChallenges.includes('ball-on-string')) {
            completedChallenges.push('ball-on-string')
          }
        } else if (
          prev.activeChallenge === 'unstable-orbit' &&
          (outcome === 'ELLIPTICAL_UNSAFE' || outcome === 'CRASH')
        ) {
          if (!completedChallenges.includes('unstable-orbit')) {
            completedChallenges.push('unstable-orbit')
          }
        } else if (
          prev.activeChallenge === 'retro-burn' &&
          (outcome === 'ELLIPTICAL_UNSAFE' || outcome === 'CRASH')
        ) {
          if (!completedChallenges.includes('retro-burn')) {
            completedChallenges.push('retro-burn')
          }
        }
      }

      // Phase 4: Launch sequence final gate
      if (prev.activePhase === 'launch-sequence' && outcome === 'STABLE') {
        levelComplete = true
        // 3★ if e < 0.05, 2★ if < 0.15, 1★ otherwise
        const e = finalState.eccentricity
        stars = e < 0.05 ? 3 : e < 0.15 ? 2 : 1
      }

      // Auto-unlock hinted chapter
      const unlockedChapters =
        chapter && !prev.unlockedChapters.includes(chapter)
          ? [...prev.unlockedChapters, chapter]
          : prev.unlockedChapters

      return {
        ...prev,
        burnCleared,
        completedChallenges,
        levelComplete,
        stars,
        unlockedChapters,
        lastOutcome: {
          outcome,
          reason,
          chapter,
        },
      }
    })
  }, [])

  // Simulation execution loop
  const handleIgnite = useCallback((options?: { gravityCut?: boolean; customThrust?: number }) => {
    cockpitAudio.playClick()
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current)
    }

    const currentThrust =
      options?.customThrust !== undefined
        ? options.customThrust
        : state.activePhase === 'orbital-beta' && state.activeChallenge === 'retro-burn'
        ? Math.max(0, 100 - state.retroPct)
        : state.thrustPct

    const initial = initialState(state.altitude, currentThrust, {
      gravityCut: options?.gravityCut,
    })

    simStateRef.current = initial
    setSimState(initial)
    setIsSimulating(true)
    lastTimeRef.current = 0
    accumulatorRef.current = 0

    // Record launch attempts if in LAUNCH SEQUENCE
    if (state.activePhase === 'launch-sequence') {
      setState((prev) => ({
        ...prev,
        launchAttempts: prev.launchAttempts + 1,
      }))
    }

    const simLoop = (timestamp: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = timestamp
      }
      const deltaSec = Math.min(0.08, (timestamp - lastTimeRef.current) / 1000)
      lastTimeRef.current = timestamp
      // 2.5x speed boost for responsive gameplay
      accumulatorRef.current += deltaSec * 2.5

      let current = simStateRef.current
      if (!current || current.isFinished) {
        setIsSimulating(false)
        if (current) handleSimulationFinished(current)
        return
      }

      let stepsRun = 0
      while (accumulatorRef.current >= FIXED_DT && stepsRun < 35) {
        current = step(current, FIXED_DT)
        accumulatorRef.current -= FIXED_DT
        stepsRun++
        if (current.isFinished) break
      }

      simStateRef.current = current
      setSimState(current)

      if (current.isFinished) {
        setIsSimulating(false)
        handleSimulationFinished(current)
        return
      }

      animFrameRef.current = requestAnimationFrame(simLoop)
    }

    animFrameRef.current = requestAnimationFrame(simLoop)
  }, [state.activePhase, state.activeChallenge, state.retroPct, state.thrustPct, state.altitude, handleSimulationFinished])

  // Instant fast-forward if user clicks while simulating
  const handleFastForward = () => {
    cockpitAudio.playClick()
    if (!isSimulating || !simStateRef.current) return
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    let current = simStateRef.current
    let s = 0
    while (!current.isFinished && s < 10000) {
      current = step(current, FIXED_DT)
      s++
    }
    simStateRef.current = current
    setSimState(current)
    setIsSimulating(false)
    handleSimulationFinished(current)
  }

  // Ball on a String demo: cut gravity mid-flight or on button click
  const handleCutGravity = () => {
    cockpitAudio.playClick()
    if (simState && !simState.isFinished) {
      setSimState((prev) => (prev ? { ...prev, gravityCut: true } : null))
    } else {
      // Start orbiting, then release
      handleIgnite({ gravityCut: true })
    }
  }

  // Clean up RAF on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [])

  const handleReset = () => {
    cockpitAudio.playClick()
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    simStateRef.current = null
    setSimState(null)
    setIsSimulating(false)
    setState((prev) => ({
      ...prev,
      lastOutcome: null,
      assemblyWarning: null,
    }))
  }

  // Audio toggle
  const handleToggleMute = () => {
    const isNowMuted = cockpitAudio.toggleMute()
    setMuted(isNowMuted)
  }

  // Derived state labels for Orbital Projection footer
  const currentOutcome = simState?.outcome || state.lastOutcome?.outcome
  const canvasStateLabel = isSimulating
    ? 'BURNING'
    : currentOutcome === 'STABLE'
    ? 'VECTOR LOCKED'
    : currentOutcome === 'CRASH' || currentOutcome === 'ESCAPE' || currentOutcome === 'ELLIPTICAL_UNSAFE'
    ? 'FAILED'
    : 'AIMING'

  // Formatting display velocity
  const displayKmPerSec = getDisplayVelocity(
    state.altitude,
    state.activePhase === 'orbital-beta' && state.activeChallenge === 'retro-burn'
      ? Math.max(0, 100 - state.retroPct)
      : state.thrustPct
  )

  const activeContent = systemContent[state.selectedStageView]
  const isSelectedPartInstalled = state.installedParts[state.selectedStageView - 1]
  const installedCount = state.installedParts.filter(Boolean).length

  // Sequential Phase Unlock Status
  const alphaUnlocked = isAssemblyComplete(state.installedParts)
  const betaUnlocked = alphaUnlocked && state.burnCleared
  const launchUnlocked = betaUnlocked && state.completedChallenges.length === 3

  return (
    <section className="proton-dashboard" aria-label="Proton Launch educational dashboard">
      {/* Top Bar Header */}
      <header className="proton-topbar">
        <button className="proton-back" type="button" onClick={onBack}>
          <span /> Back to missions
        </button>

        <div className="mission-phase" role="tablist" aria-label="Mission Phases">
          {/* SYSTEMS TAB */}
          <button
            type="button"
            role="tab"
            aria-selected={state.activePhase === 'systems'}
            className={state.activePhase === 'systems' ? 'active' : ''}
            onClick={() => handleSelectPhase('systems')}
          >
            <span>SYSTEMS</span>
          </button>

          {/* ORBITAL ALPHA TAB */}
          <button
            type="button"
            role="tab"
            aria-selected={state.activePhase === 'orbital-alpha'}
            className={`${state.activePhase === 'orbital-alpha' ? 'active' : ''} ${
              !alphaUnlocked ? 'locked' : ''
            }`}
            onClick={() => handleSelectPhase('orbital-alpha')}
            title={!alphaUnlocked ? 'Requires Assembly of all 4 rocket modules' : ''}
          >
            <span>ORBITAL ALPHA</span>
            {!alphaUnlocked && <span className="phase-lock-pill">🔒 LOCKED</span>}
          </button>

          {/* ORBITAL BETA TAB */}
          <button
            type="button"
            role="tab"
            aria-selected={state.activePhase === 'orbital-beta'}
            className={`${state.activePhase === 'orbital-beta' ? 'active' : ''} ${
              !betaUnlocked ? 'locked' : ''
            }`}
            onClick={() => handleSelectPhase('orbital-beta')}
            title={!betaUnlocked ? 'Requires successful Orbital Alpha burn' : ''}
          >
            <span>ORBITAL BETA</span>
            {!betaUnlocked && <span className="phase-lock-pill">🔒 LOCKED</span>}
          </button>

          {/* LAUNCH SEQUENCE TAB */}
          <button
            type="button"
            role="tab"
            aria-selected={state.activePhase === 'launch-sequence'}
            className={`${state.activePhase === 'launch-sequence' ? 'active' : ''} ${
              !launchUnlocked ? 'locked' : ''
            }`}
            onClick={() => handleSelectPhase('launch-sequence')}
            title={!launchUnlocked ? 'Requires all 3 Orbital Beta challenges' : ''}
          >
            <span>LAUNCH SEQUENCE</span>
            {!launchUnlocked && <span className="phase-lock-pill">🔒 LOCKED</span>}
          </button>
        </div>

        <button
          className={`sequence-button ${
            (state.activePhase === 'systems' && !alphaUnlocked) ||
            (state.activePhase === 'orbital-alpha' && !state.burnCleared) ||
            (state.activePhase === 'orbital-beta' && state.completedChallenges.length < 3) ||
            (state.activePhase === 'launch-sequence' && !state.levelComplete)
              ? 'is-locked-btn'
              : 'is-ready-btn'
          }`}
          type="button"
          onClick={() => {
            cockpitAudio.playClick()
            if (state.activePhase === 'systems') {
              handleSelectPhase('orbital-alpha')
            } else if (state.activePhase === 'orbital-alpha') {
              handleSelectPhase('orbital-beta')
            } else if (state.activePhase === 'orbital-beta') {
              handleSelectPhase('launch-sequence')
            } else if (state.levelComplete && onNext) {
              onNext()
            } else {
              handleSelectPhase('systems')
            }
          }}
        >
          {state.activePhase === 'systems'
            ? (alphaUnlocked ? 'Proceed to Burn ▶' : `🔒 BURN LOCKED (${installedCount}/4)`)
            : state.activePhase === 'orbital-alpha'
            ? (state.burnCleared ? 'Orbital Challenges ▶' : '🔒 CHALLENGES LOCKED')
            : state.activePhase === 'orbital-beta'
            ? (state.completedChallenges.length >= 3 ? 'Launch Gate ▶' : `🔒 LAUNCH GATE LOCKED (${state.completedChallenges.length}/3)`)
            : state.levelComplete
            ? 'Level 3: Docking ▶'
            : '🔒 LEVEL 3 LOCKED'}
        </button>
      </header>

      <div className="proton-layout">
        <main className="proton-content">
          <div className="systems-view">
            {/* Left Column: Orbital Projection & Controls Panel */}
            <div className="systems-left">
              {/* Canvas 2D Orbital Projection */}
              <OrbitalProjectionCanvas
                altitude={state.altitude}
                thrustPct={state.thrustPct}
                stateLabel={canvasStateLabel}
                predictedPoints={predictedPoints}
                actualPoints={simState?.history || []}
                currentShipPos={simState?.r || null}
                currentShipVel={simState?.v || null}
                periapsis={simState?.periapsis}
                apoapsis={simState?.apoapsis}
                outcome={simState?.outcome || state.lastOutcome?.outcome}
                isSimulating={isSimulating}
              />

              {/* Bottom Left: SYSTEMS ASSEMBLY */}
              {state.activePhase === 'systems' && (
                <section className="systems-copy hud-cut" aria-label="Rocket Assembly Station">
                  <p className="section-kicker">SYSTEM ARCHITECTURE</p>
                  <h1>Rocket Systems</h1>

                  {/* Next Phase Lock Callout Banner */}
                  {!alphaUnlocked ? (
                    <div className="phase-lock-callout locked" role="alert">
                      <span className="lock-tag-icon">🔒</span>
                      <div className="lock-callout-text">
                        <b>NEXT PHASE LOCKED: ORBITAL ALPHA</b>
                        <span>Install all 4 rocket modules ({installedCount}/4 installed) to unlock orbital insertion burn.</span>
                      </div>
                    </div>
                  ) : (
                    <div className="phase-lock-callout unlocked">
                      <span className="lock-tag-icon">🔓</span>
                      <div className="lock-callout-text">
                        <b>ORBITAL ALPHA UNLOCKED!</b>
                        <span>All 4 modules operational. Proceed to orbital insertion burn.</span>
                      </div>
                    </div>
                  )}

                  {/* 4 Prominent Module Selector Cards */}
                  <div className="system-selectors-grid" role="group" aria-label="Choose rocket system module">
                    {([1, 2, 3, 4] as const).map((num) => {
                      const isInstalled = state.installedParts[num - 1]
                      const isActive = state.selectedStageView === num
                      return (
                        <button
                          className={`system-module-card ${isActive ? 'active' : ''} ${
                            isInstalled ? 'is-installed-card' : ''
                          }`}
                          type="button"
                          key={num}
                          aria-label={`System ${num}: ${systemContent[num].title} (${
                            isInstalled ? 'Installed' : 'Missing'
                          })`}
                          onClick={() => {
                            cockpitAudio.playClick()
                            setState((prev) => ({ ...prev, selectedStageView: num }))
                          }}
                        >
                          <div className="module-card-top">
                            <span className="module-number">MODULE 0{num}</span>
                            <span className={`module-badge ${isInstalled ? 'is-online' : 'is-pending'}`}>
                              {isInstalled ? '✓ READY' : '+ MOUNT'}
                            </span>
                          </div>
                          <div className="module-name">{systemContent[num].title}</div>
                        </button>
                      )
                    })}
                  </div>

                  <div className="system-selectors" aria-label="Quick number select">
                    {([1, 2, 3, 4] as const).map((num) => (
                      <button
                        className={`${state.selectedStageView === num ? 'active' : ''} ${
                          state.installedParts[num - 1] ? 'is-installed-btn' : ''
                        }`}
                        type="button"
                        key={num}
                        aria-label={`System ${num}: ${systemContent[num].title} (${
                          state.installedParts[num - 1] ? 'Installed' : 'Missing'
                        })`}
                        onClick={() => {
                          cockpitAudio.playClick()
                          setState((prev) => ({ ...prev, selectedStageView: num }))
                        }}
                      >
                        {num}
                        {state.installedParts[num - 1] && <span style={{ fontSize: '9px', display: 'block' }}>✓</span>}
                      </button>
                    ))}
                  </div>

                  <div className="copy-rule" />
                  <h2>{activeContent.title}</h2>
                  <p style={{ color: '#fed7aa', fontSize: '11px', margin: '0 0 6px', fontWeight: 600 }}>
                    {activeContent.subtitle}
                  </p>
                  <p>{activeContent.body}</p>

                  <div className="assembly-action-bar">
                    <button
                      type="button"
                      className={`btn-install-part ${isSelectedPartInstalled ? 'is-installed' : ''}`}
                      onClick={() => handleInstallPart(state.selectedStageView)}
                      disabled={isSelectedPartInstalled}
                    >
                      {isSelectedPartInstalled
                        ? `MODULE 0${state.selectedStageView} INSTALLED ✓`
                        : `INSTALL MODULE 0${state.selectedStageView} (${activeContent.title.toUpperCase()}) ▶`}
                    </button>

                    <div className="copy-meta" style={{ margin: 0, padding: 0, border: 0 }}>
                      <span>MODULE 0{state.selectedStageView}</span>
                      <span>STATUS · {isSelectedPartInstalled ? 'ONLINE' : 'UNMOUNTED'}</span>
                    </div>
                  </div>

                  {/* Advance to Orbital Alpha when all 4 modules installed */}
                  {isAssemblyComplete(state.installedParts) && (
                    <div className="outcome-next-step" style={{ marginTop: '10px' }}>
                      <button
                        type="button"
                        className="btn-next-phase"
                        onClick={() => handleSelectPhase('orbital-alpha')}
                      >
                        🚀 ALL 4 SYSTEMS READY · PROCEED TO ORBIT BURN ▶
                      </button>
                    </div>
                  )}

                  {/* Inline Warning if Missing Parts */}
                  {state.assemblyWarning && (
                    <div className="assembly-warning-banner" role="alert">
                      <p>{state.assemblyWarning}</p>
                      <button
                        type="button"
                        className="btn-hint-link"
                        onClick={() => handleOpenHintChapter(1)}
                      >
                        Read: Parts of a Rocket ▶
                      </button>
                    </div>
                  )}
                </section>
              )}

              {/* Bottom Left: ORBITAL ALPHA BURN CONTROLS */}
              {state.activePhase === 'orbital-alpha' && (
                <section className="systems-copy hud-cut burn-controls-panel" aria-label="Orbit Burn Control">
                  <p className="section-kicker">ORBIT BURN CONTROL / PROTON-M</p>
                  <h1>Orbital Insertion Burn</h1>

                  {/* Next Phase Lock Callout Banner */}
                  {!state.burnCleared ? (
                    <div className="phase-lock-callout locked" role="alert">
                      <span className="lock-tag-icon">🔒</span>
                      <div className="lock-callout-text">
                        <b>ORBITAL BETA LOCKED</b>
                        <span>Achieve stable circular orbit (~7.8 km/s at 100% thrust) to unlock flight experiments.</span>
                      </div>
                    </div>
                  ) : (
                    <div className="phase-lock-callout unlocked">
                      <span className="lock-tag-icon">🔓</span>
                      <div className="lock-callout-text">
                        <b>ORBITAL BETA UNLOCKED!</b>
                        <span>Orbital insertion verified. Proceed to flight experiments.</span>
                      </div>
                    </div>
                  )}

                  {/* Altitude Selector */}
                  <div className="altitude-selector-group">
                    <span>ALTITUDE:</span>
                    {([300, 500, 900] as const).map((alt) => (
                      <button
                        key={alt}
                        type="button"
                        className={`altitude-btn ${state.altitude === alt ? 'active' : ''}`}
                        onClick={() => {
                          cockpitAudio.playClick()
                          setState((prev) => ({ ...prev, altitude: alt }))
                        }}
                      >
                        {alt} KM
                      </button>
                    ))}
                  </div>

                  {/* Thrust Slider */}
                  <div className="thrust-slider-box">
                    <div className="thrust-slider-header">
                      <label htmlFor="alpha-thrust">THRUST VELOCITY</label>
                      <span className="thrust-readout-badge">
                        VELOCITY {state.thrustPct}% · {displayKmPerSec.toFixed(1)} km/s
                      </span>
                    </div>
                    <input
                      id="alpha-thrust"
                      type="range"
                      min="0"
                      max="150"
                      step="1"
                      className="thrust-range-input"
                      value={state.thrustPct}
                      aria-label="Thrust percentage"
                      aria-valuetext={`Velocity ${state.thrustPct} percent of circular orbit speed`}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10)
                        setState((prev) => ({ ...prev, thrustPct: val }))
                      }}
                    />
                    <div className="thrust-slider-ticks">
                      <span>0% (SUBORBITAL)</span>
                      <span>100% (~7.8 km/s CIRCULAR)</span>
                      <span>150% (ESCAPE)</span>
                    </div>
                  </div>

                  {/* Ignite / Reset Actions */}
                  <div className="burn-actions-row">
                    <button
                      type="button"
                      className="btn-ignite"
                      onClick={isSimulating ? handleFastForward : () => handleIgnite()}
                    >
                      {isSimulating ? 'SIMULATING (FAST-FORWARD ⏭)' : 'IGNITE ENGINE ▶'}
                    </button>
                    <button
                      type="button"
                      className="btn-reset-burn"
                      onClick={handleReset}
                    >
                      RESET
                    </button>
                  </div>

                  {/* Outcome Banner */}
                  {state.lastOutcome && (
                    <div
                      role="status"
                      aria-live="polite"
                      className={`outcome-banner is-${
                        state.lastOutcome.outcome === 'CRASH'
                          ? 'crash'
                          : state.lastOutcome.outcome === 'ESCAPE'
                          ? 'escape'
                          : state.lastOutcome.outcome === 'STABLE'
                          ? 'stable'
                          : 'decay'
                      }`}
                    >
                      <div className="outcome-header">
                        <h4 className="outcome-title">{state.lastOutcome.reason}</h4>
                        <span className="outcome-badge">
                          {state.lastOutcome.outcome === 'STABLE' ? 'INSERTION CLEARED ✓' : 'FAILED'}
                        </span>
                      </div>
                      <p className="outcome-why">
                        {state.lastOutcome.outcome === 'CRASH'
                          ? 'Forward velocity was too low to counterbalance gravity, leading to surface collision.'
                          : state.lastOutcome.outcome === 'ESCAPE'
                          ? 'Kinetic energy overcame Earth’s gravitational well, losing orbital capture.'
                          : state.lastOutcome.outcome === 'STABLE'
                          ? 'Forward momentum perfectly balances gravitational acceleration into a circular orbit!'
                          : 'Forward velocity was insufficient to maintain periapsis above atmospheric drag.'}
                      </p>

                      {/* Direct Next Step to Orbital Beta */}
                      {state.lastOutcome.outcome === 'STABLE' ? (
                        <div className="outcome-next-step">
                          <button
                            type="button"
                            className="btn-next-phase"
                            onClick={() => handleSelectPhase('orbital-beta')}
                          >
                            ✓ INSERTION CONFIRMED · ADVANCE TO EXPERIMENTS (ORBITAL BETA) ▶
                          </button>
                        </div>
                      ) : (
                        <div className="outcome-next-step">
                          <p style={{ margin: '4px 0 0', fontSize: '10px', color: '#fed7aa' }}>
                            💡 Tip: Circular orbit speed is ~7.8 km/s (set Thrust to 100% at 500 km altitude). Adjust slider and ignite again.
                          </p>
                        </div>
                      )}

                      <div className="outcome-actions">
                        {state.lastOutcome.chapter && (
                          <button
                            type="button"
                            className="btn-hint-link"
                            onClick={() => handleOpenHintChapter(state.lastOutcome!.chapter!)}
                          >
                            READ: {handbookData[state.lastOutcome.chapter].title} ▶
                          </button>
                        )}
                        <button type="button" className="btn-hint-link" onClick={handleReset}>
                          RETRY ↺
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Warning / Feedback Banner */}
                  {state.assemblyWarning && (
                    <div className="assembly-warning-banner" role="alert" style={{ marginTop: '8px' }}>
                      <p>{state.assemblyWarning}</p>
                    </div>
                  )}
                </section>
              )}

              {/* Bottom Left: ORBITAL BETA CHALLENGES */}
              {state.activePhase === 'orbital-beta' && (
                <section className="systems-copy hud-cut burn-controls-panel" aria-label="Orbital Challenges">
                  <p className="section-kicker">ORBITAL BETA / EXPERIMENTS</p>
                  <h1>Flight Experiments</h1>

                  {/* Next Phase Lock Callout Banner */}
                  {state.completedChallenges.length < 3 ? (
                    <div className="phase-lock-callout locked" role="alert">
                      <span className="lock-tag-icon">🔒</span>
                      <div className="lock-callout-text">
                        <b>LAUNCH GATE LOCKED</b>
                        <span>Complete all 3 flight experiments ({state.completedChallenges.length}/3 completed) to unlock qualification launch.</span>
                      </div>
                    </div>
                  ) : (
                    <div className="phase-lock-callout unlocked">
                      <span className="lock-tag-icon">🔓</span>
                      <div className="lock-callout-text">
                        <b>LAUNCH GATE UNLOCKED!</b>
                        <span>All 3 flight experiments verified. Proceed to qualification launch.</span>
                      </div>
                    </div>
                  )}

                  {/* 3 Challenge Deck Tabs */}
                  <div className="challenges-deck" role="tablist">
                    {(
                      [
                        { id: 'ball-on-string', label: '01 Tether' },
                        { id: 'unstable-orbit', label: '02 Decay' },
                        { id: 'retro-burn', label: '03 Retro' },
                      ] as const
                    ).map((c) => {
                      const isCompleted = state.completedChallenges.includes(c.id)
                      return (
                        <button
                          key={c.id}
                          type="button"
                          className={`challenge-tab-btn ${
                            state.activeChallenge === c.id ? 'active' : ''
                          } ${isCompleted ? 'is-completed' : ''}`}
                          onClick={() => {
                            cockpitAudio.playClick()
                            setState((prev) => ({
                              ...prev,
                              activeChallenge: c.id,
                              lastOutcome: null,
                            }))
                            setSimState(null)
                          }}
                        >
                          {c.label} {isCompleted && '✓'}
                        </button>
                      )
                    })}
                  </div>

                  {/* Challenge 1: Ball on a String */}
                  {state.activeChallenge === 'ball-on-string' && (
                    <>
                      <p style={{ color: '#e5d8d0', fontSize: '11px', margin: '0 0 6px' }}>
                        <b>Objective:</b> Spacecraft starts in circular orbit. Press RELEASE to cut gravity (a = 0) and observe tangential straight-line drift.
                      </p>
                      <div className="burn-actions-row">
                        <button
                          type="button"
                          className="btn-ignite"
                          onClick={() => handleCutGravity()}
                          disabled={isSimulating}
                        >
                          RELEASE GRAVITY (a = 0) ▶
                        </button>
                        <button type="button" className="btn-reset-burn" onClick={handleReset}>
                          RESET
                        </button>
                      </div>
                    </>
                  )}

                  {/* Challenge 2: Unstable Orbit */}
                  {state.activeChallenge === 'unstable-orbit' && (
                    <>
                      <p style={{ color: '#e5d8d0', fontSize: '11px', margin: '0 0 6px' }}>
                        <b>Objective:</b> Deliberately configure an unstable decay orbit. Choose thrust (80%–94%) that completes a visible arc with periapsis &lt; 1.0.
                      </p>
                      <div className="thrust-slider-box">
                        <div className="thrust-slider-header">
                          <label htmlFor="unstable-thrust">THRUST VELOCITY</label>
                          <span className="thrust-readout-badge">{state.thrustPct}%</span>
                        </div>
                        <input
                          id="unstable-thrust"
                          type="range"
                          min="70"
                          max="110"
                          step="1"
                          className="thrust-range-input"
                          value={state.thrustPct}
                          aria-label="Unstable orbit thrust"
                          aria-valuetext={`Velocity ${state.thrustPct} percent`}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10)
                            setState((prev) => ({ ...prev, thrustPct: val }))
                          }}
                        />
                      </div>
                      <div className="burn-actions-row">
                        <button
                          type="button"
                          className="btn-ignite"
                          onClick={isSimulating ? handleFastForward : () => handleIgnite()}
                        >
                          {isSimulating ? 'SIMULATING (FAST-FORWARD ⏭)' : 'TEST DECAY ORBIT ▶'}
                        </button>
                        <button type="button" className="btn-reset-burn" onClick={handleReset}>
                          RESET
                        </button>
                      </div>
                    </>
                  )}

                  {/* Challenge 3: Retro Burn */}
                  {state.activeChallenge === 'retro-burn' && (
                    <>
                      <p style={{ color: '#e5d8d0', fontSize: '11px', margin: '0 0 6px' }}>
                        <b>Objective:</b> Execute a retrograde de-orbit burn. Remove forward velocity (0%–30%) to lower periapsis for atmospheric re-entry.
                      </p>
                      <div className="thrust-slider-box">
                        <div className="thrust-slider-header">
                          <label htmlFor="retro-slider">RETROGRADE DELTA-V</label>
                          <span className="thrust-readout-badge">-{state.retroPct}% VELOCITY</span>
                        </div>
                        <input
                          id="retro-slider"
                          type="range"
                          min="0"
                          max="30"
                          step="1"
                          className="thrust-range-input"
                          value={state.retroPct}
                          aria-label="Retro burn velocity reduction"
                          aria-valuetext={`Retrograde burn ${state.retroPct} percent velocity reduction`}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10)
                            setState((prev) => ({ ...prev, retroPct: val }))
                          }}
                        />
                      </div>
                      <div className="burn-actions-row">
                        <button
                          type="button"
                          className="btn-ignite"
                          onClick={isSimulating ? handleFastForward : () => handleIgnite()}
                        >
                          {isSimulating ? 'SIMULATING (FAST-FORWARD ⏭)' : 'FIRE RETRO ENGINES ▶'}
                        </button>
                        <button type="button" className="btn-reset-burn" onClick={handleReset}>
                          RESET
                        </button>
                      </div>
                    </>
                  )}

                  {/* Challenge Outcome Banner */}
                  {state.lastOutcome && (
                    <div
                      role="status"
                      aria-live="polite"
                      className={`outcome-banner is-${
                        state.lastOutcome.outcome === 'STABLE'
                          ? 'stable'
                          : state.lastOutcome.outcome === 'CRASH'
                          ? 'crash'
                          : 'decay'
                      }`}
                    >
                      <div className="outcome-header">
                        <h4 className="outcome-title">{state.lastOutcome.reason}</h4>
                        <span className="outcome-badge">
                          {state.completedChallenges.includes(state.activeChallenge) ? 'VERIFIED ✓' : 'TESTED'}
                        </span>
                      </div>
                      <p className="outcome-why">
                        {state.activeChallenge === 'ball-on-string'
                          ? 'Without centripetal gravity, inertial momentum preserves velocity vector in a straight line.'
                          : state.activeChallenge === 'unstable-orbit'
                          ? 'Insufficient tangential momentum allowed gravity to overcome orbital altitude into atmospheric entry.'
                          : 'Retrograde burn reduced forward kinetic energy, dropping periapsis into Earth’s re-entry zone.'}
                      </p>

                      {/* Dynamic Next Step for Orbital Beta */}
                      <div className="outcome-next-step">
                        {state.activeChallenge === 'ball-on-string' && (
                          <button
                            type="button"
                            className="btn-next-phase"
                            onClick={() => handleSelectChallenge('unstable-orbit')}
                          >
                            EXPERIMENT 01 VERIFIED ✓ · NEXT: 02 DECAY ORBIT ▶
                          </button>
                        )}
                        {state.activeChallenge === 'unstable-orbit' && (
                          <button
                            type="button"
                            className="btn-next-phase"
                            onClick={() => handleSelectChallenge('retro-burn')}
                          >
                            EXPERIMENT 02 VERIFIED ✓ · NEXT: 03 RETROGRADE BURN ▶
                          </button>
                        )}
                        {state.activeChallenge === 'retro-burn' && (
                          <>
                            {state.completedChallenges.length >= 3 ? (
                              <button
                                type="button"
                                className="btn-next-phase"
                                onClick={() => handleSelectPhase('launch-sequence')}
                              >
                                🚀 ALL 3 EXPERIMENTS COMPLETE · ADVANCE TO LAUNCH GATE ▶
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="btn-next-phase"
                                onClick={() => handleSelectChallenge('ball-on-string')}
                              >
                                REVIEW INCOMPLETE EXPERIMENTS ▶
                              </button>
                            )}
                          </>
                        )}
                      </div>

                      <div className="outcome-actions">
                        <button
                          type="button"
                          className="btn-hint-link"
                          onClick={() =>
                            handleOpenHintChapter(
                              state.activeChallenge === 'ball-on-string'
                                ? 3
                                : state.activeChallenge === 'unstable-orbit'
                                ? 6
                                : 7
                            )
                          }
                        >
                          READ RELEVANT LESSON ▶
                        </button>
                        <button type="button" className="btn-hint-link" onClick={handleReset}>
                          RETRY ↺
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Warning / Feedback Banner */}
                  {state.assemblyWarning && (
                    <div className="assembly-warning-banner" role="alert" style={{ marginTop: '8px' }}>
                      <p>{state.assemblyWarning}</p>
                    </div>
                  )}
                </section>
              )}

              {/* Bottom Left: LAUNCH SEQUENCE (Final Gate) */}
              {state.activePhase === 'launch-sequence' && (
                <section className="systems-copy hud-cut burn-controls-panel" aria-label="Launch Sequence Final Gate">
                  <p className="section-kicker">MISSION QUALIFICATION / LAUNCH GATE</p>
                  <h1>Final Launch Run</h1>

                  {/* Next Phase Lock Callout Banner */}
                  {!state.levelComplete ? (
                    <div className="phase-lock-callout locked" role="alert">
                      <span className="lock-tag-icon">🔒</span>
                      <div className="lock-callout-text">
                        <b>LEVEL 3: STATION DOCKING LOCKED</b>
                        <span>Achieve stable circular insertion (1–3★) to qualify and unlock Level 3.</span>
                      </div>
                    </div>
                  ) : (
                    <div className="phase-lock-callout unlocked">
                      <span className="lock-tag-icon">🔓</span>
                      <div className="lock-callout-text">
                        <b>LEVEL 3: STATION DOCKING UNLOCKED!</b>
                        <span>Qualification launch cleared ({state.stars}★ rating). Ready for Station Docking.</span>
                      </div>
                    </div>
                  )}

                  <div className="launch-score-hud">
                    <span style={{ fontSize: '11px', color: '#c4a495', fontWeight: 700 }}>
                      ATTEMPTS: {state.launchAttempts}/3
                    </span>
                    <div className="stars-row" aria-label={`Score: ${state.stars} out of 3 stars`}>
                      {[1, 2, 3].map((starIdx) => (
                        <span
                          key={starIdx}
                          className={`star-icon ${starIdx <= state.stars ? 'earned' : ''}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Thrust Slider */}
                  <div className="thrust-slider-box">
                    <div className="thrust-slider-header">
                      <label htmlFor="launch-thrust">THRUST VELOCITY</label>
                      <span className="thrust-readout-badge">
                        {state.thrustPct}% · {displayKmPerSec.toFixed(1)} km/s
                      </span>
                    </div>
                    <input
                      id="launch-thrust"
                      type="range"
                      min="0"
                      max="150"
                      step="1"
                      className="thrust-range-input"
                      value={state.thrustPct}
                      aria-label="Final launch thrust percentage"
                      aria-valuetext={`Velocity ${state.thrustPct} percent`}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10)
                        setState((prev) => ({ ...prev, thrustPct: val }))
                      }}
                    />
                  </div>

                  <div className="burn-actions-row">
                    <button
                      type="button"
                      className="btn-ignite"
                      onClick={isSimulating ? handleFastForward : () => handleIgnite()}
                    >
                      {isSimulating ? 'EXECUTING (FAST-FORWARD ⏭)' : 'EXECUTE QUALIFICATION LAUNCH ▶'}
                    </button>
                    <button type="button" className="btn-reset-burn" onClick={handleReset}>
                      RESET
                    </button>
                  </div>

                  {state.lastOutcome && (
                    <div
                      role="status"
                      aria-live="polite"
                      className={`outcome-banner is-${
                        state.lastOutcome.outcome === 'STABLE' ? 'stable' : 'crash'
                      }`}
                    >
                      <div className="outcome-header">
                        <h4 className="outcome-title">{state.lastOutcome.reason}</h4>
                        <span className="outcome-badge">
                          {state.levelComplete ? `${state.stars}★ RATED` : 'FAILED'}
                        </span>
                      </div>
                      <p className="outcome-why">
                        {state.lastOutcome.outcome === 'STABLE'
                          ? `Orbital insertion confirmed with eccentricity e=${(
                              simState?.eccentricity || 0
                            ).toFixed(3)}. Rating: ${state.stars}★.`
                          : 'Trajectory failed qualification. Adjust thrust velocity and retry.'}
                      </p>

                      {state.levelComplete && onNext && (
                        <div className="outcome-next-step">
                          <button
                            type="button"
                            className="btn-next-phase"
                            onClick={() => {
                              cockpitAudio.playClick()
                              onNext()
                            }}
                          >
                            🚀 MISSION CLEARED ({state.stars}★) · ADVANCE TO LEVEL 3 (STATION DOCKING) ▶
                          </button>
                        </div>
                      )}

                      <div className="outcome-actions">
                        <button type="button" className="btn-hint-link" onClick={handleReset}>
                          RETRY RUN ↺
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Warning / Feedback Banner */}
                  {state.assemblyWarning && (
                    <div className="assembly-warning-banner" role="alert" style={{ marginTop: '8px' }}>
                      <p>{state.assemblyWarning}</p>
                    </div>
                  )}
                </section>
              )}
            </div>

            {/* Center Panel: Proton-M Rocket Diagram with Live Assembly Status */}
            <RocketBlueprint
              view={state.selectedStageView}
              installedParts={state.installedParts}
              isSimulating={isSimulating}
              onSelectView={(v) => {
                cockpitAudio.playClick()
                setState((prev) => ({ ...prev, selectedStageView: v }))
              }}
            />
          </div>
        </main>

        {/* Right Sidebar: Handbook & Case Summary */}
        <aside className="handbook-sidebar">
          <div className="handbook-tabs">
            <button
              className={state.activeTab === 'case' ? 'active' : ''}
              type="button"
              onClick={() => {
                cockpitAudio.playClick()
                setState((prev) => ({ ...prev, activeTab: 'case' }))
              }}
            >
              Case
            </button>
            <button
              className={state.activeTab === 'handbook' ? 'active' : ''}
              type="button"
              onClick={() => {
                cockpitAudio.playClick()
                setState((prev) => ({ ...prev, activeTab: 'handbook' }))
              }}
            >
              Handbook
            </button>
          </div>

          {state.activeTab === 'handbook' ? (
            <nav className="handbook-list" aria-label="Handbook lessons">
              <p>NAVIGATION HANDBOOK</p>

              {/* Reader View if a Chapter is Selected */}
              {selectedChapter !== null && handbookData[selectedChapter] && (
                <div className="handbook-reader-view" role="region" aria-label="Chapter Content">
                  <div className="handbook-reader-header">
                    <h2>{handbookData[selectedChapter].title}</h2>
                    <button
                      type="button"
                      className="btn-close-reader"
                      aria-label="Close chapter reader"
                      onClick={() => setSelectedChapter(null)}
                    >
                      ×
                    </button>
                  </div>
                  <span style={{ fontSize: '9px', color: '#6d9aa4', fontWeight: 700 }}>
                    {handbookData[selectedChapter].kicker}
                  </span>
                  <p>{handbookData[selectedChapter].content}</p>
                </div>
              )}

              {/* 7 Chapter Buttons */}
              {([1, 2, 3, 4, 5, 6, 7] as const).map((chapNum) => {
                const item = handbookData[chapNum]
                const isUnlocked = state.unlockedChapters.includes(chapNum)
                const isNew = isUnlocked && !state.seenChapters.includes(chapNum)
                const isActive = selectedChapter === chapNum

                return (
                  <button
                    className={`${isActive ? 'active' : ''} ${!isUnlocked ? 'is-locked' : ''}`}
                    type="button"
                    key={chapNum}
                    aria-label={`Chapter 0${chapNum}: ${item.title} (${
                      isUnlocked ? 'Unlocked' : 'Locked, click twice to unlock'
                    })`}
                    onClick={() => handleChapterClick(chapNum)}
                  >
                    <span>0{chapNum}</span>
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      {item.title}
                      {!isUnlocked && <span className="handbook-lock-tag">🔒</span>}
                      {isNew && <span className="handbook-new-badge">NEW</span>}
                    </span>
                  </button>
                )
              })}
            </nav>
          ) : (
            <div className="case-summary">
              <p>ACTIVE CASE</p>
              <h2>PROTON-M / ORBITAL ACADEMY</h2>
              <dl>
                <div>
                  <dt>Objective</dt>
                  <dd>
                    {state.activePhase === 'systems'
                      ? 'Assemble all 4 rocket modules'
                      : state.activePhase === 'orbital-alpha'
                      ? 'Stable Circular Orbit (7.8 km/s)'
                      : state.activePhase === 'orbital-beta'
                      ? 'Orbital Equilibrium Experiments'
                      : 'Final Qualification Insertion'}
                  </dd>
                </div>
                <div>
                  <dt>Vehicle</dt>
                  <dd>Proton-M Heavy Launch Vehicle</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>
                    {state.levelComplete
                      ? 'Orbit Verified (Cleared)'
                      : isAssemblyComplete(state.installedParts)
                      ? 'Systems Ready · Flight Testing'
                      : 'Assembly in Progress'}
                  </dd>
                </div>
              </dl>
            </div>
          )}

          {/* Sequential Advance Banner: LOCKED until Final Launch Sequence is Cleared */}
          {onNext && (
            <>
              {state.levelComplete ? (
                <div
                  className="campaign-advance-banner"
                  style={{ margin: '14px 0 0', padding: '12px' }}
                >
                  <div className="campaign-advance-info">
                    <h3 style={{ fontSize: '13px' }}>🚀 ORBIT ACHIEVED</h3>
                    <p style={{ fontSize: '11px' }}>
                      Proton-M launch systems and orbit mechanics verified ({state.stars}★).
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
                    LEVEL 3: DOCKING ▶
                  </button>
                </div>
              ) : (
                <div
                  className="campaign-advance-banner is-locked"
                  style={{ margin: '14px 0 0', padding: '12px' }}
                >
                  <div className="campaign-advance-info">
                    <h3 style={{ fontSize: '12px' }}>🔒 ORBIT NOT YET ACHIEVED</h3>
                    <p style={{ fontSize: '10px' }}>
                      Complete launch sequence simulation to unlock Level 3.
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled
                    className="campaign-advance-btn is-disabled"
                    style={{ padding: '8px 14px', fontSize: '11px' }}
                  >
                    LOCKED
                  </button>
                </div>
              )}
            </>
          )}

          {/* Sidebar Footer: Glossary & Mute Buttons */}
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
            <button type="button" onClick={handleToggleMute}>
              {muted ? 'Unmute' : 'Mute'}
            </button>
          </div>

          {showGlossary && (
            <div className="glossary-popover" role="dialog" aria-label="Flight Glossary">
              <button
                type="button"
                aria-label="Close glossary"
                onClick={() => setShowGlossary(false)}
              >
                ×
              </button>
              <h2>Flight Glossary</h2>
              <p>
                <b>Thrust</b> — force that propels a rocket forward.
              </p>
              <p>
                <b>Payload</b> — cargo or spacecraft carried by a rocket.
              </p>
              <p>
                <b>Orbit</b> — a curved path around a planet caused by continuously falling toward it while moving sideways at high velocity.
              </p>
              <p>
                <b>Velocity</b> — speed with direction required to balance gravitational pull.
              </p>
              <p>
                <b>Unstable Orbit</b> — orbital decay caused when forward velocity drops below the gravitational equilibrium threshold.
              </p>
              <p>
                <b>Periapsis & Apoapsis</b> — the lowest (PE) and highest (AP) points of an orbital path.
              </p>
            </div>
          )}
        </aside>
      </div>
    </section>
  )
}
