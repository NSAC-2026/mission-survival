'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import { cockpitAudio } from '@/utils/audio'
import { getSpaceWeatherReport, NASA_DONKI_ARCHIVE_EVENTS, type SpaceWeatherReport } from '@/utils/nasaDonki'
import {
  Shield,
  Backpack,
  Rocket,
  Star,
  Check,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Settings,
  X,
  Droplets,
  Zap,
  ShieldAlert,
  Flame,
  Lightbulb,
  Sparkles,
  Radio,
  ChevronRight,
  Trophy,
  Award,
  Plus,
} from 'lucide-react'

// Custom astronaut helmet icon tailored to the spacesuit HUD aesthetic
function HelmetIcon({ className = 'w-6 h-6', ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 3a9 9 0 0 0-9 9c0 3.6 2.1 6.7 5.2 8.1L8 21h8l-.2-.9A9.01 9.01 0 0 0 21 12a9 9 0 0 0-9-9z" />
      <path d="M7 11.5c0-1.9 2.2-3.5 5-3.5s5 1.6 5 3.5-2.2 3.5-5 3.5-5-1.6-5-3.5z" />
      <line x1="12" y1="3" x2="12" y2="5" />
    </svg>
  )
}

// Quest types
type QuestId = 1 | 2 | 3

interface GearPiece {
  id: 'helmet' | 'torso' | 'backpack' | 'jetpack'
  name: string
  kicker: string
  icon: React.ComponentType<{ className?: string }>
  fact: string
  tag: string
}

const GEAR_ITEMS: GearPiece[] = [
  {
    id: 'helmet',
    name: 'Gold UV Visor Helmet',
    kicker: 'RADIATION & IMPACT SHIELD',
    icon: HelmetIcon,
    fact: 'Coated in real 24-karat gold foil! It reflects blinding solar rays while letting astronauts see crystal clear.',
    tag: '24K GOLD VISOR',
  },
  {
    id: 'torso',
    name: 'Hard Upper Torso (HUT)',
    kicker: 'MICROMETEORITE ARMOR',
    icon: Shield,
    fact: 'Built with 7 layers of bulletproof Ortho-Fabric to deflect tiny orbital space rocks traveling at 28,000 km/h!',
    tag: '7-PLY ORTHO FABRIC',
  },
  {
    id: 'backpack',
    name: 'ECLSS Life-Support Pack',
    kicker: 'OXYGEN & LIQUID COOLING',
    icon: Backpack,
    fact: 'Supplies 100% pure oxygen and pumps chilled 8°C water through 90 meters of tiny tubes to stop overheating.',
    tag: '5.9 MPA O2 TANKS',
  },
  {
    id: 'jetpack',
    name: 'SAFER Jetpack Thrusters',
    kicker: 'EMERGENCY FLYING GEAR',
    icon: Rocket,
    fact: 'Equipped with 24 cold-gas nitrogen thrusters! If a tether snaps, astronauts use a mini joystick to fly back.',
    tag: '24 N2 THRUSTERS',
  },
]

const SPACE_FACTS = [
  'Did you know? In zero gravity, astronauts grow up to 2 inches (5 cm) taller because their spines stretch out!',
  'Space suits weigh 310 pounds (140 kg) on Earth, but in orbit they feel completely weightless!',
  'The gold layer on astronaut visors is so thin you can see through it like high-tech sunglasses!',
  'Water is one of the best shields against space radiation because hydrogen atoms absorb speeding protons!',
  'NASA DONKI watches solar storms using satellites parked 1 million miles away between Earth and the Sun!',
]

