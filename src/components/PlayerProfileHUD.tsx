'use client'

import React from 'react'

interface PlayerProfileProps {
  name?: string
  rank?: string
  level?: number
  currentXp?: number
  maxXp?: number
  onOpenProfile?: () => void
}

export function HexagonEmblem({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer Hexagon border with golden glow */}
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]">
        <polygon
          points="50,4 93,27 93,73 50,96 7,73 7,27"
          fill="rgba(18, 12, 6, 0.75)"
          stroke="rgba(234, 179, 8, 0.85)"
          strokeWidth="3.5"
        />
        {/* Inner concentric hexagon */}
        <polygon
          points="50,14 84,33 84,67 50,86 16,67 16,33"
          fill="none"
          stroke="rgba(251, 191, 36, 0.4)"
          strokeWidth="1.5"
          strokeDasharray="4 2"
        />
        {/* Central sci-fi chevron star emblem */}
        <path
          d="M50 25 L65 50 L50 44 L35 50 Z"
          fill="rgba(250, 204, 21, 0.9)"
        />
        <path
          d="M50 75 L65 54 L50 60 L35 54 Z"
          fill="rgba(217, 119, 6, 0.9)"
        />
        <circle cx="50" cy="52" r="4.5" fill="#fef08a" />
      </svg>
    </div>
  )
}

export default function PlayerProfileHUD({
  name = 'PLAYER ONE',
  rank = 'Explorer',
  level = 12,
  currentXp = 3250,
  maxXp = 5000,
  onOpenProfile,
}: PlayerProfileProps) {
  const percentage = Math.min(100, Math.max(0, (currentXp / maxXp) * 100))

  return (
    <div
      onClick={onOpenProfile}
      className="hud-panel rounded-sm px-3.5 py-3 w-[240px] md:w-[250px] cursor-pointer hover:border-amber-400/40 transition-all duration-300 group select-none"
      title="Click to view Explorer Profile"
    >
      <div className="flex items-center gap-3">
        {/* Avatar emblem */}
        <div className="shrink-0 transition-transform duration-300 group-hover:scale-105">
          <HexagonEmblem className="w-10 h-10" />
        </div>

        {/* Player info text */}
        <div className="flex flex-col min-w-0">
          <span className="text-[12px] font-bold tracking-[0.12em] text-white uppercase truncate font-['Orbitron',sans-serif]">
            {name}
          </span>
          <span className="text-[11px] text-white/60 font-medium tracking-wide">
            {rank}
          </span>
          <span className="text-[11px] text-white/90 font-semibold tracking-wide">
            Level {level}
          </span>
        </div>
      </div>

      {/* XP progress bar */}
      <div className="mt-2.5">
        <div className="h-1.5 w-full bg-black/60 rounded-full overflow-hidden border border-white/10">
          <div
            className="h-full gold-gradient-bar transition-all duration-500 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-end mt-1">
          <span className="text-[9.5px] font-mono tracking-wider text-white/65">
            {currentXp.toLocaleString()} / {maxXp.toLocaleString()} XP
          </span>
        </div>
      </div>
    </div>
  )
}
