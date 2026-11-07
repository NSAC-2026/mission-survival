/**
 * In-memory Campaign Progression Tracker
 *
 * Explicitly held in memory only (NOT stored in localStorage).
 * Page refresh completely resets progress back to initial state (Level 1 unlocked, Levels 2-5 locked).
 */

let unlockedLevels: number[] = [1]

export function getUnlockedLevels(): number[] {
  return [...unlockedLevels]
}

export function isLevelUnlocked(level: number): boolean {
  if (level === 1) return true
  return unlockedLevels.includes(level)
}

export function unlockLevel(level: number): void {
  if (!unlockedLevels.includes(level)) {
    unlockedLevels.push(level)
  }
}

export function resetCampaignProgress(): void {
  unlockedLevels = [1]
}

