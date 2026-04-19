/**
 * Level System for Cyber Dash
 * Defines all levels, difficulty progression, and level-specific rules
 */

export type LevelTheme = "neon-city" | "dark-tunnel" | "cyber-grid";
export type PowerUpType = "shield" | "slow-motion" | "coin-magnet";

export interface PowerUp {
  type: PowerUpType;
  duration: number; // milliseconds
  spawnChance: number; // 0-1
  color: string;
}

export interface LevelDefinition {
  id: number;
  name: string;
  description: string;
  theme: LevelTheme;
  difficulty: number; // 1-5
  
  // Level objectives
  duration: number; // milliseconds (0 = infinite until collision)
  targetDistance?: number; // pixels (alternative to duration)
  
  // Difficulty parameters
  baseSpeed: number; // pixels per frame
  speedMultiplier: number; // increases over time
  obstacleFrequency: number; // obstacles per second
  obstacleVariety: string[]; // types of obstacles
  
  // Power-ups
  powerUps: PowerUp[];
  
  // Rewards
  baseCoins: number;
  noCrashBonus: number;
  highScoreBonus: number;
  
  // Patterns (optional)
  patterns?: ObstaclePattern[];
}

export interface ObstaclePattern {
  name: string;
  obstacles: Array<{
    type: "wall" | "gap" | "moving";
    height: number;
    delay: number; // milliseconds from pattern start
  }>;
  duration: number; // how long pattern lasts
}

export interface LevelProgress {
  levelId: number;
  completed: boolean;
  bestScore: number;
  bestCombo: number;
  coinsEarned: number;
  stars: number; // 1-3
  noCrashAchieved: boolean;
  attempts: number;
}

