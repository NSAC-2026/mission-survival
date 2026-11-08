'use client'

import React, { useState } from 'react'
import { Star } from 'lucide-react'
import { cockpitAudio } from '@/utils/audio'

export interface ChallengeItem {
  id: string
  title: string
  current: number
  target: number
  unit?: string
}

interface DailyChallengesProps {
  initialChallenges?: ChallengeItem[]
  rewardXp?: number
}

const defaultChallenges: ChallengeItem[] = [
  { id: '1', title: 'Travel 10 km', current: 6.2, target: 10, unit: '' },
  { id: '2', title: 'Scan 5 Creatures', current: 2, target: 5, unit: '' },
  { id: '3', title: 'Collect 20 Resources', current: 12, target: 20, unit: '' },
]

export default function DailyChallengesHUD({
  initialChallenges = defaultChallenges,
  rewardXp = 500,
}: DailyChallengesProps) {
  const [challenges, setChallenges] = useState<ChallengeItem[]>(initialChallenges)
  const [claimed, setClaimed] = useState(false)

  const handleRowClick = (id: string) => {
    cockpitAudio.playClick()
    setChallenges((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextVal = Math.min(c.target, Number((c.current + (c.target <= 10 ? 1 : 2)).toFixed(1)))
          return { ...c, current: nextVal }
        }
        return c
      })
    )
  }

  const allCompleted = challenges.every((c) => c.current >= c.target)

  return (
    <div className="hud-panel rounded-sm px-3.5 py-3 w-[240px] md:w-[250px] select-none">
      {/* Heading */}
      <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2.5">
        <h3 className="text-[11px] font-bold tracking-[0.18em] text-white/90 uppercase font-['Orbitron',sans-serif]">
          DAILY CHALLENGES
        </h3>
        <span className="text-[9px] text-amber-400/80 font-mono">24H</span>
      </div>

      {/* Challenge Rows */}
      <div className="flex flex-col gap-2.5">
        {challenges.map((challenge) => {
          const pct = Math.min(100, Math.max(0, (challenge.current / challenge.target) * 100))
          return (
            <div
              key={challenge.id}
              onClick={() => handleRowClick(challenge.id)}
              className="group cursor-pointer hover:bg-white/[0.03] p-1 -mx-1 rounded transition-colors"
              title="Click to simulate progress"
            >
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-white/85 font-medium tracking-wide group-hover:text-amber-200 transition-colors">
                  {challenge.title}
                </span>
                <span className="font-mono text-[10px] text-white/70">
                  {challenge.current} / {challenge.target}
                </span>
              </div>
              <div className="h-1 w-full bg-black/60 rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full gold-gradient-bar transition-all duration-300 rounded-full"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Reward Section */}
      <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
          <span className="text-[10.5px] font-bold tracking-[0.14em] text-amber-400/90 font-['Orbitron',sans-serif] uppercase">
            REWARD: {rewardXp} XP
          </span>
        </div>
        {allCompleted && !claimed && (
          <button
            onClick={() => {
              cockpitAudio.playSuccessChime()
              setClaimed(true)
            }}
            className="text-[9px] px-1.5 py-0.5 bg-amber-400/20 border border-amber-400/80 text-amber-300 rounded font-bold hover:bg-amber-400/30"
          >
            CLAIM
          </button>
        )}
      </div>
    </div>
  )
}
