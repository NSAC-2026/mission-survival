'use client'

import React from 'react'

interface InfoCardProps {
  heading?: string
  previewImage?: string
  line1?: string
  line2?: string
}

export default function InfoCardHUD({
  heading = 'EXPLORE. DISCOVER. SURVIVE.',
  previewImage = '/landscape-preview.jpg',
  line1 = 'A vast open world awaits beyond the stars.',
  line2 = 'Every choice shapes your legend.',
}: InfoCardProps) {
  return (
    <div className="flex flex-col gap-4 select-none">
      {/* Glassmorphism Card */}
      <div className="hud-panel rounded-sm p-3.5 w-[250px] md:w-[270px] border border-white/15 shadow-2xl">
        <h4 className="text-[11.5px] font-bold tracking-[0.16em] text-white/95 uppercase font-['Orbitron',sans-serif] mb-2">
          {heading}
        </h4>

        {/* Thumbnail Preview Image */}
        <div className="relative w-full h-[52px] md:h-[58px] rounded-sm overflow-hidden border border-white/15 mb-2.5 bg-black/40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewImage}
            alt="Alien world landscape preview"
            className="w-full h-full object-cover object-center filter contrast-110 saturate-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Descriptive Text */}
        <div className="text-[10px] md:text-[10.5px] leading-relaxed text-white/70 font-normal tracking-wide">
          <p>{line1}</p>
          <p className="mt-0.5">{line2}</p>
        </div>
      </div>

      {/* Keyboard hints at bottom-left */}
      <div className="flex items-center gap-4 text-white/70">
        <div className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 bg-black/60 border border-white/25 rounded text-[9px] font-mono font-bold text-white shadow-sm">
            ENTER
          </kbd>
          <span className="text-[10px] font-semibold tracking-widest text-white/70 uppercase">
            SELECT
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 bg-black/60 border border-white/25 rounded text-[9px] font-mono font-bold text-white shadow-sm">
            ESC
          </kbd>
          <span className="text-[10px] font-semibold tracking-widest text-white/70 uppercase">
            BACK
          </span>
        </div>
      </div>
    </div>
  )
}
