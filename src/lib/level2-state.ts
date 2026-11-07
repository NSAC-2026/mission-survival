/**
 * Level 2 Typed State Architecture (In-Memory Only, No LocalStorage)
 *
 * Page refresh completely resets state to initial defaults.
 */

import { SimOutcome } from './orbit-physics'

export type Level2Phase = 'systems' | 'orbital-alpha' | 'orbital-beta' | 'launch-sequence'
export type BetaChallengeId = 'ball-on-string' | 'unstable-orbit' | 'retro-burn'

export interface Level2State {
  installedParts: [boolean, boolean, boolean, boolean] // 1: Engines, 2: Fuel Tanks, 3: Guidance, 4: Payload
  altitude: number // 300, 500, 900 km
  thrustPct: number // 0-150%
  retroPct: number // 0-30% for retro challenge
  simStatus: 'IDLE' | 'BURNING' | 'IN_FLIGHT' | 'COMPLETED' | 'FAILED'
  lastOutcome: {
    outcome: SimOutcome
    reason: string
    chapter: number | null
  } | null
  unlockedChapters: number[] // 1-7
  seenChapters: number[] // Chapters player has already read (removes "NEW" badge)
  chapterClickCounts: Record<number, number> // track clicks to unlock on 2nd click
  completedChallenges: BetaChallengeId[]
  activeChallenge: BetaChallengeId
  burnCleared: boolean
  launchAttempts: number // 0-3
  stars: number // 0-3
  levelComplete: boolean
  activePhase: Level2Phase
  activeTab: 'case' | 'handbook'
  selectedStageView: 1 | 2 | 3 | 4
  assemblyWarning: string | null
}

const STORAGE_KEY = 'msbe_level2_progress_v1'

export const DEFAULT_LEVEL2_STATE: Level2State = {
  installedParts: [false, false, false, false],
  altitude: 500,
  thrustPct: 100,
  retroPct: 15,
  simStatus: 'IDLE',
  lastOutcome: null,
  unlockedChapters: [1], // Chapter 1 starts unlocked
  seenChapters: [],
  chapterClickCounts: {},
  completedChallenges: [],
  activeChallenge: 'ball-on-string',
  burnCleared: false,
  launchAttempts: 0,
  stars: 0,
  levelComplete: false,
  activePhase: 'systems',
  activeTab: 'handbook',
  selectedStageView: 1,
  assemblyWarning: null,
}

/**
 * Returns a fresh initial state.
 * Also cleans up any legacy localStorage entry so refreshing clears everything.
 */
export function loadSavedLevel2State(): Level2State {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  }
  return {
    ...DEFAULT_LEVEL2_STATE,
    installedParts: [false, false, false, false],
    completedChallenges: [],
    unlockedChapters: [1],
    seenChapters: [],
    chapterClickCounts: {},
    simStatus: 'IDLE',
    assemblyWarning: null,
    lastOutcome: null,
  }
}

/**
 * In-memory only: explicitly does NOT save to localStorage.
 * Page reload will always reset state.
 */
export function saveLevel2State(_state?: Level2State): void {
  void _state
}

export function isAssemblyComplete(installedParts: [boolean, boolean, boolean, boolean]): boolean {
  return installedParts.every(Boolean)
}

export function getMissingPartName(installedParts: [boolean, boolean, boolean, boolean]): string | null {
  const names = ['Engines (Structural System)', 'Fuel Tanks (Propulsion System)', 'Guidance System', 'Payload']
  for (let i = 0; i < 4; i++) {
    if (!installedParts[i]) return names[i]
  }
  return null
}
