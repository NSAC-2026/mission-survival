'use client'

import React, { useState } from 'react'
import { Globe, Users, Mail, Settings, Bot, Trophy } from 'lucide-react'
import { cockpitAudio } from '@/utils/audio'

interface NavigationHUDProps {
  onOpenGlobe?: () => void
  onOpenCommunity?: () => void
  onOpenMessages?: () => void
  onOpenSettings?: () => void
  onOpenHelpDesk?: () => void
  onOpenScores?: () => void
}

export default function NavigationHUD({
  onOpenGlobe,
  onOpenCommunity,
  onOpenMessages,
  onOpenSettings,
  onOpenHelpDesk,
  onOpenScores,
}: NavigationHUDProps) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)

  const navItems = [
    {
      id: 'helpdesk',
      label: 'AI Flight Help Desk',
      icon: Bot,
      action: onOpenHelpDesk,
      highlight: true,
    },
    {
      id: 'scores',
      label: 'Scoreboard & Ranks',
      icon: Trophy,
      action: onOpenScores,
    },
    {
      id: 'globe',
      label: 'Planetary Map',
      icon: Globe,
      action: onOpenGlobe,
    },
    {
      id: 'community',
      label: 'Explorer Network',
      icon: Users,
      action: onOpenCommunity,
    },
    {
      id: 'messages',
      label: 'Starfleet Comms',
      icon: Mail,
      action: onOpenMessages,
    },
    {
      id: 'settings',
      label: 'System Settings',
      icon: Settings,
      action: onOpenSettings,
    },
  ]

  return (
    <div className="relative flex items-center gap-2 md:gap-3 select-none">
      {/* Tooltip */}
      {activeTooltip && (
        <div className="absolute -top-8 right-0 px-2.5 py-1 bg-black/85 backdrop-blur border border-amber-400/50 rounded text-[9.5px] font-mono tracking-wider text-amber-300 pointer-events-none whitespace-nowrap shadow-lg">
          {activeTooltip}
        </div>
      )}

      {navItems.map(({ id, label, icon: Icon, action, highlight }) => (
        <button
          key={id}
          type="button"
          onClick={() => {
            cockpitAudio.playClick()
            action?.()
          }}
          onMouseEnter={() => {
            cockpitAudio.playHover()
            setActiveTooltip(label)
          }}
          onMouseLeave={() => setActiveTooltip(null)}
          className={`w-8 h-8 rounded-sm bg-black/40 hover:bg-black/70 border flex items-center justify-center transition-all duration-200 group shadow-md ${
            highlight
              ? 'border-amber-400/50 text-amber-300 hover:border-amber-400 hover:bg-amber-400/20'
              : 'border-white/10 hover:border-amber-400/60 text-white/70 hover:text-amber-400'
          }`}
          aria-label={label}
        >
          <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
        </button>
      ))}
    </div>
  )
}