// Define all levels
export const LEVELS: LevelDefinition[] = [
  {
    id: 1,
    name: "Neon Dawn",
    description: "Welcome to the neon city. Survive 30 seconds.",
    theme: "neon-city",
    difficulty: 1,
    duration: 30000,
    baseSpeed: 4,
    speedMultiplier: 1.05,
    obstacleFrequency: 1.5,
    obstacleVariety: ["wall", "gap"],
    powerUps: [
      { type: "shield", duration: 5000, spawnChance: 0.1, color: "#00FFFF" },
    ],
    baseCoins: 100,
    noCrashBonus: 50,
    highScoreBonus: 25,
  },
  {
    id: 2,
    name: "Speed Rush",
    description: "Reach 2.0x speed multiplier.",
    theme: "neon-city",
    difficulty: 2,
    duration: 0,
    targetDistance: 2000,
    baseSpeed: 5,
    speedMultiplier: 1.08,
    obstacleFrequency: 2,
    obstacleVariety: ["wall", "gap", "moving"],
    powerUps: [
      { type: "shield", duration: 5000, spawnChance: 0.15, color: "#00FFFF" },
      { type: "slow-motion", duration: 3000, spawnChance: 0.1, color: "#FF00FF" },
    ],
    baseCoins: 150,
    noCrashBonus: 75,
    highScoreBonus: 50,
  },
  {
    id: 3,
    name: "Dark Tunnel",
    description: "Navigate the dark tunnel. Survive 45 seconds.",
    theme: "dark-tunnel",
    difficulty: 2,
    duration: 45000,
    baseSpeed: 4.5,
    speedMultiplier: 1.06,
    obstacleFrequency: 1.8,
    obstacleVariety: ["wall", "gap"],
    powerUps: [
      { type: "shield", duration: 5000, spawnChance: 0.12, color: "#00FFFF" },
      { type: "coin-magnet", duration: 8000, spawnChance: 0.08, color: "#FFFF00" },
    ],
    baseCoins: 120,
    noCrashBonus: 60,
    highScoreBonus: 40,
  },
  {
    id: 4,
    name: "Cyber Grid",
    description: "Enter the cyber grid. Survive 60 seconds.",
    theme: "cyber-grid",
    difficulty: 3,
    duration: 60000,
    baseSpeed: 5,
    speedMultiplier: 1.07,
    obstacleFrequency: 2.2,
    obstacleVariety: ["wall", "gap", "moving"],
    powerUps: [
      { type: "shield", duration: 5000, spawnChance: 0.15, color: "#00FFFF" },
      { type: "slow-motion", duration: 3000, spawnChance: 0.12, color: "#FF00FF" },
      { type: "coin-magnet", duration: 8000, spawnChance: 0.1, color: "#FFFF00" },
    ],
    baseCoins: 200,
    noCrashBonus: 100,
    highScoreBonus: 75,
  },
  {
    id: 5,
    name: "Obstacle Course",
    description: "Navigate complex patterns. Survive 45 seconds.",
    theme: "neon-city",
    difficulty: 3,
    duration: 45000,
    baseSpeed: 5.5,
    speedMultiplier: 1.08,
    obstacleFrequency: 2.5,
    obstacleVariety: ["wall", "gap", "moving"],
    powerUps: [
      { type: "shield", duration: 5000, spawnChance: 0.2, color: "#00FFFF" },
      { type: "slow-motion", duration: 3000, spawnChance: 0.15, color: "#FF00FF" },
    ],
    baseCoins: 180,
    noCrashBonus: 90,
    highScoreBonus: 60,
  },
  {
    id: 6,
    name: "Speed Demon",
    description: "Extreme speed. Survive 30 seconds.",
    theme: "cyber-grid",
    difficulty: 4,
    duration: 30000,
    baseSpeed: 6.5,
    speedMultiplier: 1.1,
    obstacleFrequency: 3,
    obstacleVariety: ["wall", "gap", "moving"],
    powerUps: [
      { type: "shield", duration: 5000, spawnChance: 0.25, color: "#00FFFF" },
      { type: "slow-motion", duration: 3000, spawnChance: 0.2, color: "#FF00FF" },
      { type: "coin-magnet", duration: 8000, spawnChance: 0.15, color: "#FFFF00" },
    ],
    baseCoins: 250,
    noCrashBonus: 125,
    highScoreBonus: 100,
  },
  {
    id: 7,
    name: "Tunnel Chaos",
    description: "Dark tunnel madness. Survive 60 seconds.",
    theme: "dark-tunnel",
    difficulty: 4,
    duration: 60000,
    baseSpeed: 5.5,
    speedMultiplier: 1.09,
    obstacleFrequency: 2.8,
    obstacleVariety: ["wall", "gap", "moving"],
    powerUps: [
      { type: "shield", duration: 5000, spawnChance: 0.2, color: "#00FFFF" },
      { type: "slow-motion", duration: 3000, spawnChance: 0.15, color: "#FF00FF" },
      { type: "coin-magnet", duration: 8000, spawnChance: 0.12, color: "#FFFF00" },
    ],
    baseCoins: 220,
    noCrashBonus: 110,
    highScoreBonus: 85,
  },
  {
    id: 8,
    name: "Grid Master",
    description: "Master the cyber grid. Survive 75 seconds.",
    theme: "cyber-grid",
    difficulty: 5,
    duration: 75000,
    baseSpeed: 6,
    speedMultiplier: 1.1,
    obstacleFrequency: 3.2,
    obstacleVariety: ["wall", "gap", "moving"],
    powerUps: [
      { type: "shield", duration: 5000, spawnChance: 0.25, color: "#00FFFF" },
      { type: "slow-motion", duration: 3000, spawnChance: 0.2, color: "#FF00FF" },
      { type: "coin-magnet", duration: 8000, spawnChance: 0.18, color: "#FFFF00" },
    ],
    baseCoins: 300,
    noCrashBonus: 150,
    highScoreBonus: 120,
  },
  {
    id: 9,
    name: "Neon Inferno",
    description: "Ultimate neon city challenge. Survive 90 seconds.",
    theme: "neon-city",
    difficulty: 5,
    duration: 90000,
    baseSpeed: 6.5,
    speedMultiplier: 1.11,
    obstacleFrequency: 3.5,
    obstacleVariety: ["wall", "gap", "moving"],
    powerUps: [
      { type: "shield", duration: 5000, spawnChance: 0.3, color: "#00FFFF" },
      { type: "slow-motion", duration: 3000, spawnChance: 0.25, color: "#FF00FF" },
      { type: "coin-magnet", duration: 8000, spawnChance: 0.2, color: "#FFFF00" },
    ],
    baseCoins: 350,
    noCrashBonus: 175,
    highScoreBonus: 150,
  },
  {
    id: 10,
    name: "Apex Predator",
    description: "The ultimate test. Survive 120 seconds.",
    theme: "dark-tunnel",
    difficulty: 5,
    duration: 120000,
    baseSpeed: 7,
    speedMultiplier: 1.12,
    obstacleFrequency: 4,
    obstacleVariety: ["wall", "gap", "moving"],
    powerUps: [
      { type: "shield", duration: 5000, spawnChance: 0.3, color: "#00FFFF" },
      { type: "slow-motion", duration: 3000, spawnChance: 0.25, color: "#FF00FF" },
      { type: "coin-magnet", duration: 8000, spawnChance: 0.22, color: "#FFFF00" },
    ],
    baseCoins: 400,
    noCrashBonus: 200,
    highScoreBonus: 175,
  },
];

/**
 * Get level by ID
 */
export function getLevelById(id: number): LevelDefinition | undefined {
  return LEVELS.find((level) => level.id === id);
}

/**
 * Get all levels
 */
export function getAllLevels(): LevelDefinition[] {
  return [...LEVELS];
}

/**
 * Calculate stars based on score and level
 */
export function calculateStars(score: number, level: LevelDefinition): number {
  const baseThreshold = level.baseCoins;
  if (score >= baseThreshold * 2) return 3;
  if (score >= baseThreshold * 1.5) return 2;
  if (score >= baseThreshold) return 1;
  return 0;
}

/**
 * Get theme colors
 */
export function getThemeColors(theme: LevelTheme): {
  primary: string;
  secondary: string;
  background: string;
} {
  switch (theme) {
    case "neon-city":
      return {
        primary: "#00FFFF",
        secondary: "#FF00FF",
        background: "#0a0a1a",
      };
    case "dark-tunnel":
      return {
        primary: "#00FF88",
        secondary: "#FF0088",
        background: "#050510",
      };
    case "cyber-grid":
      return {
        primary: "#FFFF00",
        secondary: "#00FFFF",
        background: "#0a0a2a",
      };
  }
}
