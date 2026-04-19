/**
 * Simplified Level System
 * 5 straightforward levels with fixed durations and progressive difficulty
 */

export interface SimpleLevel {
  id: number;
  name: string;
  duration: number; // milliseconds
  baseSpeed: number; // pixels per frame
  speedIncrease: number; // increase per second
  obstacleFrequency: number; // obstacles per second
  coinReward: number;
}

export const SIMPLE_LEVELS: SimpleLevel[] = [
  {
    id: 1,
    name: "Level 1: Getting Started",
    duration: 30000, // 30 seconds
    baseSpeed: 4,
    speedIncrease: 0.02,
    obstacleFrequency: 1.2,
    coinReward: 100,
  },
  {
    id: 2,
    name: "Level 2: Picking Up Speed",
    duration: 30000, // 30 seconds
    baseSpeed: 4.5,
    speedIncrease: 0.03,
    obstacleFrequency: 1.5,
    coinReward: 150,
  },
  {
    id: 3,
    name: "Level 3: Full Throttle",
    duration: 35000, // 35 seconds
    baseSpeed: 5,
    speedIncrease: 0.04,
    obstacleFrequency: 1.8,
    coinReward: 200,
  },
  {
    id: 4,
    name: "Level 4: Extreme Speed",
    duration: 40000, // 40 seconds
    baseSpeed: 5.5,
    speedIncrease: 0.05,
    obstacleFrequency: 2.2,
    coinReward: 250,
  },
  {
    id: 5,
    name: "Level 5: Ultimate Challenge",
    duration: 45000, // 45 seconds
    baseSpeed: 6,
    speedIncrease: 0.06,
    obstacleFrequency: 2.5,
    coinReward: 300,
  },
];

/**
 * Get level by ID
 */
export function getLevelById(levelId: number): SimpleLevel | null {
  return SIMPLE_LEVELS.find((level) => level.id === levelId) || null;
}

/**
 * Check if level is unlocked (all previous levels completed)
 */
export function isLevelUnlocked(levelId: number, completedLevels: number[]): boolean {
  if (levelId === 1) return true; // Level 1 always unlocked
  return completedLevels.includes(levelId - 1); // Previous level must be completed
}

/**
 * Get all unlocked levels
 */
export function getUnlockedLevels(completedLevels: number[]): SimpleLevel[] {
  return SIMPLE_LEVELS.filter((level) => isLevelUnlocked(level.id, completedLevels));
}
