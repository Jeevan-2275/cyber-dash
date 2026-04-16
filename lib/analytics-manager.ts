/**
 * Analytics Manager for Cyber Dash
 * Tracks user engagement, sessions, and gameplay metrics
 */

export interface AnalyticsEvent {
  name: string;
  params?: Record<string, string | number | boolean>;
  timestamp?: number;
}

export interface SessionData {
  sessionId: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  gameCount: number;
  totalScore: number;
  events: AnalyticsEvent[];
}

export class AnalyticsManager {
  private sessionId: string;
  private sessionStartTime: number;
  private gameCount: number = 0;
  private totalScore: number = 0;
  private events: AnalyticsEvent[] = [];
  private enableAnalytics: boolean;

  constructor(enableAnalytics: boolean = true) {
    this.enableAnalytics = enableAnalytics;
    this.sessionId = this.generateSessionId();
    this.sessionStartTime = Date.now();
    
    if (this.enableAnalytics) {
      console.log(`[Analytics] Session started: ${this.sessionId}`);
    }
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Track a custom event
   */
  public trackEvent(name: string, params?: Record<string, string | number | boolean>): void {
    if (!this.enableAnalytics) return;

    const event: AnalyticsEvent = {
      name,
      params,
      timestamp: Date.now(),
    };

    this.events.push(event);
    console.log(`[Analytics] Event: ${name}`, params);
  }

  /**
   * Track game start
   */
  public trackGameStart(): void {
    this.trackEvent("game_start", {
      game_number: this.gameCount + 1,
    });
  }

  /**
   * Track game over
   */
  public trackGameOver(score: number, highScore: number, combo: number): void {
    this.gameCount++;
    this.totalScore += score;

    this.trackEvent("game_over", {
      score,
      high_score: highScore,
      combo,
      game_number: this.gameCount,
    });
  }

  /**
   * Track ad shown
   */
  public trackAdShown(adType: "rewarded" | "interstitial"): void {
    this.trackEvent("ad_shown", {
      ad_type: adType,
    });
  }

  /**
   * Track ad clicked
   */
  public trackAdClicked(adType: "rewarded" | "interstitial"): void {
    this.trackEvent("ad_clicked", {
      ad_type: adType,
    });
  }

  /**
   * Track reward earned
   */
  public trackRewardEarned(rewardType: string, amount: number): void {
    this.trackEvent("reward_earned", {
      reward_type: rewardType,
      amount,
    });
  }

  /**
   * Track pause
   */
  public trackPause(): void {
    this.trackEvent("game_paused");
  }

  /**
   * Track resume
   */
  public trackResume(): void {
    this.trackEvent("game_resumed");
  }

  /**
   * Get session data
   */
  public getSessionData(): SessionData {
    return {
      sessionId: this.sessionId,
      startTime: this.sessionStartTime,
      endTime: Date.now(),
      duration: Date.now() - this.sessionStartTime,
      gameCount: this.gameCount,
      totalScore: this.totalScore,
      events: this.events,
    };
  }

  /**
   * End session and return data
   */
  public endSession(): SessionData {
    const sessionData = this.getSessionData();
    
    if (this.enableAnalytics) {
      console.log(`[Analytics] Session ended: ${this.sessionId}`);
      console.log(`[Analytics] Session duration: ${sessionData.duration}ms`);
      console.log(`[Analytics] Games played: ${sessionData.gameCount}`);
      console.log(`[Analytics] Total score: ${sessionData.totalScore}`);
      console.log(`[Analytics] Events tracked: ${sessionData.events.length}`);
    }

    return sessionData;
  }

  /**
   * Get retention metrics
   */
  public getRetentionMetrics(): {
    sessionDuration: number;
    gamesPerSession: number;
    averageScorePerGame: number;
  } {
    return {
      sessionDuration: Date.now() - this.sessionStartTime,
      gamesPerSession: this.gameCount,
      averageScorePerGame: this.gameCount > 0 ? this.totalScore / this.gameCount : 0,
    };
  }
}
