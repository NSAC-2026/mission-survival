'use client'

import React, { useState, useEffect } from 'react'
import PlayerProfileHUD from './PlayerProfileHUD'
import DailyChallengesHUD from './DailyChallengesHUD'
import InfoCardHUD from './InfoCardHUD'
import NavigationHUD from './NavigationHUD'
import PlayButton from './PlayButton'
import InteractiveModals, { type ActiveModal } from './InteractiveModals'
import { cockpitAudio } from '@/utils/audio'

export default function MissionSurvivalLanding() {
  const [activeModal, setActiveModal] = useState<ActiveModal>('none')
  const [titleMode, setTitleMode] = useState<'MISSION SURVIVAL' | 'BEYOND HORIZON'>('MISSION SURVIVAL')
  const [bgMode, setBgMode] = useState<'cinematic' | 'reference'>('cinematic')

  // Keyboard shortcut listener for ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeModal !== 'none') {
          e.preventDefault()
          cockpitAudio.playClick()
          setActiveModal('none')
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeModal])

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

      {/* 2. TOP LEFT: Title & Main Navigation */}
      <div className="absolute top-7 left-7 md:top-9 md:left-10 z-10 flex flex-col">
        {/* Futuristic Sci-Fi Typography */}
        <header className="flex flex-col mb-7">
          {titleMode === 'MISSION SURVIVAL' ? (
            <>
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
            </>
          ) : (
            <>
              <h1 className="text-3xl sm:text-4xl md:text-[42px] lg:text-[46px] font-black text-white uppercase tracking-[0.26em] leading-[1.05] title-glow font-['Orbitron',sans-serif]">
                BEYOND
              </h1>
              <h1 className="text-3xl sm:text-4xl md:text-[42px] lg:text-[46px] font-black text-white uppercase tracking-[0.26em] leading-[1.05] title-glow font-['Orbitron',sans-serif] mt-0.5">
                HORIZON
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-5 md:w-7 h-[1px] bg-white/40" />
                <span className="text-[10.5px] md:text-[11.5px] italic font-semibold tracking-[0.32em] text-white/80 uppercase">
                  OPEN WORLD
                </span>
                <span className="w-5 md:w-7 h-[1px] bg-white/40" />
              </div>
            </>
          )}
        </header>

        {/* Play Button */}
        <PlayButton
          label="PLAY"
          subtitle="RESUME JOURNEY"
          onPlay={() => setActiveModal('missions')}
        />
      </div>

      {/* 3. TOP RIGHT: Player Profile & Daily Challenges HUD Panels */}
      <div className="absolute top-7 right-7 md:top-9 md:right-10 z-10 flex flex-col gap-3">
        <PlayerProfileHUD
          name="PLAYER ONE"
          rank="Explorer"
          level={12}
          currentXp={3250}
          maxXp={5000}
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

      {/* 5. BOTTOM RIGHT: Navigation Icons */}
      <div className="absolute bottom-6 right-7 md:bottom-8 md:right-10 z-10">
        <NavigationHUD
          onOpenGlobe={() => setActiveModal('globe')}
          onOpenCommunity={() => setActiveModal('community')}
          onOpenMessages={() => setActiveModal('messages')}
          onOpenSettings={() => setActiveModal('settings')}
        />
      </div>

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
