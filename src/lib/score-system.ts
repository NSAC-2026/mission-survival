/**
 * Mission Survival – Beyond Earth
 * Comprehensive Game Scoring, XP, Ranks & Achievements System
 */

export interface LevelScoreEntry {
  level: number
  score: number
  maxScore: number
  stars: number
  grade: 'S' | 'A' | 'B' | 'C'
  clearedAt?: string
  details?: Record<string, any>
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  xpReward: number
  unlocked: boolean
  unlockedAt?: string
}

export interface ScoreState {
  totalXp: number
  level: number
  currentLevelXp: number
  maxLevelXp: number
  rank: string
  levelScores: Record<number, LevelScoreEntry>
  achievements: Achievement[]
  dailyCompletedCount: number
  highScore: number
}

const STORAGE_KEY = 'msbe_mission_score_state_v1'

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'rad-shield',
    title: 'Solar Shield Master',
    description: 'Achieve 100% full radiation protection against coronal solar storm.',
    icon: '🛡️',
    xpReward: 350,
    unlocked: false,
  },
  {
    id: 'orbital-insertion',
    title: 'Orbital Velocity',
    description: 'Execute flawless Proton rocket staging and achieve 7.8 km/s orbital injection.',
    icon: '🚀',
    xpReward: 500,
    unlocked: false,
  },
  {
    id: 'perfect-dock',
    title: 'Ace Pilot',
    description: 'Align APDS latches and dock with the ISS within tolerance limits.',
    icon: '🛰️',
    xpReward: 600,
    unlocked: false,
  },
  {
    id: 'lunar-survivor',
    title: 'Artemis Engineer',
    description: 'Balance ECLSS oxygen and -130°C thermal heating during 14-day lunar night.',
    icon: '🌕',
    xpReward: 500,
    unlocked: false,
  },
  {
    id: 'mars-colonist',
    title: 'Martian Pioneer',
    description: 'Survive severe Martian sandstorms and pressurize the colonial bio-dome.',
    icon: '🪐',
    xpReward: 750,
    unlocked: false,
  },
  {
    id: 'daily-grind',
    title: 'Daily Explorer',
    description: 'Complete and claim daily Kepler survey challenges.',
    icon: '⭐',
    xpReward: 250,
    unlocked: false,
  },
  {
    id: 'starfleet-elite',
    title: 'Starfleet Legend',
    description: 'Accumulate over 5,000 Total Mission XP.',
    icon: '👑',
    xpReward: 1000,
    unlocked: false,
  },
]

export function computeRank(level: number): string {
  if (level < 3) return 'Cadet Explorer'
  if (level < 6) return 'Junior Astronaut'
  if (level < 10) return 'Orbital Specialist'
  if (level < 15) return 'Senior Mission Commander'
  return 'Starfleet Admiral'
}

export function computeGrade(score: number, maxScore: number): 'S' | 'A' | 'B' | 'C' {
  const ratio = maxScore > 0 ? score / maxScore : 0
  if (ratio >= 0.95) return 'S'
  if (ratio >= 0.8) return 'A'
  if (ratio >= 0.6) return 'B'
  return 'C'
}

function getInitialState(): ScoreState {
  const initialXp = 3250 // Matches existing lore default
  const xpPerLevel = 500
  const level = Math.floor(initialXp / xpPerLevel) + 1
  const currentLevelXp = initialXp % xpPerLevel

  return {
    totalXp: initialXp,
    level,
    currentLevelXp,
    maxLevelXp: xpPerLevel,
    rank: computeRank(level),
    levelScores: {},
    achievements: [...INITIAL_ACHIEVEMENTS],
    dailyCompletedCount: 0,
    highScore: initialXp,
  }
}

let cachedState: ScoreState | null = null
const listeners: Array<(state: ScoreState) => void> = []

export function subscribeScoreChange(fn: (state: ScoreState) => void): () => void {
  listeners.push(fn)
  return () => {
    const idx = listeners.indexOf(fn)
    if (idx !== -1) listeners.splice(idx, 1)
  }
}

function notifyListeners(state: ScoreState) {
  for (const fn of listeners) {
    try {
      fn(state)
    } catch {
      // ignore listener error
    }
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('msbe_score_updated', { detail: state }))
  }
}

