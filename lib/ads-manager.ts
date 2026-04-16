/**
 * Ads Manager for Cyber Dash
 * Handles rewarded and interstitial ads using Expo Ads (or mock for Expo Go)
 */

export interface AdsManagerConfig {
  rewardedAdUnitId?: string;
  interstitialAdUnitId?: string;
  enableAds: boolean;
}

export class AdsManager {
  private rewardedAdUnitId: string | undefined;
  private interstitialAdUnitId: string | undefined;
  private enableAds: boolean;
  private isRewardedAdReady: boolean = false;
  private isInterstitialAdReady: boolean = false;
  private onRewardEarned: ((reward: number) => void) | null = null;

  constructor(config: AdsManagerConfig) {
    this.rewardedAdUnitId = config.rewardedAdUnitId;
    this.interstitialAdUnitId = config.interstitialAdUnitId;
    this.enableAds = config.enableAds;

    if (this.enableAds) {
      this.initializeAds();
    }
  }

  /**
   * Initialize ads
   */
  private initializeAds(): void {
    // In production, this would initialize AdMob or Expo Ads
    // For now, we'll simulate ads being ready
    console.log("[AdsManager] Initializing ads...");
    
    // Simulate ads loading
    setTimeout(() => {
      this.isRewardedAdReady = true;
      this.isInterstitialAdReady = true;
      console.log("[AdsManager] Ads ready");
    }, 1000);
  }

  /**
   * Register callback for when reward is earned
   */
  public onReward(callback: (reward: number) => void): void {
    this.onRewardEarned = callback;
  }

  /**
   * Show rewarded ad (extra life / revive)
   */
  public async showRewardedAd(): Promise<boolean> {
    if (!this.enableAds || !this.isRewardedAdReady) {
      console.log("[AdsManager] Rewarded ad not ready");
      return false;
    }

    try {
      console.log("[AdsManager] Showing rewarded ad...");
      
      // Simulate ad display and reward
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log("[AdsManager] User watched rewarded ad - earning reward");
          if (this.onRewardEarned) {
            this.onRewardEarned(1); // 1 extra life
          }
          this.isRewardedAdReady = false;
          
          // Reload ad for next time
          setTimeout(() => {
            this.isRewardedAdReady = true;
          }, 2000);
          
          resolve(true);
        }, 3000); // Simulate 3 second ad
      });
    } catch (error) {
      console.error("[AdsManager] Error showing rewarded ad:", error);
      return false;
    }
  }

  /**
   * Show interstitial ad (after game over)
   */
  public async showInterstitialAd(): Promise<boolean> {
    if (!this.enableAds || !this.isInterstitialAdReady) {
      console.log("[AdsManager] Interstitial ad not ready");
      return false;
    }

    try {
      console.log("[AdsManager] Showing interstitial ad...");
      
      // Simulate ad display
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log("[AdsManager] Interstitial ad closed");
          this.isInterstitialAdReady = false;
          
          // Reload ad for next time
          setTimeout(() => {
            this.isInterstitialAdReady = true;
          }, 5000);
          
          resolve(true);
        }, 2000); // Simulate 2 second ad
      });
    } catch (error) {
      console.error("[AdsManager] Error showing interstitial ad:", error);
      return false;
    }
  }

  /**
   * Check if rewarded ad is ready
   */
  public isRewardedAdAvailable(): boolean {
    return this.enableAds && this.isRewardedAdReady;
  }

  /**
   * Check if interstitial ad is ready
   */
  public isInterstitialAdAvailable(): boolean {
    return this.enableAds && this.isInterstitialAdReady;
  }

  /**
   * Cleanup
   */
  public cleanup(): void {
    console.log("[AdsManager] Cleaning up ads");
    this.onRewardEarned = null;
  }
}
