/**
 * Progression Manager for Cyber Dash
 * Manages coins, unlocked skins, and player upgrades
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

export interface PlayerProgress {
  totalCoins: number;
  coinsSpent: number;
  unlockedSkins: string[];
  activeSkin: string;
  totalGamesPlayed: number;
  totalScoreAllTime: number;
  achievements: string[];
}

export const DEFAULT_PLAYER_PROGRESS: PlayerProgress = {
  totalCoins: 0,
  coinsSpent: 0,
  unlockedSkins: ["default"], // Default skin always unlocked
  activeSkin: "default",
  totalGamesPlayed: 0,
  totalScoreAllTime: 0,
  achievements: [],
};

export const SKIN_PRICES: Record<string, number> = {
  default: 0,
  neon_pink: 500,
  neon_purple: 500,
  neon_cyan: 500,
  neon_gold: 1000,
  neon_rainbow: 2000,
};

export class ProgressionManager {
  private progress: PlayerProgress = { ...DEFAULT_PLAYER_PROGRESS };
  private storageKey = "playerProgress";

  constructor() {
    this.loadProgress();
  }

  /**
   * Load player progress from storage
   */
  private async loadProgress(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(this.storageKey);
      if (stored) {
        this.progress = JSON.parse(stored);
        console.log("[Progression] Loaded player progress");
      }
    } catch (error) {
      console.error("[Progression] Error loading progress:", error);
    }
  }

  /**
   * Save player progress to storage
   */
  private async saveProgress(): Promise<void> {
    try {
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(this.progress));
      console.log("[Progression] Saved player progress");
    } catch (error) {
      console.error("[Progression] Error saving progress:", error);
    }
  }

  /**
   * Add coins to player
   */
  public async addCoins(amount: number): Promise<void> {
    this.progress.totalCoins += amount;
    await this.saveProgress();
    console.log(`[Progression] Added ${amount} coins. Total: ${this.progress.totalCoins}`);
  }

  /**
   * Spend coins
   */
  public async spendCoins(amount: number): Promise<boolean> {
    if (this.progress.totalCoins < amount) {
      console.log("[Progression] Insufficient coins");
      return false;
    }

    this.progress.totalCoins -= amount;
    this.progress.coinsSpent += amount;
    await this.saveProgress();
    console.log(`[Progression] Spent ${amount} coins. Remaining: ${this.progress.totalCoins}`);
    return true;
  }

  /**
   * Get total coins
   */
  public getTotalCoins(): number {
    return this.progress.totalCoins;
  }

  /**
   * Unlock skin
   */
  public async unlockSkin(skinId: string): Promise<boolean> {
    if (this.progress.unlockedSkins.includes(skinId)) {
      console.log(`[Progression] Skin ${skinId} already unlocked`);
      return false;
    }

    const price = SKIN_PRICES[skinId] || 0;
    if (!(await this.spendCoins(price))) {
      console.log(`[Progression] Cannot unlock skin ${skinId} - insufficient coins`);
      return false;
    }

    this.progress.unlockedSkins.push(skinId);
    await this.saveProgress();
    console.log(`[Progression] Unlocked skin: ${skinId}`);
    return true;
  }

  /**
   * Set active skin
   */
  public async setActiveSkin(skinId: string): Promise<boolean> {
    if (!this.progress.unlockedSkins.includes(skinId)) {
      console.log(`[Progression] Skin ${skinId} not unlocked`);
      return false;
    }

    this.progress.activeSkin = skinId;
    await this.saveProgress();
    console.log(`[Progression] Active skin set to: ${skinId}`);
    return true;
  }

  /**
   * Get active skin
   */
  public getActiveSkin(): string {
    return this.progress.activeSkin;
  }

  /**
   * Get unlocked skins
   */
  public getUnlockedSkins(): string[] {
    return [...this.progress.unlockedSkins];
  }

  /**
   * Get available skins to unlock
   */
  public getAvailableSkins(): string[] {
    return Object.keys(SKIN_PRICES).filter(
      (skinId) => !this.progress.unlockedSkins.includes(skinId)
    );
  }

  /**
   * Update game stats
   */
  public async updateGameStats(score: number): Promise<void> {
    this.progress.totalGamesPlayed++;
    this.progress.totalScoreAllTime += score;

    // Award coins based on score (1 coin per 100 points)
    const coinsEarned = Math.floor(score / 100);
    if (coinsEarned > 0) {
      await this.addCoins(coinsEarned);
    }

    await this.saveProgress();
    console.log(`[Progression] Game stats updated. Total games: ${this.progress.totalGamesPlayed}`);
  }

  /**
   * Unlock achievement
   */
  public async unlockAchievement(achievementId: string): Promise<boolean> {
    if (this.progress.achievements.includes(achievementId)) {
      return false;
    }

    this.progress.achievements.push(achievementId);
    await this.saveProgress();
    console.log(`[Progression] Achievement unlocked: ${achievementId}`);
    return true;
  }

  /**
   * Get all achievements
   */
  public getAchievements(): string[] {
    return [...this.progress.achievements];
  }

  /**
   * Get player progress
   */
  public getProgress(): PlayerProgress {
    return { ...this.progress };
  }

  /**
   * Reset progress (for testing only)
   */
  public async resetProgress(): Promise<void> {
    this.progress = { ...DEFAULT_PLAYER_PROGRESS };
    await this.saveProgress();
    console.log("[Progression] Progress reset");
  }
}