export function getScoreState(): ScoreState {
  if (cachedState) return cachedState

  if (typeof window === 'undefined') {
    return getInitialState()
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<ScoreState>
      const base = getInitialState()
      const merged: ScoreState = {
        ...base,
        ...parsed,
        levelScores: { ...base.levelScores, ...(parsed.levelScores || {}) },
        achievements: base.achievements.map((a) => {
          const match = parsed.achievements?.find((p) => p.id === a.id)
          return match ? { ...a, ...match } : a
        }),
      }
      cachedState = recalculateLevelAndRank(merged)
      return cachedState
    }
  } catch {
    // fallback
  }

  cachedState = getInitialState()
  return cachedState
}

function saveScoreState(state: ScoreState): void {
  cachedState = state
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // storage quota or disabled
    }
  }
  notifyListeners(state)
}

function recalculateLevelAndRank(state: ScoreState): ScoreState {
  const xpPerLevel = 500
  const level = Math.max(1, Math.floor(state.totalXp / xpPerLevel) + 1)
  const currentLevelXp = state.totalXp % xpPerLevel
  const rank = computeRank(level)
  const highScore = Math.max(state.highScore || 0, state.totalXp)

  // Check automated achievements
  const achievements = state.achievements.map((ach) => {
    if (ach.id === 'starfleet-elite' && state.totalXp >= 5000 && !ach.unlocked) {
      return { ...ach, unlocked: true, unlockedAt: new Date().toISOString() }
    }
    return ach
  })

  return {
    ...state,
    level,
    currentLevelXp,
    maxLevelXp: xpPerLevel,
    rank,
    highScore,
    achievements,
  }
}

/**
 * Record score for clearing or progressing a level
 */
export function recordLevelScore(
  levelNum: number,
  scoreEarned: number,
  maxScore: number,
  stars: number = 3,
  details?: Record<string, any>
): ScoreState {
  const current = getScoreState()
  const previousEntry = current.levelScores[levelNum]

  const grade = computeGrade(scoreEarned, maxScore)
  const now = new Date().toISOString()

  // Only add delta if new score is higher, or if first time
  const oldScore = previousEntry?.score || 0
  const deltaXp = Math.max(0, scoreEarned - oldScore)

  const updatedScores = {
    ...current.levelScores,
    [levelNum]: {
      level: levelNum,
      score: Math.max(oldScore, scoreEarned),
      maxScore,
      stars: Math.max(previousEntry?.stars || 0, stars),
      grade,
      clearedAt: now,
      details,
    },
  }

  // Trigger level-specific achievements
  let achievements = [...current.achievements]
  const unlockAch = (id: string) => {
    achievements = achievements.map((a) =>
      a.id === id && !a.unlocked ? { ...a, unlocked: true, unlockedAt: now } : a
    )
  }

  if (levelNum === 1 && scoreEarned >= 900) unlockAch('rad-shield')
  if (levelNum === 2 && stars >= 2) unlockAch('orbital-insertion')
  if (levelNum === 3 && scoreEarned >= 1500) unlockAch('perfect-dock')
  if (levelNum === 4 && scoreEarned >= 1000) unlockAch('lunar-survivor')
  if (levelNum === 5 && scoreEarned >= 1200) unlockAch('mars-colonist')

  const updatedState = recalculateLevelAndRank({
    ...current,
    totalXp: current.totalXp + deltaXp,
    levelScores: updatedScores,
    achievements,
  })

  saveScoreState(updatedState)
  return updatedState
}

/**
 * Claim daily challenge reward
 */
export function claimDailyReward(rewardXp: number = 500): ScoreState {
  const current = getScoreState()
  let achievements = current.achievements.map((a) =>
    a.id === 'daily-grind' && !a.unlocked
      ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() }
      : a
  )

  const updatedState = recalculateLevelAndRank({
    ...current,
    totalXp: current.totalXp + rewardXp,
    dailyCompletedCount: current.dailyCompletedCount + 1,
    achievements,
  })

  saveScoreState(updatedState)
  return updatedState
}

/**
 * Manually unlock an achievement
 */
export function unlockAchievement(achievementId: string): ScoreState {
  const current = getScoreState()
  const target = current.achievements.find((a) => a.id === achievementId)
  if (!target || target.unlocked) return current

  const updatedAchievements = current.achievements.map((a) =>
    a.id === achievementId ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() } : a
  )

  const updatedState = recalculateLevelAndRank({
    ...current,
    totalXp: current.totalXp + target.xpReward,
    achievements: updatedAchievements,
  })

  saveScoreState(updatedState)
  return updatedState
}

/**
 * Reset all scores and progress back to factory defaults
 */
export function resetScoreState(): ScoreState {
  const fresh = getInitialState()
  saveScoreState(fresh)
  return fresh
}
