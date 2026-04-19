/**
 * Simplified Level Progression Manager
 * Tracks completed levels and coins
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

const COMPLETED_LEVELS_KEY = "completedLevels";
const LEVEL_COINS_KEY = "levelCoins";

export class SimpleLevelProgress {
  /**
   * Get completed levels
   */
  static async getCompletedLevels(): Promise<number[]> {
    try {
      const data = await AsyncStorage.getItem(COMPLETED_LEVELS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error reading completed levels:", error);
      return [];
    }
  }

  /**
   * Mark level as completed
   */
  static async completeLevel(levelId: number): Promise<void> {
    try {
      const completed = await this.getCompletedLevels();
      if (!completed.includes(levelId)) {
        completed.push(levelId);
        await AsyncStorage.setItem(COMPLETED_LEVELS_KEY, JSON.stringify(completed));
      }
    } catch (error) {
      console.error("Error completing level:", error);
    }
  }

  /**
   * Get total coins earned from levels
   */
  static async getLevelCoins(): Promise<number> {
    try {
      const data = await AsyncStorage.getItem(LEVEL_COINS_KEY);
      return data ? parseInt(data, 10) : 0;
    } catch (error) {
      console.error("Error reading level coins:", error);
      return 0;
    }
  }

  /**
   * Add coins from level completion
   */
  static async addLevelCoins(amount: number): Promise<void> {
    try {
      const current = await this.getLevelCoins();
      await AsyncStorage.setItem(LEVEL_COINS_KEY, (current + amount).toString());
    } catch (error) {
      console.error("Error adding level coins:", error);
    }
  }

  /**
   * Reset all progress (for testing)
   */
  static async resetProgress(): Promise<void> {
    try {
      await AsyncStorage.removeItem(COMPLETED_LEVELS_KEY);
      await AsyncStorage.removeItem(LEVEL_COINS_KEY);
    } catch (error) {
      console.error("Error resetting progress:", error);
    }
  }
}