export default function AstronautProfile({
  onBack,
  onNext,
}: {
  onBack: () => void
  onNext?: () => void
}) {
  // Navigation & Quest State
  const [activeQuest, setActiveQuest] = useState<QuestId>(1)
  const [completedQuests, setCompletedQuests] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState<'missions' | 'handbook'>('missions')
  const [muted, setMuted] = useState(false)
  const [showGlossary, setShowGlossary] = useState(false)
  const [triviaIndex, setTriviaIndex] = useState(0)

  // QUEST 1: SUIT UP WORKBENCH
  const [equipped, setEquipped] = useState<Record<string, boolean>>({
    helmet: false,
    torso: false,
    backpack: false,
    jetpack: false,
  })

  // QUEST 2: NASA DONKI STORM DEFENSE
  const [stepIngress, setStepIngress] = useState(false)
  const [stepWaterwall, setStepWaterwall] = useState(false)
  const [stepShield, setStepShield] = useState(false)
  const [isSurging, setIsSurging] = useState(false)
  const [stormDefended, setStormDefended] = useState(false)
  const [report, setReport] = useState<SpaceWeatherReport>(NASA_DONKI_ARCHIVE_EVENTS[0])
  const [userKey, setUserKey] = useState('')
  const [showKeyModal, setShowKeyModal] = useState(false)
  const [isLoadingApi, setIsLoadingApi] = useState(false)

  // QUEST 3: ROCKET BALANCER
  const [cargo, setCargo] = useState(56) // Cargo mass % (Ideal <= 78)
  const [fuel, setFuel] = useState(74)   // Propellant % (Ideal >= 65)
  const [isLaunching, setIsLaunching] = useState(false)
  const [isLaunched, setIsLaunched] = useState(false)
  const [launchStatus, setLaunchStatus] = useState('')

  // Victory Overlay
  const [showVictory, setShowVictory] = useState(false)
  const [victoryMessage, setVictoryMessage] = useState<{
    title: string
    desc: string
    badge: string
    badgeIcon: React.ComponentType<{ className?: string }>
    actionLabel: string
    action: () => void
  } | null>(null)

  // Canvas ref for victory confetti
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Fetch NASA Space Weather report
  useEffect(() => {
    let mounted = true
    getSpaceWeatherReport().then((data) => {
      if (mounted) setReport(data)
    })
    return () => {
      mounted = false
    }
  }, [])

  // Rotate trivia every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setTriviaIndex((prev) => (prev + 1) % SPACE_FACTS.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [])

  // Calculate XP (100 per quest)
  const currentXP = useMemo(() => {
    let xp = 0
    // Quest 1 gear: 25 XP each
    Object.values(equipped).forEach((val) => {
      if (val) xp += 25
    })
    // Quest 2 defense: +100 XP if survived
    if (stormDefended) xp += 100
    // Quest 3 launch: +100 XP if launched
    if (isLaunched) xp += 100
    return Math.min(300, xp)
  }, [equipped, stormDefended, isLaunched])

  const cadetRank = useMemo(() => {
    if (currentXP >= 300) return { title: 'Certified Flight Astronaut', stars: 3 }
    if (currentXP >= 200) return { title: 'Mission Payload Specialist', stars: 2 }
    if (currentXP >= 100) return { title: 'Space Cadet Officer', stars: 1 }
    return { title: 'Junior Flight Recruit', stars: 0 }
  }, [currentXP])

  // QUEST 1: Toggle gear pieces
  const toggleGear = (id: 'helmet' | 'torso' | 'backpack' | 'jetpack') => {
    cockpitAudio.playClick()
    const nextVal = !equipped[id]
    const nextEquipped = { ...equipped, [id]: nextVal }
    setEquipped(nextEquipped)

    if (nextVal) {
      cockpitAudio.playLockChime()
    } else {
      cockpitAudio.playHover()
    }

    // Check if all 4 are now equipped!
    const allEquipped = Object.values(nextEquipped).every(Boolean)
    if (allEquipped && !completedQuests.includes(1)) {
      setCompletedQuests((prev) => [...prev, 1])
      cockpitAudio.playSuccessChime()
      setTimeout(() => {
        setVictoryMessage({
          title: 'SUIT UP COMPLETE!',
          desc: 'Commander Vega is 100% suited up and protected! All 4 life-support modules are online. But NASA DONKI radar just flagged an incoming solar radiation storm!',
          badge: 'EMU SUIT MASTER BADGE',
          badgeIcon: Shield,
          actionLabel: 'PROCEED TO MISSION 2: STORM DEFENSE',
          action: () => {
            setShowVictory(false)
            setActiveQuest(2)
          },
        })
        setShowVictory(true)
      }, 500)
    }
  }

  const suitReadinessPercent = useMemo(() => {
    const count = Object.values(equipped).filter(Boolean).length
    return count * 25
  }, [equipped])

  // QUEST 2: Defense calculation
  const defenseScore = (stepIngress ? 1 : 0) + (stepWaterwall ? 1 : 0) + (stepShield ? 1 : 0)
  const isStormSafe = defenseScore === 3

  const handleTestStorm = () => {
    cockpitAudio.playClick()
    setIsSurging(true)

    setTimeout(() => {
      setIsSurging(false)
      if (isStormSafe) {
        cockpitAudio.playSuccessChime()
        setStormDefended(true)
        if (!completedQuests.includes(2)) {
          setCompletedQuests((prev) => [...prev, 2])
        }
        setVictoryMessage({
          title: 'SOLAR STORM DEFENDED!',
          desc: 'Awesome job Cadet! The astronaut retreated safely inside the airlock, the hydrogen waterwall shielded against neutron scatter, and the 45 kV magnetic coils bounced the solar protons away!',
          badge: 'SOLAR SHIELD ACE BADGE',
          badgeIcon: Zap,
          actionLabel: 'PROCEED TO MISSION 3: ROCKET BALANCER',
          action: () => {
            setShowVictory(false)
            setActiveQuest(3)
          },
        })
        setShowVictory(true)
      } else {
        cockpitAudio.playAlarmBeep()
      }
    }, 1800)
  }

  // QUEST 3: Balance logic
  const isCargoSafe = cargo <= 78
  const isFuelSafe = fuel >= 65
  const isBalanced = isCargoSafe && isFuelSafe
  const cgPercent = Math.max(25, Math.min(65, 50 + (cargo - 56) * 0.3 - (fuel - 74) * 0.2))
  const rocketTiltDeg = isBalanced ? 0 : cargo > 78 ? 7.5 : -7.5

  const handleLaunchRocket = () => {
    if (!isBalanced) {
      cockpitAudio.playAlarmBeep()
      setLaunchStatus('WARNING: Center of Gravity off balance! Adjust cargo or fuel.')
      return
    }

    cockpitAudio.playClick()
    setIsLaunching(true)
    setLaunchStatus('T-MINUS 3... ENGINES IGNITED!')

    setTimeout(() => {
      cockpitAudio.playThrusterPuff()
      setLaunchStatus('LIFTOFF! CLEARING THE TOWER!')
    }, 1000)

    setTimeout(() => {
      setIsLaunching(false)
      setIsLaunched(true)
      cockpitAudio.playLockChime()
      if (!completedQuests.includes(3)) {
        setCompletedQuests((prev) => [...prev, 3])
      }
      setVictoryMessage({
        title: 'LEVEL 1 MISSION COMPLETE!',
        desc: 'Incredible work, Cadet! You suited up the astronaut, tackled NASA DONKI space weather, and achieved perfect rocket balance for blast-off! You are now fully certified for Level 2!',
        badge: 'CERTIFIED FLIGHT ASTRONAUT',
        badgeIcon: Trophy,
        actionLabel: 'LAUNCH LEVEL 2: PROTON ROCKET',
        action: () => {
          setShowVictory(false)
          if (onNext) onNext()
        },
      })
      setShowVictory(true)
    }, 2800)
  }

  // Refresh NASA API
  const handleRefreshDonki = async () => {
    cockpitAudio.playClick()
    setIsLoadingApi(true)
    try {
      const data = await getSpaceWeatherReport(userKey)
      setReport(data)
    } finally {
      setIsLoadingApi(false)
    }
  }

  // Confetti Particle System
  useEffect(() => {
    if (!showVictory) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.parentElement?.clientWidth || window.innerWidth
    canvas.height = canvas.parentElement?.clientHeight || window.innerHeight

    const particles: Array<{
      x: number
      y: number
      size: number
      color: string
      speedX: number
      speedY: number
      rotation: number
      rotationSpeed: number
    }> = []

    const colors = ['#ffd700', '#ff8c3b', '#7ee7f5', '#48e58a', '#ff4d4d', '#ffffff']

    for (let i = 0; i < 75; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 100,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 4,
        speedY: Math.random() * 4 + 3,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
      })
    }

    let animationFrameId: number
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        p.x += p.speedX
        p.y += p.speedY
        p.rotation += p.rotationSpeed

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7)
        ctx.restore()

        if (p.y > canvas.height) {
          p.y = -10
          p.x = Math.random() * canvas.width
        }
      })
      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [showVictory])

  return (
    <section className="proton-dashboard astronaut-dashboard" aria-label="Astronaut Cadet Academy">
      {/* TOPBAR: Missions Back, Step Pills & Cadet XP */}
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

        {/* 3 Step-by-Step Mission Pills */}
        <div className="cadet-topbar-center">
          <button
            type="button"
            className={`quest-nav-pill ${activeQuest === 1 ? 'active' : ''} ${
              completedQuests.includes(1) ? 'completed' : ''
            }`}
            onClick={() => {
              cockpitAudio.playClick()
              setActiveQuest(1)
            }}
          >
            <span className="quest-pill-num">
              {completedQuests.includes(1) ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : '1'}
            </span>
            <span>MISSION 1: SUIT UP!</span>
          </button>

          <button
            type="button"
            className={`quest-nav-pill ${activeQuest === 2 ? 'active' : ''} ${
              completedQuests.includes(2) ? 'completed' : ''
            }`}
            onClick={() => {
              cockpitAudio.playClick()
              setActiveQuest(2)
            }}
          >
            <span className="quest-pill-num">
              {completedQuests.includes(2) ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : '2'}
            </span>
            <span>MISSION 2: STORM DEFENSE</span>
          </button>

          <button
            type="button"
            className={`quest-nav-pill ${activeQuest === 3 ? 'active' : ''} ${
              completedQuests.includes(3) ? 'completed' : ''
            }`}
            onClick={() => {
              cockpitAudio.playClick()
              setActiveQuest(3)
            }}
          >
            <span className="quest-pill-num">
              {completedQuests.includes(3) ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : '3'}
            </span>
            <span>MISSION 3: ROCKET BALANCER</span>
          </button>
        </div>

        {/* Cadet XP Star Badge */}
        <div className="cadet-xp-badge">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{currentXP} / 300 XP</span>
        </div>
      </header>

      <div className="proton-layout">
        {/* MAIN GAME STAGE */}
        <main className="proton-content">
          {/* ========================================================
              QUEST 1: SUIT UP! (INTERACTIVE GEAR WORKBENCH)
             ======================================================== */}
          {activeQuest === 1 && (
            <div className="suit-builder-grid">
              {/* Visual Interactive Astronaut Workbench */}
              <section className="suit-interactive-stage">
                <div className="suit-readiness-badge">
                  <span>SUIT READINESS:</span>
                  <div className="suit-readiness-bar">
                    <div className="suit-readiness-fill" style={{ width: `${suitReadinessPercent}%` }} />
                  </div>
                  <span>{suitReadinessPercent}%</span>
                </div>

                {/* Live SVG Astronaut that updates when gear is equipped */}
                <svg
                  className="astronaut-blueprint-svg"
                  viewBox="0 0 520 620"
                  role="img"
                  aria-label="Interactive Astronaut Suit Assembly"
                >
                  <defs>
                    <linearGradient id="visorGold" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#ffeb99" />
                      <stop offset="45%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#78350f" />
                    </linearGradient>
                    <filter id="gearGlow">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Blueprint Coordinate Grid */}
                  <g className="blueprint-grid-path">
                    <line x1="40" y1="100" x2="480" y2="100" />
                    <line x1="40" y1="200" x2="480" y2="200" />
                    <line x1="40" y1="300" x2="480" y2="300" />
                    <line x1="40" y1="400" x2="480" y2="400" />
                    <line x1="40" y1="500" x2="480" y2="500" />
                    <line x1="120" y1="40" x2="120" y2="580" />
                    <line x1="260" y1="40" x2="260" y2="580" />
                    <line x1="400" y1="40" x2="400" y2="580" />
                  </g>

                  {/* BASE BODY (Always equipped: legs, boots, base suit) */}
                  <g id="base-astronaut">
                    {/* Legs & Lower Body */}
                    <path
                      className="emu-suit-undergarment"
                      d="M200 370 L180 440 L175 540 L160 580 H235 L245 540 L250 440 L260 380 L270 440 L275 540 L285 580 H360 L345 540 L340 440 L320 370 Z"
                    />
                    {/* Magnetic Boots */}
                    <path d="M155 575 H238 V595 H150 Z" fill="#2d1612" stroke="#ffad66" strokeWidth="1.5" />
                    <path d="M282 575 H365 L370 595 H282 Z" fill="#2d1612" stroke="#ffad66" strokeWidth="1.5" />
                    {/* Base Arms & Gloves */}
                    <path className="emu-suit-undergarment" d="M145 230 L115 320 L110 400 L125 435 H145 L135 395 L145 320 Z" />
                    <path className="emu-suit-undergarment" d="M375 230 L405 320 L410 400 L395 435 H375 L385 395 L375 320 Z" />
                    {/* Undersuit Neck Ring */}
                    <rect x="210" y="165" width="100" height="12" rx="3" fill="#1f0f0c" stroke="#c06834" strokeWidth="1.2" />
                  </g>

                  {/* GEAR 4: SAFER JETPACK THRUSTERS (Behind shoulders) */}
                  {equipped.jetpack && (
                    <g className="emu-equipped-layer" filter="url(#gearGlow)">
                      {/* Left & Right Thruster Pods */}
                      <rect className="safer-thruster-pod" x="115" y="170" width="46" height="75" rx="5" />
                      <rect className="safer-thruster-pod" x="359" y="170" width="46" height="75" rx="5" />
                      {/* Cold-Gas Thruster Nozzles */}
                      <polygon points="110,180 100,175 100,185" fill="#ffd0a0" />
                      <polygon points="110,225 100,220 100,230" fill="#ffd0a0" />
                      <polygon points="410,180 420,175 420,185" fill="#ffd0a0" />
                      <polygon points="410,225 420,220 420,230" fill="#ffd0a0" />
                      <text x="75" y="175" fill="#ffad66" fontSize="9" fontWeight="700">
                        24 N2 THRUSTERS
                      </text>
                    </g>
                  )}

                  {/* GEAR 3: ECLSS LIFE SUPPORT BACKPACK */}
                  {equipped.backpack && (
                    <g className="emu-equipped-layer">
                      {/* PLSS Backpack Frame */}
                      <rect className="eclss-backpack-glow" x="175" y="180" width="170" height="180" rx="12" />
                      {/* Pure Oxygen Dual Tanks */}
                      <rect x="195" y="200" width="38" height="120" rx="8" fill="#1b3338" stroke="#7ee7f5" strokeWidth="1.5" />
                      <rect x="287" y="200" width="38" height="120" rx="8" fill="#1b3338" stroke="#7ee7f5" strokeWidth="1.5" />
                      {/* LiOH CO2 Scrubber */}
                      <rect x="245" y="210" width="30" height="80" rx="4" fill="#30150e" stroke="#ed9255" strokeWidth="1.2" />
                      {/* Chilled Liquid Cooling Garment (LCVG) Water Loops */}
                      <path
                        d="M235 320 C210 350, 195 400, 190 460 M285 320 C310 350, 325 400, 330 460"
                        fill="none"
                        stroke="#5de4eb"
                        strokeWidth="2.5"
                        strokeDasharray="4 2"
                      />
                      <text x="365" y="325" fill="#5de4eb" fontSize="9" fontWeight="700">
                        8°C WATER LOOP
                      </text>
                    </g>
                  )}

                  {/* GEAR 2: HARD UPPER TORSO (HUT) ARMOR */}
                  {equipped.torso && (
                    <g className="emu-equipped-layer">
                      <path
                        className="emu-equipped-armor"
                        d="M170 200 L145 230 L135 320 L180 370 H340 L385 320 L375 230 L350 200 H320 L315 170 H205 L200 200 Z"
                      />
                      {/* Chest Computer Control Module (DCM) */}
                      <rect x="225" y="235" width="70" height="55" rx="4" fill="#120705" stroke="#ed9255" strokeWidth="1.5" />
                      <rect x="233" y="243" width="54" height="18" fill="#051214" stroke="#7ee7f5" strokeWidth="1" />
                      <text x="238" y="256" fill="#7ee7f5" fontFamily="Orbitron" fontSize="9" fontWeight="700">
                        29.6 KPA
                      </text>
                      <circle cx="240" cy="275" r="3" fill="#48e58a" />
                      <circle cx="252" cy="275" r="3" fill="#ffd700" />
                      <circle cx="275" cy="275" r="5" fill="#ed9255" />
                      {/* Joint Mobility Rings */}
                      <ellipse className="emu-joint-rings" cx="140" cy="240" rx="14" ry="8" />
                      <ellipse className="emu-joint-rings" cx="380" cy="240" rx="14" ry="8" />
                      <text x="390" y="235" fill="#ffad66" fontSize="9" fontWeight="700">
                        7-PLY ORTHO FABRIC
                      </text>
                    </g>
                  )}

                  {/* GEAR 1: GOLD UV VISOR HELMET */}
                  {equipped.helmet && (
                    <g className="emu-equipped-layer" filter="url(#gearGlow)">
                      {/* Neck Ring */}
                      <rect x="200" y="160" width="120" height="15" rx="4" fill="#2d1612" stroke="#ffad66" strokeWidth="1.8" />
                      {/* Outer Helmet Dome */}
                      <path
                        d="M205 160 C195 90, 325 90, 315 160 C315 168, 205 168, 205 160 Z"
                        fill="#381a13"
                        stroke="#ed9255"
                        strokeWidth="2"
                      />
                      {/* Reflective 24K Gold Visor */}
                      <path
                        className="emu-visor-gold-foil"
                        d="M218 148 C210 100, 310 100, 302 148 C295 158, 225 158, 218 148 Z"
                      />
                      {/* Visor Sunlight Glare Curve */}
                      <path d="M232 118 C245 108, 275 108, 288 118" fill="none" stroke="#fff" strokeWidth="2.5" />
                      <text x="325" y="115" fill="#ffd700" fontSize="9" fontWeight="700">
                        24K GOLD VISOR
                      </text>
                    </g>
                  )}
                </svg>

                <div className="suit-hint-tag" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  {suitReadinessPercent === 100 ? (
                    <>
                      <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>FULLY EQUIPPED! EMU SPACESUIT IS 100% OPERATIONAL.</span>
                    </>
                  ) : (
                    <>
                      <Radio className="w-4 h-4 text-amber-400 animate-pulse flex-shrink-0" />
                      <span>TAP GEAR MODULES ON THE RIGHT TO EQUIP COMMANDER VEGA!</span>
                    </>
                  )}
                </div>
              </section>

              {/* Gear Selection & Assembly Controls */}
              <section className="sim-terminal hud-cut">
                <div className="terminal-label">MISSION 1 // EMU SUIT WORKBENCH</div>
                <h1 style={{ fontSize: '20px', margin: '4px 0 8px', color: '#fff' }}>Suit Up Commander Vega</h1>
                <p style={{ fontSize: '12px', color: '#ffd0a0', lineHeight: 1.45, margin: '0 0 14px' }}>
                  A spacesuit is an anthropomorphic spacecraft! Equip all 4 essential life-support modules so Commander
                  Vega can step outside into the hostile vacuum of space.
                </p>

                {/* The 4 Gear Selection Cards */}
                <div className="gear-select-cards">
                  {GEAR_ITEMS.map((item) => {
                    const isItemEquipped = equipped[item.id]
                    const ItemIcon = item.icon
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`gear-card-btn ${isItemEquipped ? 'is-equipped' : ''}`}
                        onClick={() => toggleGear(item.id)}
                      >
                        <div className="gear-card-icon">
                          <ItemIcon className="w-5 h-5" />
                        </div>
                        <div className="gear-card-info">
                          <h3>{item.name}</h3>
                          <p>{item.fact}</p>
                        </div>
                        <div className="gear-card-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          {isItemEquipped ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                              <span>EQUIPPED (+25 XP)</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3 text-amber-400 stroke-[2.5]" />
                              <span>TAP TO EQUIP</span>
                            </>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Advance Button */}
                {suitReadinessPercent === 100 && (
                  <button
                    className="campaign-advance-btn"
                    type="button"
                    style={{ width: '100%', padding: '14px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    onClick={() => {
                      cockpitAudio.playClick()
                      setActiveQuest(2)
                    }}
                  >
                    <span>PROCEED TO MISSION 2: DEFEND FROM SOLAR STORM</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </section>
            </div>
          )}

          {/* ========================================================
              QUEST 2: NASA DONKI STORM DEFENSE (ARCADE SIM)
             ======================================================== */}
          {activeQuest === 2 && (
            <div className="storm-game-grid">
              {/* Arcade Space Weather Simulation Stage */}
              <section className={`space-weather-stage ${stepShield ? 'shield-on' : 'shield-off'}`}>
                {/* Blazing Pulsating Sun on Left */}
                <div className="sun-corona" title="Sun Active Region 3664" />

                {/* Continuous Solar Wind & CME Particles */}
                <div className="cme-particle-field" aria-hidden="true">
                  <span className="cme-stream-line" style={{ top: '20%', animationDuration: isSurging ? '0.6s' : '1.3s' }} />
                  <span className="cme-stream-line" style={{ top: '40%', animationDuration: isSurging ? '0.5s' : '1.1s' }} />
                  <span className="cme-stream-line" style={{ top: '60%', animationDuration: isSurging ? '0.7s' : '1.4s' }} />
                  <span className="cme-stream-line" style={{ top: '80%', animationDuration: isSurging ? '0.6s' : '1.2s' }} />
                </div>

                {/* Shockwave Surge Animation when testing */}
                {isSurging && <div className="cme-wave-surge" />}

                {/* Floating Spacewalker (Visible until Ingressed) */}
                {!stepIngress && (
                  <div className="eva-astronaut-floating" title="Spacewalker exposed outside!">
                    <svg viewBox="0 0 50 65" width="46" height="60" aria-label="Spacewalking astronaut">
                      <circle cx="25" cy="16" r="11" fill="#fff" stroke="#ff4d4d" strokeWidth="2" />
                      <rect x="20" y="11" width="10" height="7" rx="2" fill="#ffd700" />
                      <rect x="16" y="27" width="18" height="20" rx="3" fill="#fff" stroke="#ff4d4d" strokeWidth="1.5" />
                      <line x1="20" y1="47" x2="15" y2="62" stroke="#ffad66" strokeWidth="3" />
                      <line x1="30" y1="47" x2="35" y2="62" stroke="#ffad66" strokeWidth="3" />
                    </svg>
                    <span style={{ position: 'absolute', bottom: -14, left: -24, fontSize: '8px', color: '#ff4d4d', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '3px', whiteSpace: 'nowrap' }}>
                      <AlertTriangle className="w-2.5 h-2.5 flex-shrink-0" />
                      <span>EXPOSED OUTSIDE!</span>
                    </span>
                  </div>
                )}

                {/* Spacecraft Habitat Pod Container */}
                <div className="sim-pod-container">
                  {/* Step 3: Active 45,000 Volt Deflection Field Dome */}
                  {stepShield && <div className="magnetic-deflection-dome" title="45 kV Magnetic Forcefield Active" />}

                  {/* Step 2: Hydrogen-Dense Waterwall Storm Bunker */}
                  {stepWaterwall && <div className="waterwall-barrier" title="Hydrogen Waterwall Deployed" />}

                  {/* Spacecraft Pod Hull */}
                  <svg viewBox="0 0 100 120" width="100" height="120" aria-hidden="true" style={{ position: 'relative', zIndex: 5 }}>
                    <path
                      d="M50 10 L88 52 L78 108 H22 L12 52 Z"
                      fill={stepIngress ? '#2b130e' : '#381610'}
                      stroke={stepShield ? '#5de4eb' : '#ff4d4d'}
                      strokeWidth="2.5"
                    />
                    <circle cx="50" cy="58" r="18" fill="#140a08" stroke="#ed9255" strokeWidth="2" />
                    {/* Astronaut visible inside safe cockpit window */}
                    <circle cx="50" cy="58" r="8" fill={stepIngress ? '#48e58a' : '#ff4d4d'} />
                  </svg>

                  {/* Hazard Pulse if unshielded */}
                  {!stepShield && <div className="radiation-hazard-pulse" />}
                </div>
              </section>

              {/* Storm Defense Mission Controls */}
              <section className="sim-terminal hud-cut">
                <div className="terminal-label">MISSION 2 // NASA DONKI SPACE WEATHER ALERT</div>

                {/* NASA Live API Connection Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '4px 0 10px', fontSize: '9px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: report.isLive ? '#48e58a' : '#ffd0a0', fontWeight: 700 }}>
                    <span
                      style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        background: report.isLive ? '#48e58a' : '#ffbe6b',
                        boxShadow: report.isLive ? '0 0 6px #48e58a' : '0 0 6px #ffbe6b',
                      }}
                    />
                    {report.isLive ? 'LIVE NASA SATELLITE API' : 'NASA DONKI FEED (DEMO_KEY ACTIVE)'}
                  </span>
                  <button
                    type="button"
                    className="donki-toggle-link"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    onClick={() => {
                      cockpitAudio.playClick()
                      setShowKeyModal((p) => !p)
                    }}
                  >
                    {showKeyModal ? (
                      <>
                        <X className="w-3 h-3" />
                        <span>Close Settings</span>
                      </>
                    ) : (
                      <>
                        <Settings className="w-3 h-3" />
                        <span>Custom NASA Key</span>
                      </>
                    )}
                  </button>
                </div>

                {showKeyModal && (
                  <div style={{ padding: '8px', marginBottom: '10px', border: '1px solid #783e26', background: 'rgba(28, 12, 10, 0.95)', borderRadius: '4px' }}>
                    <p style={{ fontSize: '9px', color: '#c49d88', margin: '0 0 6px' }}>
                      Built-in <b>DEMO_KEY</b> is ready. If you have a custom key from{' '}
                      <a href="https://api.nasa.gov" target="_blank" rel="noreferrer" style={{ color: '#7ee7f5' }}>
                        api.nasa.gov
                      </a>
                      , paste it here:
                    </p>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input
                        type="text"
                        placeholder="Paste NASA API Key"
                        value={userKey}
                        onChange={(e) => setUserKey(e.target.value)}
                        style={{ flex: 1, padding: '4px 6px', background: '#120705', border: '1px solid #c06834', color: '#fff', fontSize: '10px' }}
                      />
                      <button
                        type="button"
                        className="stepper-btn"
                        style={{ width: 'auto', padding: '0 8px', fontSize: '10px' }}
                        onClick={handleRefreshDonki}
                        disabled={isLoadingApi}
                      >
                        {isLoadingApi ? '...' : 'Fetch'}
                      </button>
                    </div>
                  </div>
                )}

                {/* NASA DONKI Warning Banner */}
                <div className="donki-alert-banner">
                  <div className="donki-alert-title">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <AlertOctagon className="w-4 h-4 text-red-500 animate-pulse flex-shrink-0" />
                      <span>NASA DONKI EVENT ID: {report.eventID}</span>
                    </span>
                    <span style={{ color: '#ff4d4d' }}>{report.sScaleThreat}</span>
                  </div>
                  <div className="donki-alert-meta">
                    <span>FLARE CLASS: {report.flareClass}</span>
                    <span>SHOCK SPEED: {report.cmeSpeedKmS} KM/S</span>
                    <span>PROTON FLUX: {report.protonFluxMev}</span>
                  </div>
                </div>

                {/* Live NASA Dosimeter Gauge */}
                <div className="hera-dosimeter-box">
                  <div>
                    <div style={{ fontSize: '9px', color: '#c98a69' }}>NASA HERA ACTIVE DOSIMETER</div>
                    <div className="hera-dose-num" style={{ color: isStormSafe ? '#48e58a' : defenseScore >= 2 ? '#ffd0a0' : '#ff4d4d' }}>
                      {isStormSafe ? '0.02 mSv/h (SAFE)' : defenseScore === 2 ? '3.10 mSv/h' : '18.50 mSv/h (LETHAL)'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '9px', color: '#c98a69' }}>CREW HEALTH</div>
                    <b style={{ fontSize: '13px', color: isStormSafe ? '#48e58a' : '#ffbe85' }}>
                      {isStormSafe ? '100% PROTECTED' : defenseScore === 2 ? '60% HAZARD' : '15% CRITICAL'}
                    </b>
                  </div>
                </div>

                {/* 3 Interactive Survival Protocol Buttons */}
                <div className="storm-action-cards">
                  {/* STEP 1: INGRESS */}
                  <button
                    type="button"
                    className={`storm-action-btn ${stepIngress ? 'is-active' : ''}`}
                    onClick={() => {
                      cockpitAudio.playClick()
                      setStepIngress((p) => !p)
                    }}
                  >
                    <div className="gear-card-icon">
                      <ShieldAlert className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="gear-card-info">
                      <h3>Step 1: Emergency Airlock Ingress</h3>
                      <p>Spacesuits offer zero proton shielding. Pull astronaut inside before storm strikes!</p>
                    </div>
                    <div className="gear-card-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      {stepIngress ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                          <span>SEALED INSIDE</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3 h-3 text-amber-400 stroke-[2.5]" />
                          <span>TAP TO INGRESS</span>
                        </>
                      )}
                    </div>
                  </button>

                  {/* STEP 2: WATERWALL */}
                  <button
                    type="button"
                    className={`storm-action-btn ${stepWaterwall ? 'is-active' : ''}`}
                    onClick={() => {
                      cockpitAudio.playClick()
                      setStepWaterwall((p) => !p)
                    }}
                  >
                    <div className="gear-card-icon">
                      <Droplets className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="gear-card-info">
                      <h3>Step 2: Deploy Waterwall Shield</h3>
                      <p>Hydrogen in water blocks penetrating neutrons. Surround the crew cabin with water tanks!</p>
                    </div>
                    <div className="gear-card-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      {stepWaterwall ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                          <span>WATERWALL DEPLOYED</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3 h-3 text-cyan-400 stroke-[2.5]" />
                          <span>TAP TO DEPLOY</span>
                        </>
                      )}
                    </div>
                  </button>

                  {/* STEP 3: FORCEFIELD */}
                  <button
                    type="button"
                    className={`storm-action-btn ${stepShield ? 'is-active' : ''}`}
                    onClick={() => {
                      cockpitAudio.playClick()
                      setStepShield((p) => !p)
                    }}
                  >
                    <div className="gear-card-icon">
                      <Zap className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="gear-card-info">
                      <h3>Step 3: Fire 45 kV EM Forcefield</h3>
                      <p>Magnetic coils create an artificial mini-magnetosphere that deflects positively charged protons!</p>
                    </div>
                    <div className="gear-card-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      {stepShield ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                          <span>FORCEFIELD ACTIVE</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3 h-3 text-amber-400 stroke-[2.5]" />
                          <span>TAP TO ENERGIZE</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>

                {/* Test CME Wave Button */}
                <button
                  className="launch-trigger"
                  type="button"
                  style={{ width: '100%', height: '46px', fontSize: '13px', marginTop: '6px' }}
                  disabled={isSurging}
                  onClick={handleTestStorm}
                >
                  <span>{isSurging ? 'RIDING OUT CME SHOCKWAVE...' : 'SIMULATE & TACKLE CME SHOCKWAVE'}</span>
                </button>

                {stormDefended && (
                  <div className="srag-allclear-badge">
                    <b style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>NASA SPACE WEATHER ALL-CLEAR ISSUED:</span>
                    </b>
                    <div>Shockwave weathered! All 3 defense barriers held with zero cellular radiation damage!</div>
                  </div>
                )}
              </section>
            </div>
          )}

          {/* ========================================================
              QUEST 3: ROCKET LAUNCH BALANCER (PHYSICS SIM)
             ======================================================== */}
          {activeQuest === 3 && (
            <div className="balancer-game-grid">
              {/* Rocket Cross Section & Launchpad Simulation */}
              <section className="rocket-launch-platform">
                <div className="suit-readiness-badge" style={{ top: '14px', left: '14px' }}>
                  <span>CENTER OF GRAVITY:</span>
                  <span style={{ color: isBalanced ? '#48e58a' : '#ff4d4d', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    {isBalanced ? (
                      <>
                        <span>BALANCED</span>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        <span>UNSTABLE</span>
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </>
                    )}
                  </span>
                </div>

                {/* Rocket Assembly that physically tilts if off-balance */}
                <div
                  className={`rocket-assembly-body ${isLaunching ? 'is-blasting-off' : ''}`}
                  style={{ transform: `rotate(${rocketTiltDeg}deg)` }}
                >
                  {/* Dynamic Rocket Cross-Section */}
                  <div className="rocket-cross-section">
                    {/* Crew Nose Cone */}
                    <div className="capsule-nose">
                      <div className="capsule-window" />
                    </div>

                    {/* Cargo Bay */}
                    <div className="cargo-bay-section" title={`Cargo: ${cargo}%`}>
                      <div className="cargo-fill-level" style={{ height: `${cargo}%` }} />
                      <span style={{ position: 'absolute', top: '4px', left: '6px', fontSize: '9px', color: '#ffd0a0', fontWeight: 700 }}>
                        CARGO ({cargo}%)
                      </span>
                    </div>

                    {/* Fuel Propellant Tank */}
                    <div className="fuel-tank-section" title={`Propellant Fuel: ${fuel}%`}>
                      <div className="fuel-fill-level" style={{ height: `${fuel}%` }} />
                      <span style={{ position: 'absolute', top: '4px', left: '6px', fontSize: '9px', color: '#7ee7f5', fontWeight: 700 }}>
                        PROPEL ({fuel}%)
                      </span>
                    </div>

                    {/* Exhaust Engine Nozzles */}
                    <polygon points="40,320 30,340 90,340 80,320" fill="#3a1c15" stroke="#ed9255" strokeWidth="1.5" />
                  </div>

                  {/* Roaring Rocket Flames during liftoff */}
                  {isLaunching && <div className="rocket-flames-burn" />}
                </div>

                {/* Dynamic Center of Gravity Fulcrum line */}
                <div className="cg-indicator-line" style={{ top: `${cgPercent}%` }}>
                  <span className="cg-indicator-badge">CG FULCRUM</span>
                  <span className="cg-indicator-badge" style={{ color: isBalanced ? '#48e58a' : '#ff9999' }}>
                    {isBalanced ? 'GREEN ZONE' : 'TILT HAZARD'}
                  </span>
                </div>

                {/* Safe Flight Envelope Bracket */}
                <div className="cg-safe-zone-bracket">
                  <span>SAFE FLIGHT ENVELOPE</span>
                </div>
              </section>

              {/* Rocket Calibration & Launch Controls */}
              <section className="sim-terminal hud-cut">
                <div className="terminal-label">MISSION 3 // ROCKET PHYSICS &amp; MASS CALIBRATION</div>
                <h1 style={{ fontSize: '20px', margin: '4px 0 8px', color: '#fff' }}>Balance Before Blast Off</h1>
                <p style={{ fontSize: '12px', color: '#ffd0a0', lineHeight: 1.45, margin: '0 0 14px' }}>
                  A rocket must balance its heavy equipment cargo against rocket fuel! If cargo is too heavy (Cargo &gt;
                  78%), the rocket flips in the wind. If fuel is too low (Fuel &lt; 65%), it can&apos;t reach orbit!
                </p>

                {/* Cargo & Fuel Steppers */}
                <div className="stepper-slider-group">
                  {/* Cargo Slider Row */}
                  <div className="stepper-slider-row">
                    <span className="stepper-label">Cargo Mass</span>
                    <button
                      className="stepper-btn"
                      type="button"
                      onClick={() => {
                        cockpitAudio.playClick()
                        setCargo((c) => Math.max(10, c - 5))
                      }}
                    >
                      −
                    </button>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={cargo}
                      onChange={(e) => setCargo(Number(e.target.value))}
                    />
                    <button
                      className="stepper-btn"
                      type="button"
                      onClick={() => {
                        cockpitAudio.playClick()
                        setCargo((c) => Math.min(100, c + 5))
                      }}
                    >
                      +
                    </button>
                    <span className="stepper-val" style={{ color: isCargoSafe ? '#48e58a' : '#ff4d4d' }}>
                      {cargo}%
                    </span>
                  </div>

                  {/* Propellant Slider Row */}
                  <div className="stepper-slider-row">
                    <span className="stepper-label">Fuel (Δv)</span>
                    <button
                      className="stepper-btn"
                      type="button"
                      onClick={() => {
                        cockpitAudio.playClick()
                        setFuel((f) => Math.max(10, f - 5))
                      }}
                    >
                      −
                    </button>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={fuel}
                      onChange={(e) => setFuel(Number(e.target.value))}
                    />
                    <button
                      className="stepper-btn"
                      type="button"
                      onClick={() => {
                        cockpitAudio.playClick()
                        setFuel((f) => Math.min(100, f + 5))
                      }}
                    >
                      +
                    </button>
                    <span className="stepper-val" style={{ color: isFuelSafe ? '#48e58a' : '#ff4d4d' }}>
                      {fuel}%
                    </span>
                  </div>
                </div>

                {/* Big Ignite & Launch Button */}
                <button
                  className="launch-trigger"
                  type="button"
                  style={{ width: '100%', height: '48px', fontSize: '14px' }}
                  disabled={isLaunching || !isBalanced}
                  onClick={handleLaunchRocket}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    {isLaunching ? (
                      <>
                        <Rocket className="w-4 h-4 animate-bounce" />
                        <span>BLASTING OFF INTO ORBIT...</span>
                      </>
                    ) : (
                      <>
                        <Flame className="w-4 h-4 text-orange-400" />
                        <span>IGNITE ENGINES & LAUNCH ROCKET!</span>
                      </>
                    )}
                  </span>
                </button>

                {launchStatus && (
                  <div
                    style={{
                      marginTop: '12px',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 700,
                      textAlign: 'center',
                      background: isBalanced ? 'rgba(72, 229, 138, 0.15)' : 'rgba(255, 77, 77, 0.15)',
                      border: `1px solid ${isBalanced ? '#48e58a' : '#ff4d4d'}`,
                      color: isBalanced ? '#aff6cc' : '#ff9999',
                    }}
                  >
                    {launchStatus}
                  </div>
                )}
              </section>
            </div>
          )}
        </main>

        {/* CADET MISSION COMMAND & FLIGHT LOG SIDEBAR */}
        <aside className="handbook-sidebar">
          {/* Tab buttons */}
          <div className="handbook-tabs">
            <button
              className={activeTab === 'missions' ? 'active' : ''}
              type="button"
              onClick={() => {
                cockpitAudio.playClick()
                setActiveTab('missions')
              }}
            >
              Cadet Log
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

          {activeTab === 'missions' ? (
            <div className="case-summary">
              {/* Cadet Rank & XP Tracker */}
              <div className="cadet-rank-box">
                <div className="cadet-rank-title">
                  <span>CADET FLIGHT STATUS</span>
                  <span style={{ color: '#ffd700', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>LEVEL 1</span>
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
                  <span>{cadetRank.title}</span>
                  {cadetRank.stars > 0 && (
                    <span style={{ display: 'inline-flex', gap: '2px' }}>
                      {Array.from({ length: cadetRank.stars }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </span>
                  )}
                </div>
                <div className="cadet-xp-track">
                  <div className="cadet-xp-fill" style={{ width: `${(currentXP / 300) * 100}%` }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#c49d88' }}>
                  <span>TOTAL PROGRESS</span>
                  <span>{currentXP} / 300 XP</span>
                </div>
              </div>

              {/* 3 Step-by-Step Mission Progress Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* Mission 1 card */}
                <div
                  style={{
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: `1px solid ${completedQuests.includes(1) ? '#48e58a' : activeQuest === 1 ? '#ed9255' : '#573022'}`,
                    background: completedQuests.includes(1) ? 'rgba(18, 38, 24, 0.7)' : 'rgba(22, 10, 8, 0.7)',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    cockpitAudio.playClick()
                    setActiveQuest(1)
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: 700 }}>
                    <span style={{ color: '#fff' }}>01 // Suit Up!</span>
                    <span style={{ color: completedQuests.includes(1) ? '#48e58a' : '#ffd0a0', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      {completedQuests.includes(1) ? (
                        <>
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                          <span>100 XP</span>
                        </>
                      ) : (
                        `${suitReadinessPercent}%`
                      )}
                    </span>
                  </div>
                  <div style={{ fontSize: '9px', color: '#c49d88', marginTop: '2px' }}>
                    Equip 4 EMU suit modules on Commander Vega
                  </div>
                </div>

                {/* Mission 2 card */}
                <div
                  style={{
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: `1px solid ${completedQuests.includes(2) ? '#48e58a' : activeQuest === 2 ? '#ed9255' : '#573022'}`,
                    background: completedQuests.includes(2) ? 'rgba(18, 38, 24, 0.7)' : 'rgba(22, 10, 8, 0.7)',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    cockpitAudio.playClick()
                    setActiveQuest(2)
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: 700 }}>
                    <span style={{ color: '#fff' }}>02 // Storm Defense</span>
                    <span style={{ color: completedQuests.includes(2) ? '#48e58a' : '#ffd0a0', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      {completedQuests.includes(2) ? (
                        <>
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                          <span>100 XP</span>
                        </>
                      ) : (
                        `${defenseScore}/3 Active`
                      )}
                    </span>
                  </div>
                  <div style={{ fontSize: '9px', color: '#c49d88', marginTop: '2px' }}>
                    Tackle NASA DONKI S4 space weather shockwave
                  </div>
                </div>

                {/* Mission 3 card */}
                <div
                  style={{
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: `1px solid ${completedQuests.includes(3) ? '#48e58a' : activeQuest === 3 ? '#ed9255' : '#573022'}`,
                    background: completedQuests.includes(3) ? 'rgba(18, 38, 24, 0.7)' : 'rgba(22, 10, 8, 0.7)',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    cockpitAudio.playClick()
                    setActiveQuest(3)
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: 700 }}>
                    <span style={{ color: '#fff' }}>03 // Rocket Balancer</span>
                    <span style={{ color: completedQuests.includes(3) ? '#48e58a' : '#ffd0a0', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      {completedQuests.includes(3) ? (
                        <>
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                          <span>100 XP</span>
                        </>
                      ) : isBalanced ? (
                        'Balanced'
                      ) : (
                        'Unstable'
                      )}
                    </span>
                  </div>
                  <div style={{ fontSize: '9px', color: '#c49d88', marginTop: '2px' }}>
                    Calibrate payload center-of-gravity for liftoff
                  </div>
                </div>
              </div>

              {/* Space Cadet Trivia Box */}
              <div className="cadet-trivia-box">
                <div className="cadet-trivia-header" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Lightbulb className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
                  <span>CADET SPACE TRIVIA</span>
                </div>
                <p className="cadet-trivia-text">{SPACE_FACTS[triviaIndex]}</p>
              </div>
            </div>
          ) : (
            <nav className="handbook-list" aria-label="Astronaut lessons">
              <p>CREW HANDBOOK</p>
              <button
                className={activeQuest === 1 ? 'active' : ''}
                type="button"
                onClick={() => {
                  cockpitAudio.playClick()
                  setActiveQuest(1)
                }}
              >
                <span>01</span>
                EMU Suit Architecture
              </button>
              <button
                className={activeQuest === 2 ? 'active' : ''}
                type="button"
                onClick={() => {
                  cockpitAudio.playClick()
                  setActiveQuest(2)
                }}
              >
                <span>02</span>
                NASA DONKI Space Weather
              </button>
              <button
                className={activeQuest === 3 ? 'active' : ''}
                type="button"
                onClick={() => {
                  cockpitAudio.playClick()
                  setActiveQuest(3)
                }}
              >
                <span>03</span>
                Rocket Flight Balance &amp; Δv
              </button>
            </nav>
          )}

          {/* Advance to Level 2 Button */}
          {onNext && (
            <div className="campaign-advance-banner" style={{ margin: '14px 0 0', padding: '12px' }}>
              <div className="campaign-advance-info">
                <h3 style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {completedQuests.length === 3 ? (
                    <>
                      <Rocket className="w-4 h-4 text-emerald-400" />
                      <span>LEVEL 1 COMPLETE!</span>
                    </>
                  ) : (
                    <>
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>CADET ACADEMY</span>
                    </>
                  )}
                </h3>
                <p style={{ fontSize: '11px' }}>
                  {completedQuests.length === 3
                    ? 'All 3 missions passed with honors! Ready for Proton Launch.'
                    : 'Complete all 3 missions to unlock Level 2.'}
                </p>
              </div>
              <button
                type="button"
                className="campaign-advance-btn"
                style={{ padding: '8px 14px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                onClick={() => {
                  cockpitAudio.playClick()
                  onNext()
                }}
              >
                <span>LEVEL 2: PROTON LAUNCH</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Sidebar Footer */}
          <div className="handbook-footer">
            <button
              type="button"
              onClick={() => {
                cockpitAudio.playClick()
                setShowGlossary((p) => !p)
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

          {/* Glossary Modal */}
          {showGlossary && (
            <div className="glossary-popover" role="dialog" aria-label="Cadet Glossary">
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
              <h2>Cadet Space Glossary</h2>
              <p>
                <b>EMU (Extravehicular Mobility Unit)</b> — An independent spacesuit with heating, cooling, oxygen, and
                micrometeorite armor.
              </p>
              <p>
                <b>NASA DONKI</b> — Space Weather Database Of Notifications, Knowledge, and Information tracking solar
                flares and coronal mass ejections.
              </p>
              <p>
                <b>CME (Coronal Mass Ejection)</b> — A billion-ton burst of super-hot solar plasma racing through space
                at up to 2,500 km/s!
              </p>
              <p>
                <b>Waterwall Shelter</b> — Water contains light hydrogen atoms that absorb and stop dangerous high-speed
                cosmic protons.
              </p>
              <p>
                <b>Center of Gravity (CG)</b> — The balance point of a rocket. Keeping the CG inside the safe envelope
                stops the rocket flipping over in the wind.
              </p>
            </div>
          )}
        </aside>
      </div>

      {/* VICTORY CELEBRATION MODAL WITH CONFETTI */}
      {showVictory && victoryMessage && (
        <div className="quest-victory-overlay">
          <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }} />
          <div className="quest-victory-card" style={{ position: 'relative', zIndex: 2 }}>
            <div className="victory-stars-row">
              <Star className="w-8 h-8 fill-amber-400 text-amber-400" />
              <Star className="w-8 h-8 fill-amber-400 text-amber-400" />
              <Star className="w-8 h-8 fill-amber-400 text-amber-400" />
            </div>
            <div
              className="gear-card-badge"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 215, 0, 0.2)',
                color: '#ffd700',
                padding: '6px 12px',
                fontSize: '11px',
              }}
            >
              {victoryMessage.badgeIcon && <victoryMessage.badgeIcon className="w-4 h-4" />}
              <span>{victoryMessage.badge}</span>
            </div>
            <h2 className="victory-title">{victoryMessage.title}</h2>
            <p className="victory-desc">{victoryMessage.desc}</p>
            <button
              type="button"
              className="campaign-advance-btn"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '13px',
                marginTop: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
              onClick={() => {
                cockpitAudio.playClick()
                victoryMessage.action()
              }}
            >
              <span>{victoryMessage.actionLabel}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
