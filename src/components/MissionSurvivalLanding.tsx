'use client'

import React, { useState, useEffect } from 'react'
import { Monitor, AlertTriangle, X, Bot, ChevronRight } from 'lucide-react'
import PlayerProfileHUD from './PlayerProfileHUD'
import DailyChallengesHUD from './DailyChallengesHUD'
import InfoCardHUD from './InfoCardHUD'
import PlayButton from './PlayButton'
import InteractiveModals, { type ActiveModal } from './InteractiveModals'
import HelpDeskChatbot from './HelpDeskChatbot'
import { cockpitAudio } from '@/utils/audio'

export default function MissionSurvivalLanding() {
  const [activeModal, setActiveModal] = useState<ActiveModal>('none')
  const [titleMode, setTitleMode] = useState<'MISSION SURVIVAL' | 'BEYOND HORIZON'>('MISSION SURVIVAL')
  const [bgMode, setBgMode] = useState<'cinematic' | 'reference'>('cinematic')
  const [isHelpDeskOpen, setIsHelpDeskOpen] = useState(false)
  const [isMobileWarningVisible, setIsMobileWarningVisible] = useState(false)

  // Detect small screens (mobile) on mount to show PC exclusive advisory
  useEffect(() => {
    const checkViewport = () => {
      if (typeof window !== 'undefined' && window.innerWidth < 900) {
        setIsMobileWarningVisible(true)
      }
    }
    checkViewport()
  }, [])

  // Keyboard shortcut listener for ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isHelpDeskOpen) {
          e.preventDefault()
          cockpitAudio.playClick()
          setIsHelpDeskOpen(false)
          return
        }
        if (activeModal !== 'none') {
          e.preventDefault()
          cockpitAudio.playClick()
          setActiveModal('none')
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeModal, isHelpDeskOpen])

  const bgImageSrc = bgMode === 'cinematic' ? '/cinematic-bg.jpg' : '/reference.jpg'

  return (
    <main className="relative w-screen h-screen max-h-screen overflow-hidden bg-black select-none font-['Rajdhani',sans-serif]">
      {/* 1. Cinematic Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-700 ease-out"
        style={{
          backgroundImage: `url('${bgImageSrc}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
        }}
        aria-label="Alien planet landscape with astronaut and giant ringed planet"
      />

      {/* Atmospheric Vignette & Contrast Overlay */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-t from-black/50 via-transparent to-black/35" />
      <div className="absolute inset-0 z-[1] pointer-events-none bg-radial-[circle_at_center,transparent_45%,rgba(0,0,0,0.6)_100%]" />

      {/* Subtle Bioluminescent particles scattered in the foreground grass */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 z-[2] pointer-events-none overflow-hidden">
        <span className="biolum-spore w-1.5 h-1.5 bottom-12 left-1/3 opacity-80" style={{ animationDelay: '0.2s' }} />
        <span className="biolum-spore w-1 h-1 bottom-8 left-2/5 opacity-70" style={{ animationDelay: '1.4s' }} />
        <span className="biolum-spore w-2 h-2 bottom-16 right-1/4 opacity-85" style={{ animationDelay: '0.7s' }} />
        <span className="biolum-spore w-1 h-1 bottom-10 right-1/3 opacity-60" style={{ animationDelay: '2.1s' }} />
        <span className="biolum-spore w-1.5 h-1.5 bottom-20 right-1/5 opacity-75" style={{ animationDelay: '1.8s' }} />
        <span className="biolum-spore w-1 h-1 bottom-6 left-1/2 opacity-50" style={{ animationDelay: '2.8s' }} />
      </div>

      {/* Mobile Advisory Toast (if viewed on phone/small screen) */}
      {isMobileWarningVisible && (
        <div className="absolute top-4 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-50 p-3 bg-amber-950/95 border-2 border-amber-400 text-amber-200 rounded-md shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 max-w-lg animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-[11px] leading-snug">
              <span className="font-bold uppercase font-['Orbitron',sans-serif] block text-white">
                PC EXCLUSIVE GAME NOTICE
              </span>
              This game requires a desktop PC with physical keyboard and mouse. Mobile touchscreens are not supported.
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsMobileWarningVisible(false)}
            className="w-6 h-6 rounded border border-amber-400/50 hover:bg-amber-400/20 flex items-center justify-center shrink-0"
            aria-label="Dismiss warning"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. TOP LEFT: Title & Only Two Buttons: PLAY and SCIFI-BOT */}
      <div className="absolute top-7 left-7 md:top-9 md:left-10 z-10 flex flex-col">
        {/* PC Platform Badge */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/60 border border-amber-400/40 text-[9.5px] font-mono text-amber-300 uppercase tracking-widest mb-3 backdrop-blur-sm w-fit">
          <Monitor className="w-3 h-3 text-amber-400" />
          <span>PC DESKTOP ONLY • KEYBOARD & MOUSE</span>
        </div>

        {/* Futuristic Sci-Fi Typography */}
        <header className="flex flex-col mb-6">
          <h1 className="text-3xl sm:text-4xl md:text-[42px] lg:text-[46px] font-black text-white uppercase tracking-[0.24em] leading-[1.05] title-glow font-['Orbitron',sans-serif]">
            MISSION
          </h1>
          <h1 className="text-3xl sm:text-4xl md:text-[42px] lg:text-[46px] font-black text-white uppercase tracking-[0.24em] leading-[1.05] title-glow font-['Orbitron',sans-serif] mt-0.5">
            SURVIVAL
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-5 md:w-7 h-[1px] bg-white/40" />
            <span className="text-[10.5px] md:text-[11.5px] italic font-semibold tracking-[0.32em] text-white/80 uppercase">
              BEYOND EARTH
            </span>
            <span className="w-5 md:w-7 h-[1px] bg-white/40" />
          </div>
        </header>

        {/* Action Buttons: ONLY Play Button & Scifi-bot Button */}
        <div className="flex flex-col gap-2.5">
          {/* 1. PLAY BUTTON */}
          <PlayButton
            label="PLAY"
            subtitle="RESUME JOURNEY"
            onPlay={() => setActiveModal('missions')}
          />

          {/* 2. SCIFI-BOT BUTTON (Directly under Play button) */}
          <button
            type="button"
            onClick={() => {
              cockpitAudio.playClick()
              setIsHelpDeskOpen((prev) => !prev)
            }}
            onMouseEnter={() => cockpitAudio.playHover()}
            className="relative flex items-center justify-between w-[250px] md:w-[270px] px-4 py-3 rounded-sm transition-all duration-300 group text-left bg-black/60 backdrop-blur-md border border-cyan-400/70 hover:border-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.25)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:scale-[1.02] cursor-pointer select-none"
            aria-label="Open Scifi-bot"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-7 h-7 rounded-full border border-cyan-400/90 bg-cyan-950/50 flex items-center justify-center text-cyan-300 shrink-0 group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(34,211,238,0.4)]">
                <Bot className="w-4 h-4 text-cyan-300" />
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-[0.2em] text-white uppercase font-['Orbitron',sans-serif] flex items-center gap-2">
                  SCIFI-BOT
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
                  </span>
                </span>
                <span className="text-[10px] font-medium tracking-[0.14em] text-cyan-300/80 uppercase">
                  AI FLIGHT ASSISTANT
                </span>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-cyan-400 shrink-0 font-bold transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* 3. TOP RIGHT: Player Profile & Daily Challenges HUD Panels */}
      <div className="absolute top-7 right-7 md:top-9 md:right-10 z-10 flex flex-col gap-3">
        <PlayerProfileHUD
          name="PLAYER ONE"
          onOpenProfile={() => setActiveModal('profile')}
        />
        <DailyChallengesHUD rewardXp={500} />
      </div>

      {/* 4. BOTTOM LEFT: Information Card & Keyboard Navigation Hints */}
      <div className="absolute bottom-8 left-8 md:bottom-10 md:left-12 z-10">
        <InfoCardHUD
          heading="EXPLORE. DISCOVER. SURVIVE."
          previewImage="/landscape-preview.jpg"
          line1="A vast open world awaits beyond the stars."
          line2="Every choice shapes your legend."
        />
      </div>

      {/* 5. Scifi-bot AI Chatbot Terminal (Triggered from button under Play) */}
      <HelpDeskChatbot
        isOpen={isHelpDeskOpen}
        onToggle={() => setIsHelpDeskOpen((prev) => !prev)}
        onOpenManual={() => setActiveModal('manual')}
        onOpenScores={() => setActiveModal('scores')}
        hideFloatingLauncher={true}
      />

      {/* 6. Modals for Interactivity */}
      <InteractiveModals
        activeModal={activeModal}
        onClose={() => setActiveModal('none')}
        titleMode={titleMode}
        onToggleTitleMode={setTitleMode}
        bgMode={bgMode}
        onToggleBgMode={setBgMode}
      />
    </main>
  )
}
