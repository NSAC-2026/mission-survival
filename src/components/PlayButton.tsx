'use client'

import React, { useEffect } from 'react'
import { Play, ChevronRight } from 'lucide-react'
import { cockpitAudio } from '@/utils/audio'

interface PlayButtonProps {
  label?: string
  subtitle?: string
  onPlay: () => void
}

export default function PlayButton({
  label = 'PLAY',
  subtitle = 'RESUME JOURNEY',
  onPlay,
}: PlayButtonProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        cockpitAudio.playClick()
        onPlay()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onPlay])

  return (
    <button
      type="button"
      onClick={() => {
        cockpitAudio.playClick()
        onPlay()
      }}
      onMouseEnter={() => cockpitAudio.playHover()}
      className="relative flex items-center justify-between w-[250px] md:w-[270px] px-4 py-3 rounded-sm transition-all duration-300 group text-left hud-panel-active bg-black/60 backdrop-blur-md border border-amber-400/80 shadow-[0_0_22px_rgba(234,179,8,0.35)] hover:shadow-[0_0_32px_rgba(234,179,8,0.6)] hover:border-amber-300 hover:scale-[1.02] cursor-pointer select-none"
      aria-label="Play Game"
    >
      <div className="flex items-center gap-3.5">
        {/* Play triangle icon in glowing circular frame */}
        <div className="w-7 h-7 rounded-full border border-amber-400/90 bg-amber-950/40 flex items-center justify-center text-amber-300 shrink-0 group-hover:scale-110 transition-transform shadow-[0_0_8px_rgba(234,179,8,0.4)]">
          <Play className="w-3.5 h-3.5 fill-amber-300 ml-0.5" />
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-[0.2em] text-white uppercase font-['Orbitron',sans-serif]">
            {label}
          </span>
          {subtitle && (
            <span className="text-[10px] font-medium tracking-[0.14em] text-amber-300/80 uppercase">
              {subtitle}
            </span>
          )}
        </div>
      </div>

      {/* Right chevron arrow */}
      <ChevronRight className="w-4 h-4 text-amber-400 shrink-0 font-bold transition-transform group-hover:translate-x-1" />
    </button>
  )
}
