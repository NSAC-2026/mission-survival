'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  X,
  Volume2,
  VolumeX,
  Compass,
  Radio,
  Users,
  Layers,
  Sparkles,
  ChevronRight,
  Shield,
  Check,
  Trophy,
  BookOpen,
  Monitor,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react'
import { cockpitAudio } from '@/utils/audio'
import { isLevelUnlocked } from '@/lib/campaign-state'
import { getScoreState, resetScoreState, type ScoreState } from '@/lib/score-system'

export type ActiveModal =
  | 'none'
  | 'missions'
  | 'settings'
  | 'load-game'
  | 'extras'
  | 'quit-confirm'
  | 'globe'
  | 'community'
  | 'messages'
  | 'profile'
  | 'scores'
  | 'manual'

interface ModalsProps {
  activeModal: ActiveModal
  onClose: () => void
  titleMode: 'MISSION SURVIVAL' | 'BEYOND HORIZON'
  onToggleTitleMode: (mode: 'MISSION SURVIVAL' | 'BEYOND HORIZON') => void
  bgMode: 'cinematic' | 'reference'
  onToggleBgMode: (mode: 'cinematic' | 'reference') => void
}

export default function InteractiveModals({
  activeModal,
  onClose,
  titleMode,
  onToggleTitleMode,
  bgMode,
  onToggleBgMode,
}: ModalsProps) {
  const router = useRouter()
  const [isMuted, setIsMuted] = useState(false)
  const [scoreData, setScoreData] = useState<ScoreState>(() => getScoreState())

  useEffect(() => {
    if (activeModal === 'profile' || activeModal === 'scores') {
      setScoreData(getScoreState())
    }
  }, [activeModal])

  const [saveSlots] = useState([
    { id: 1, name: 'Kepler Grassland Outpost', time: '14h 22m', date: '2026-11-07', level: 12 },
    { id: 2, name: 'Orbital Station Alpha', time: '08h 15m', date: '2026-11-05', level: 8 },
    { id: 3, name: 'Sub-Orbital Launch Pad', time: '02h 40m', date: '2026-11-02', level: 4 },
  ])

  if (activeModal === 'none') return null

  const handleMuteToggle = () => {
    cockpitAudio.playClick()
    const nowMuted = cockpitAudio.toggleMute()
    setIsMuted(nowMuted)
  }

  const handleResetScores = () => {
    cockpitAudio.playClick()
    if (window.confirm('Reset all scores, achievements, and career XP back to default?')) {
      const fresh = resetScoreState()
      setScoreData(fresh)
    }
  }

  const levels = [
    { num: 1, name: 'Tutorial & Flight Systems', route: '/level-1', desc: 'Basic controls, EVA navigation & planetary acclimatization' },
    { num: 2, name: 'Proton Launch Simulation', route: '/level-2', desc: 'Telemetry calculation, staging and atmospheric escape' },
    { num: 3, name: 'Space Station Docking', route: '/level-3', desc: 'RCS thruster alignment & orbital vector synchronization' },
    { num: 4, name: 'Moon Orbital Insertion', route: '/level-4', desc: 'Lunar descent trajectory & surface beacon tracking' },
    { num: 5, name: 'Mars Atmosphere & Survival', route: '/level-5', desc: 'Martian atmospheric entry, radiation shields & bio-dome' },
  ]

  return (
    <div
      className="fixed inset-0 z-50 sci-modal-backdrop flex items-center justify-center p-4 select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="hud-panel rounded-sm w-full max-w-xl border border-white/20 p-6 relative shadow-2xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            cockpitAudio.playClick()
            onClose()
          }}
          className="absolute top-4 right-4 w-7 h-7 rounded-sm border border-white/20 hover:border-amber-400 text-white/60 hover:text-amber-400 flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* MODAL 1: MISSIONS / PLAY */}
        {activeModal === 'missions' && (
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
              <Compass className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold tracking-[0.2em] text-white uppercase font-['Orbitron',sans-serif]">
                EXPEDITION MISSIONS
              </h2>
            </div>
            <p className="text-xs text-white/70 mb-4 tracking-wide">
              Select an unlocked planetary campaign or training simulator:
            </p>
            <div className="flex flex-col gap-2.5">
              {levels.map((lvl) => {
                const unlocked = isLevelUnlocked(lvl.num)
                const recordedScore = scoreData.levelScores[lvl.num]
                return (
                  <button
                    key={lvl.num}
                    type="button"
                    disabled={!unlocked}
                    onClick={() => {
                      cockpitAudio.playClick()
                      router.push(lvl.route)
                    }}
                    className={`flex items-center justify-between p-3 rounded-sm border transition-all text-left ${
                      unlocked
                        ? 'border-white/10 hover:border-amber-400/80 bg-black/40 hover:bg-black/70 cursor-pointer group'
                        : 'border-white/5 bg-black/20 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-amber-400 font-bold">
                          SECTOR 0{lvl.num}
                        </span>
                        <span className="text-xs font-bold text-white tracking-wider font-['Orbitron',sans-serif]">
                          {lvl.name}
                        </span>
                        {recordedScore && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono font-bold">
                            GRADE {recordedScore.grade} • {recordedScore.score} XP
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-white/60 mt-1">{lvl.desc}</p>
                    </div>
                    {unlocked ? (
                      <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                    ) : (
                      <span className="text-[9px] font-mono text-red-400/80 uppercase">LOCKED</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* MODAL 2: SETTINGS */}
        {activeModal === 'settings' && (
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
              <Radio className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold tracking-[0.2em] text-white uppercase font-['Orbitron',sans-serif]">
                SYSTEM SETTINGS
              </h2>
            </div>

            <div className="flex flex-col gap-4 text-xs text-white/80">
              {/* PC Desktop Exclusive Banner */}
              <div className="p-3 border border-amber-400/40 rounded bg-amber-950/20 flex items-start gap-2.5">
                <Monitor className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[11px] font-bold text-amber-300 font-['Orbitron',sans-serif] uppercase tracking-wider">
                    TARGET PLATFORM: PC DESKTOP EXCLUSIVE
                  </h4>
                  <p className="text-[10px] text-white/70 mt-1 leading-relaxed">
                    This game is architected strictly for <strong>PC widescreen monitors, physical keyboard inputs, and precision mouse controls</strong>. Mobile devices, tablets, and smartphones are <strong>not supported</strong>.
                  </p>
                </div>
              </div>

              {/* Title Style Toggle */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-2 font-['Orbitron',sans-serif]">
                  Menu Title Display
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      cockpitAudio.playClick()
                      onToggleTitleMode('MISSION SURVIVAL')
                    }}
                    className={`p-2.5 rounded-sm border text-left transition-colors flex items-center justify-between ${
                      titleMode === 'MISSION SURVIVAL'
                        ? 'border-amber-400 bg-amber-400/10 text-white font-bold'
                        : 'border-white/10 bg-black/40 text-white/60 hover:border-white/30'
                    }`}
                  >
                    <span>MISSION SURVIVAL</span>
                    {titleMode === 'MISSION SURVIVAL' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      cockpitAudio.playClick()
                      onToggleTitleMode('BEYOND HORIZON')
                    }}
                    className={`p-2.5 rounded-sm border text-left transition-colors flex items-center justify-between ${
                      titleMode === 'BEYOND HORIZON'
                        ? 'border-amber-400 bg-amber-400/10 text-white font-bold'
                        : 'border-white/10 bg-black/40 text-white/60 hover:border-white/30'
                    }`}
                  >
                    <span>BEYOND HORIZON</span>
                    {titleMode === 'BEYOND HORIZON' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                </div>
              </div>

              {/* Background Art Mode */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-2 font-['Orbitron',sans-serif]">
                  Cinematic Artwork
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      cockpitAudio.playClick()
                      onToggleBgMode('cinematic')
                    }}
                    className={`p-2.5 rounded-sm border text-left transition-colors flex items-center justify-between ${
                      bgMode === 'cinematic'
                        ? 'border-amber-400 bg-amber-400/10 text-white font-bold'
                        : 'border-white/10 bg-black/40 text-white/60 hover:border-white/30'
                    }`}
                  >
                    <span>Clean 4K Artwork</span>
                    {bgMode === 'cinematic' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      cockpitAudio.playClick()
                      onToggleBgMode('reference')
                    }}
                    className={`p-2.5 rounded-sm border text-left transition-colors flex items-center justify-between ${
                      bgMode === 'reference'
                        ? 'border-amber-400 bg-amber-400/10 text-white font-bold'
                        : 'border-white/10 bg-black/40 text-white/60 hover:border-white/30'
                    }`}
                  >
                    <span>Concept Art Reference</span>
                    {bgMode === 'reference' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                </div>
              </div>

              {/* Audio Synthesizer */}
              <div className="flex items-center justify-between p-3 border border-white/10 rounded-sm bg-black/30">
                <div className="flex items-center gap-2">
                  {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
                  <span>Aerospace Web Audio Engine</span>
                </div>
                <button
                  type="button"
                  onClick={handleMuteToggle}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded text-[11px] font-mono uppercase"
                >
                  {isMuted ? 'Unmute' : 'Mute'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 3: LOAD GAME */}
        {activeModal === 'load-game' && (
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
              <Layers className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold tracking-[0.2em] text-white uppercase font-['Orbitron',sans-serif]">
                LOAD SAVED JOURNEY
              </h2>
            </div>
            <div className="flex flex-col gap-2.5">
              {saveSlots.map((slot) => (
                <div
                  key={slot.id}
                  onClick={() => {
                    cockpitAudio.playClick()
                    router.push('/level-1')
                  }}
                  className="p-3 rounded-sm border border-white/10 hover:border-amber-400 bg-black/40 hover:bg-black/70 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div>
                    <h3 className="text-xs font-bold text-white tracking-wider font-['Orbitron',sans-serif]">
                      Slot 0{slot.id}: {slot.name}
                    </h3>
                    <div className="flex gap-4 mt-1 text-[10px] text-white/60 font-mono">
                      <span>Level {slot.level}</span>
                      <span>Playtime: {slot.time}</span>
                      <span>Saved: {slot.date}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-amber-400" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODAL 4: EXTRAS */}
        {activeModal === 'extras' && (
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold tracking-[0.2em] text-white uppercase font-['Orbitron',sans-serif]">
                BONUS CONTENT & ARCHIVES
              </h2>
            </div>
            <div className="space-y-3 text-xs text-white/80">
              <p className="leading-relaxed">
                Welcome to the <strong>Mission Survival – Beyond Earth</strong> archive. Featuring planetary telemetry databases, Kepler star cartography, and high-fidelity aerospace simulation modules.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="p-3 border border-white/10 rounded bg-black/40">
                  <h4 className="font-bold text-amber-400 font-['Orbitron',sans-serif] text-[11px] mb-1">
                    ORBITAL MECHANICS
                  </h4>
                  <p className="text-[10px] text-white/60">
                    Real Keplerian equations and thrust delta-v calculations simulated in browser canvas.
                  </p>
                </div>
                <div className="p-3 border border-white/10 rounded bg-black/40">
                  <h4 className="font-bold text-amber-400 font-['Orbitron',sans-serif] text-[11px] mb-1">
                    DONKI SPACE WEATHER
                  </h4>
                  <p className="text-[10px] text-white/60">
                    Live NASA Space Weather Database Notifications and solar flare monitoring.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 5: QUIT CONFIRMATION */}
        {activeModal === 'quit-confirm' && (
          <div className="text-center py-4">
            <h2 className="text-base font-bold tracking-[0.2em] text-white uppercase font-['Orbitron',sans-serif] mb-2">
              QUIT TO DESKTOP?
            </h2>
            <p className="text-xs text-white/70 mb-6">
              All planetary coordinates and daily challenge progress are automatically cached.
            </p>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  cockpitAudio.playClick()
                  onClose()
                }}
                className="px-5 py-2 border border-white/20 hover:border-white/50 rounded-sm text-xs font-bold uppercase tracking-wider text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  cockpitAudio.playClick()
                  window.close()
                }}
                className="px-5 py-2 border border-amber-400 bg-amber-400/20 hover:bg-amber-400/30 rounded-sm text-xs font-bold uppercase tracking-wider text-amber-300"
              >
                Confirm Exit
              </button>
            </div>
          </div>
        )}

        {/* MODAL 6: GLOBE (Planetary Map) */}
        {activeModal === 'globe' && (
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
              <Compass className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold tracking-[0.2em] text-white uppercase font-['Orbitron',sans-serif]">
                PLANETARY CHART - SECTOR 7G
              </h2>
            </div>
            <p className="text-xs text-white/70 mb-3">
              Exoplanet survey telemetry:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 border border-amber-400/40 rounded bg-black/40">
                <span className="text-amber-400 font-bold block text-[11px] font-['Orbitron',sans-serif]">
                  BEYOND EARTH ALPHA
                </span>
                <span className="text-[10px] text-white/60">Class-M Terrestrial Exoplanet</span>
                <div className="mt-2 text-[10px] text-white/80 font-mono">
                  <div>Gravity: 1.08g</div>
                  <div>Atmosphere: N2/O2/Ar</div>
                  <div>Bioluminescent flora: Active</div>
                </div>
              </div>
              <div className="p-3 border border-white/10 rounded bg-black/40">
                <span className="text-white/90 font-bold block text-[11px] font-['Orbitron',sans-serif]">
                  KEPLER-452B
                </span>
                <span className="text-[10px] text-white/60">Super-Earth Orbit</span>
                <div className="mt-2 text-[10px] text-white/80 font-mono">
                  <div>Distance: 1,402 ly</div>
                  <div>Orbital Period: 385 days</div>
                  <div>Status: Deep Orbit Survey</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 7: COMMUNITY / USERS */}
        {activeModal === 'community' && (
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
              <Users className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold tracking-[0.2em] text-white uppercase font-['Orbitron',sans-serif]">
                EXPLORER NETWORK
              </h2>
            </div>
            <p className="text-xs text-white/70 mb-3">
              Active expeditions currently exploring the surface:
            </p>
            <div className="flex flex-col gap-2">
              <div className="p-2.5 border border-white/10 rounded bg-black/40 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white">Commander Vance</span>
                  <span className="text-[10px] text-white/50 block">Kepler Grasslands • Level 24</span>
                </div>
                <span className="text-[9px] px-2 py-0.5 bg-green-500/20 text-green-300 rounded font-mono">ONLINE</span>
              </div>
              <div className="p-2.5 border border-white/10 rounded bg-black/40 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white">Astronaut Sarah Lin</span>
                  <span className="text-[10px] text-white/50 block">Orbital Station Beta • Level 18</span>
                </div>
                <span className="text-[9px] px-2 py-0.5 bg-green-500/20 text-green-300 rounded font-mono">ONLINE</span>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 8: MESSAGES */}
        {activeModal === 'messages' && (
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
              <Radio className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold tracking-[0.2em] text-white uppercase font-['Orbitron',sans-serif]">
                STARFLEET COMMUNICATIONS
              </h2>
            </div>
            <div className="space-y-2.5">
              <div className="p-3 border border-amber-400/30 rounded bg-black/40">
                <div className="flex items-center justify-between text-[10px] text-amber-400 font-mono mb-1">
                  <span>TRANSMISSION: STARFLEET HQ</span>
                  <span>10:42 UTC</span>
                </div>
                <p className="text-xs text-white/80">
                  Surface probes confirm high concentration of bioluminescent crystals in Sector 7G. Proceed with creature scanning protocol.
                </p>
              </div>
              <div className="p-3 border border-white/10 rounded bg-black/40">
                <div className="flex items-center justify-between text-[10px] text-white/50 font-mono mb-1">
                  <span>TRANSMISSION: ORBITAL BEACON</span>
                  <span>YESTERDAY</span>
                </div>
                <p className="text-xs text-white/70">
                  Solar wind levels stable. Weather telemetry is optimal for sub-orbital excursions.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 9: PROFILE */}
        {activeModal === 'profile' && (
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-bold tracking-[0.2em] text-white uppercase font-['Orbitron',sans-serif]">
                  EXPLORER DOSSIER & PROFILE
                </h2>
              </div>
              <button
                type="button"
                onClick={handleResetScores}
                className="text-[10px] font-mono text-red-400/80 hover:text-red-300 flex items-center gap-1 border border-red-500/20 px-2 py-0.5 rounded hover:bg-red-500/10 transition-colors"
                title="Reset Career Progress"
              >
                <RotateCcw className="w-3 h-3" /> RESET
              </button>
            </div>

            <div className="space-y-4 text-xs text-white/80">
              {/* Header Badge */}
              <div className="flex gap-4 items-center p-3 border border-amber-400/40 rounded bg-amber-950/20">
                <div className="w-14 h-14 rounded border-2 border-amber-400 bg-amber-950/60 flex flex-col items-center justify-center font-bold text-amber-300 shadow-md">
                  <span className="text-[10px] text-white/60">LVL</span>
                  <span className="text-lg leading-none">{scoreData.level}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white font-['Orbitron',sans-serif]">PLAYER ONE</h3>
                    <span className="text-xs font-mono font-bold text-amber-300">
                      {scoreData.totalXp.toLocaleString()} XP
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-300/90 font-medium">{scoreData.rank}</p>
                  {/* Progress to next level */}
                  <div className="mt-2">
                    <div className="h-1.5 w-full bg-black/60 rounded-full overflow-hidden border border-white/10">
                      <div
                        className="h-full gold-gradient-bar rounded-full"
                        style={{ width: `${Math.min(100, (scoreData.currentLevelXp / scoreData.maxLevelXp) * 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] font-mono text-white/50 mt-0.5">
                      <span>Progress</span>
                      <span>{scoreData.currentLevelXp} / {scoreData.maxLevelXp} XP to Lvl {scoreData.level + 1}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Achievements Showcase */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-2 font-['Orbitron',sans-serif] flex items-center justify-between">
                  <span>EXPEDITION BADGES & ACHIEVEMENTS</span>
                  <span className="text-[10px] font-mono text-white/60">
                    {scoreData.achievements.filter((a) => a.unlocked).length} / {scoreData.achievements.length} UNLOCKED
                  </span>
                </h4>
                <div className="grid grid-cols-2 gap-2 max-h-[170px] overflow-y-auto pr-1">
                  {scoreData.achievements.map((ach) => (
                    <div
                      key={ach.id}
                      className={`p-2 rounded border flex items-center gap-2 transition-all ${
                        ach.unlocked
                          ? 'border-amber-400/50 bg-amber-400/10 text-white'
                          : 'border-white/5 bg-black/30 opacity-40 text-white/50'
                      }`}
                    >
                      <span className="text-base">{ach.icon}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10.5px] font-bold font-['Orbitron',sans-serif] truncate">
                            {ach.title}
                          </span>
                          <span className="text-[9px] font-mono text-amber-300">+{ach.xpReward}</span>
                        </div>
                        <p className="text-[9px] text-white/60 line-clamp-1">{ach.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 10: SCORES & LEADERBOARD */}
        {activeModal === 'scores' && (
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-bold tracking-[0.2em] text-white uppercase font-['Orbitron',sans-serif]">
                  MISSION SCORING & LOGS
                </h2>
              </div>
              <span className="text-[11px] font-mono text-amber-300 font-bold">
                TOTAL: {scoreData.totalXp.toLocaleString()} XP
              </span>
            </div>

            <div className="space-y-3 text-xs text-white/80">
              <p className="text-[11px] text-white/70">
                Live flight telemetry evaluation and career score logs across all mission sectors:
              </p>

              {/* Sectors Breakdown */}
              <div className="flex flex-col gap-2">
                {levels.map((lvl) => {
                  const entry = scoreData.levelScores[lvl.num]
                  return (
                    <div
                      key={lvl.num}
                      className="p-2.5 rounded border border-white/10 bg-black/40 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-amber-400">
                            SECTOR 0{lvl.num}
                          </span>
                          <span className="text-xs font-bold text-white font-['Orbitron',sans-serif]">
                            {lvl.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-white/50 block mt-0.5">
                          {entry ? `Cleared: ${new Date(entry.clearedAt || '').toLocaleDateString()}` : 'Awaiting flight evaluation'}
                        </span>
                      </div>

                      <div className="text-right">
                        {entry ? (
                          <>
                            <span className="text-xs font-bold text-amber-300 font-mono">
                              {entry.score} XP
                            </span>
                            <div className="flex items-center justify-end gap-1 text-[10px] font-mono text-emerald-400 font-bold">
                              <span>GRADE {entry.grade}</span>
                              <span>• {'★'.repeat(entry.stars)}</span>
                            </div>
                          </>
                        ) : (
                          <span className="text-[10px] font-mono text-white/40 uppercase">PENDING</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Daily Challenges count */}
              <div className="p-3 border border-amber-400/30 rounded bg-black/30 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-white font-['Orbitron',sans-serif]">
                    DAILY SURVEY MISSIONS
                  </span>
                  <span className="text-[10px] text-white/60 block">Claimed: {scoreData.dailyCompletedCount} times</span>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400">
                  +{(scoreData.dailyCompletedCount * 500).toLocaleString()} XP
                </span>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 11: GAME MANUAL VIEWER */}
        {activeModal === 'manual' && (
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold tracking-[0.2em] text-white uppercase font-['Orbitron',sans-serif]">
                STARFLEET GAME MANUAL
              </h2>
            </div>
            <div className="space-y-3 text-xs text-white/80 max-h-[60vh] overflow-y-auto pr-2">
              <div className="p-3 border border-amber-400/30 rounded bg-amber-950/20 text-[11px] text-amber-200">
                <strong>PC EXCLUSIVE NOTICE:</strong> This game is strictly built for desktop PC computers with physical keyboard and mouse controls. It is not compatible with mobile touch devices.
              </div>

              <h3 className="text-xs font-bold text-amber-400 font-['Orbitron',sans-serif]">1. GAMEPLAY CAMPAIGN</h3>
              <p>
                <strong>Sector 01 - Radiation Storm:</strong> Manage the HERA Dosimeter, water wall, and bio-dome ingress. Reach 100% protection to survive the solar flare and earn Grade S (1,000 XP).
              </p>
              <p>
                <strong>Sector 02 - Proton Launch:</strong> Calculate telemetry and separate boosters at 7.8 km/s orbital speed. Too slow means atmospheric re-entry; too fast means escape velocity overshoot.
              </p>
              <p>
                <strong>Sector 03 - Space Station Docking:</strong> Pilot the crew capsule using 6-DoF RCS thrusters in zero-g. Align with the green target ring and maintain velocity below 2.0 m/s to lock the 12 APDS motorized hooks.
              </p>
              <p>
                <strong>Sector 04 - Moon Basecamp Artemis:</strong> Survive the 14-day lunar night with only 35% battery. Keep thermal heating at 80% to resist -130°C Shackleton crater cold and preserve ECLSS oxygen.
              </p>
              <p>
                <strong>Sector 05 - Mars Bio-Dome:</strong> Activate electrostatic sand shields and life-support scrubbers during severe Martian dust storms.
              </p>

              <h3 className="text-xs font-bold text-amber-400 font-['Orbitron',sans-serif] pt-2">2. SCORING & RANKS</h3>
              <p>
                Earn XP for each level cleared. Accumulate XP to advance your rank from Cadet Explorer to Starfleet Admiral. Check your current progress anytime in the Explorer Dossier or Scoreboard.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
