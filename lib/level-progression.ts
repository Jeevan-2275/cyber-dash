/**
 * Level Progression Manager
 * Tracks level completion, rewards, and player progress
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { LevelProgress } from "./level-system";

const LEVEL_PROGRESS_KEY = "cyber_dash_level_progress";
const LEVEL_COINS_KEY = "cyber_dash_level_coins";

export class LevelProgressionManager {
  private levelProgress: Map<number, LevelProgress> = new Map();
  private totalCoins: number = 0;

  /**
   * Initialize from storage
   */
  async initialize(): Promise<void> {
    try {
      const progressData = await AsyncStorage.getItem(LEVEL_PROGRESS_KEY);
      const coinsData = await AsyncStorage.getItem(LEVEL_COINS_KEY);

      if (progressData) {
        const progress = JSON.parse(progressData);
        for (const [levelId, data] of Object.entries(progress)) {
          this.levelProgress.set(parseInt(levelId), data as LevelProgress);
        }
      }

      if (coinsData) {
        this.totalCoins = parseInt(coinsData);
      }

      console.log(
        `[LevelProgression] Loaded progress for ${this.levelProgress.size} levels`
      );
    } catch (error) {
      console.error("[LevelProgression] Error loading progress:", error);
    }
  }

  /**
   * Complete a level
   */
  async completeLevel(
    levelId: number,
    score: number,
    stars: number,
    coins: number,
    noCrash: boolean
  ): Promise<void> {
    const existing = this.levelProgress.get(levelId) || {
      levelId,
      completed: false,
      bestScore: 0,
      bestCombo: 0,
      coinsEarned: 0,
      stars: 0,
      noCrashAchieved: false,
      attempts: 0,
    };

    const updated: LevelProgress = {
      ...existing,
      completed: true,
      bestScore: Math.max(existing.bestScore, score),
      bestCombo: Math.max(existing.bestCombo, 0), // TODO: track combo
      coinsEarned: existing.coinsEarned + coins,
      stars: Math.max(existing.stars, stars),
      noCrashAchieved: existing.noCrashAchieved || noCrash,
      attempts: existing.attempts + 1,
    };

    this.levelProgress.set(levelId, updated);
    this.totalCoins += coins;

    await this.save();
    console.log(
      `[LevelProgression] Completed level ${levelId} with ${stars} stars`
    );
  }

  /**
   * Record level attempt
   */
  async recordAttempt(levelId: number): Promise<void> {
    const existing = this.levelProgress.get(levelId) || {
      levelId,
      completed: false,
      bestScore: 0,
      bestCombo: 0,
      coinsEarned: 0,
      stars: 0,
      noCrashAchieved: false,
      attempts: 0,
    };

    existing.attempts += 1;
    this.levelProgress.set(levelId, existing);
    await this.save();
  }

  /**
   * Get level progress
   */
  getLevelProgress(levelId: number): LevelProgress | undefined {
    return this.levelProgress.get(levelId);
  }

  /**
   * Check if level is unlocked
   */
  isLevelUnlocked(levelId: number): boolean {
    if (levelId === 1) return true; // First level always unlocked
    const previousLevel = this.levelProgress.get(levelId - 1);
    return previousLevel?.completed || false;
  }

  /**
   * Get all level progress
   */
  getAllProgress(): LevelProgress[] {
    const progress: LevelProgress[] = [];
    for (let i = 1; i <= 10; i++) {
      progress.push(
        this.levelProgress.get(i) || {
          levelId: i,
          completed: false,
          bestScore: 0,
          bestCombo: 0,
          coinsEarned: 0,
          stars: 0,
          noCrashAchieved: false,
          attempts: 0,
        }
      );
    }
    return progress;
  }

  /**
   * Get total coins earned
   */
  getTotalCoins(): number {
    return this.totalCoins;
  }

  /**
   * Get total stars
   */
  getTotalStars(): number {
    let totalStars = 0;
    for (const progress of this.levelProgress.values()) {
      totalStars += progress.stars;
    }
    return totalStars;
  }

  /**
   * Get completed levels count
   */
  getCompletedLevelsCount(): number {
    let count = 0;
    for (const progress of this.levelProgress.values()) {
      if (progress.completed) count++;
    }
    return count;
  }

  /**
   * Get completion percentage
   */
  getCompletionPercentage(): number {
    const completed = this.getCompletedLevelsCount();
    return Math.round((completed / 10) * 100);
  }

  /**
   * Get level stats
   */
  getLevelStats(levelId: number): {
    completed: boolean;
    bestScore: number;
    stars: number;
    coinsEarned: number;
    attempts: number;
  } {
    const progress = this.levelProgress.get(levelId);
    return {
      completed: progress?.completed || false,
      bestScore: progress?.bestScore || 0,
      stars: progress?.stars || 0,
      coinsEarned: progress?.coinsEarned || 0,
      attempts: progress?.attempts || 0,
    };
  }

  /**
   * Reset all progress (for testing)
   */
  async resetAll(): Promise<void> {
    this.levelProgress.clear();
    this.totalCoins = 0;
    await AsyncStorage.removeItem(LEVEL_PROGRESS_KEY);
    await AsyncStorage.removeItem(LEVEL_COINS_KEY);
    console.log("[LevelProgression] All progress reset");
  }

  /**
   * Save to storage
   */
  private async save(): Promise<void> {
    try {
      const progressData: Record<number, LevelProgress> = {};
      for (const [levelId, progress] of this.levelProgress) {
        progressData[levelId] = progress;
      }

      await AsyncStorage.setItem(
        LEVEL_PROGRESS_KEY,
        JSON.stringify(progressData)
      );
      await AsyncStorage.setItem(LEVEL_COINS_KEY, this.totalCoins.toString());
    } catch (error) {
      console.error("[LevelProgression] Error saving progress:", error);
    }
  }
}
