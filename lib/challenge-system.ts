import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Challenge types available in Cyber Dash
 */
export type ChallengeType =
  | "survival"
  | "speedrun"
  | "collector"
  | "endurance";

/**
 * Challenge difficulty levels
 */
export type ChallengeDifficulty = "easy" | "normal" | "hard";

/**
 * Challenge definition with rules and objectives
 */
export interface Challenge {
  id: string;
  type: ChallengeType;
  name: string;
  description: string;
  objective: string;
  difficulty: ChallengeDifficulty;
  targetValue: number;
  targetUnit: string;
  rules: string[];
  reward: number; // Points awarded for completion
  createdAt: number; // Timestamp when challenge was created
}

/**
 * Challenge progress tracking
 */
export interface ChallengeProgress {
  challengeId: string;
  currentValue: number;
  isCompleted: boolean;
  completedAt?: number;
  score: number;
}

/**
 * Challenge leaderboard entry
 */
export interface ChallengeLeaderboardEntry {
  challengeId: string;
  playerName: string;
  score: number;
  completedAt: number;
  difficulty: ChallengeDifficulty;
}

/**
 * Challenge System Manager
 * Handles daily challenge rotation, progress tracking, and leaderboard management
 */
export class ChallengeSystem {
  private challenges: Challenge[] = [];
  private currentChallenge: Challenge | null = null;
  private progress: ChallengeProgress | null = null;
  private leaderboard: ChallengeLeaderboardEntry[] = [];

  constructor() {
    this.initializeChallenges();
  }

  /**
   * Initialize all available challenges
   */
  private initializeChallenges(): void {
    this.challenges = [
      {
        id: "survival-60",
        type: "survival",
        name: "Survival Mode",
        description: "Survive for 60 seconds without crashing",
        objective: "Stay alive for 60 seconds",
        difficulty: "normal",
        targetValue: 60,
        targetUnit: "seconds",
        rules: [
          "Avoid all obstacles",
          "Game speed increases normally",
          "Standard scoring applies",
        ],
        reward: 500,
        createdAt: Date.now(),
      },
      {
        id: "speedrun-100",
        type: "speedrun",
        name: "Speed Run",
        description: "Reach a speed multiplier of 2.0x",
        objective: "Achieve 2.0x speed multiplier",
        difficulty: "hard",
        targetValue: 2.0,
        targetUnit: "speed multiplier",
        rules: [
          "Game speed increases faster",
          "Obstacles spawn more frequently",
          "Collision ends the challenge",
        ],
        reward: 750,
        createdAt: Date.now(),
      },
      {
        id: "collector-10",
        type: "collector",
        name: "Collector",
        description: "Collect 10 power-ups during gameplay",
        objective: "Collect 10 power-ups",
        difficulty: "normal",
        targetValue: 10,
        targetUnit: "power-ups",
        rules: [
          "Power-ups spawn randomly",
          "Collect them to increase counter",
          "Standard game rules apply",
        ],
        reward: 600,
        createdAt: Date.now(),
      },
      {
        id: "endurance-300",
        type: "endurance",
        name: "Endurance Challenge",
        description: "Survive as long as possible with increased difficulty",
        objective: "Achieve highest score possible",
        difficulty: "hard",
        targetValue: 300,
        targetUnit: "seconds",
        rules: [
          "Obstacles spawn very frequently",
          "Speed increases rapidly",
          "No mercy mode - one hit and you're out",
        ],
        reward: 1000,
        createdAt: Date.now(),
      },
      {
        id: "survival-120",
        type: "survival",
        name: "Extended Survival",
        description: "Survive for 120 seconds",
        objective: "Stay alive for 120 seconds",
        difficulty: "hard",
        targetValue: 120,
        targetUnit: "seconds",
        rules: [
          "Avoid all obstacles",
          "Game speed increases progressively",
          "Double reward for completion",
        ],
        reward: 1000,
        createdAt: Date.now(),
      },
      {
        id: "speedrun-150",
        type: "speedrun",
        name: "Turbo Mode",
        description: "Reach a speed multiplier of 3.0x",
        objective: "Achieve 3.0x speed multiplier",
        difficulty: "hard",
        targetValue: 3.0,
        targetUnit: "speed multiplier",
        rules: [
          "Extreme speed increase",
          "Obstacles spawn constantly",
          "Ultra-fast reflexes required",
        ],
        reward: 1500,
        createdAt: Date.now(),
      },
    ];
  }

  /**
   * Get today's daily challenge based on date rotation
   */
  async getTodayChallenge(): Promise<Challenge> {
    const today = new Date().toDateString();
    const cachedChallenge = await AsyncStorage.getItem(
      `challenge_today_${today}`
    );

    if (cachedChallenge) {
      this.currentChallenge = JSON.parse(cachedChallenge);
      return this.currentChallenge!;
    }

    // Select challenge based on day of year (ensures daily rotation)
    const dayOfYear = this.getDayOfYear();
    const challengeIndex = dayOfYear % this.challenges.length;
    this.currentChallenge = this.challenges[challengeIndex];

    // Cache today's challenge
    await AsyncStorage.setItem(
      `challenge_today_${today}`,
      JSON.stringify(this.currentChallenge)
    );

    return this.currentChallenge;
  }

  /**
   * Get day of year (1-365) for challenge rotation
   */
  private getDayOfYear(): number {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }

  /**
   * Start a challenge with initial progress
   */
  startChallenge(challenge: Challenge): ChallengeProgress {
    this.progress = {
      challengeId: challenge.id,
      currentValue: 0,
      isCompleted: false,
      score: 0,
    };
    return this.progress;
  }

  /**
   * Update challenge progress
   */
  updateProgress(value: number): ChallengeProgress {
    if (!this.progress || !this.currentChallenge) {
      throw new Error("No active challenge");
    }

    this.progress.currentValue = value;
    this.progress.score = Math.floor(value);

    // Check if challenge is completed
    if (this.progress.currentValue >= this.currentChallenge.targetValue) {
      this.progress.isCompleted = true;
      this.progress.completedAt = Date.now();
      this.progress.score = this.currentChallenge.reward;
    }

    return this.progress;
  }

  /**
   * Complete challenge and save to leaderboard
   */
  async completeChallenge(playerName: string = "Player"): Promise<number> {
    if (!this.progress || !this.currentChallenge) {
      throw new Error("No active challenge");
    }

    if (!this.progress.isCompleted) {
      throw new Error("Challenge not completed");
    }

    // Add to leaderboard
    const entry: ChallengeLeaderboardEntry = {
      challengeId: this.currentChallenge.id,
      playerName,
      score: this.progress.score,
      completedAt: Date.now(),
      difficulty: this.currentChallenge.difficulty,
    };

    this.leaderboard.push(entry);
    this.leaderboard.sort((a, b) => b.score - a.score);

    // Save to storage
    const today = new Date().toDateString();
    await AsyncStorage.setItem(
      `leaderboard_${this.currentChallenge.id}_${today}`,
      JSON.stringify(this.leaderboard)
    );

    return this.progress.score;
  }

  /**
   * Get leaderboard for current challenge
   */
  async getLeaderboard(limit: number = 10): Promise<ChallengeLeaderboardEntry[]> {
    if (!this.currentChallenge) {
      throw new Error("No active challenge");
    }

    const today = new Date().toDateString();
    const cached = await AsyncStorage.getItem(
      `leaderboard_${this.currentChallenge.id}_${today}`
    );

    if (cached) {
      this.leaderboard = JSON.parse(cached);
    }

    return this.leaderboard.slice(0, limit);
  }

  /**
   * Get current challenge
   */
  getCurrentChallenge(): Challenge | null {
    return this.currentChallenge;
  }

  /**
   * Get current progress
   */
  getProgress(): ChallengeProgress | null {
    return this.progress;
  }

  /**
   * Get all challenges
   */
  getAllChallenges(): Challenge[] {
    return this.challenges;
  }

  /**
   * Get challenges by type
   */
  getChallengesByType(type: ChallengeType): Challenge[] {
    return this.challenges.filter((c) => c.type === type);
  }

  /**
   * Get challenges by difficulty
   */
  getChallengesByDifficulty(difficulty: ChallengeDifficulty): Challenge[] {
    return this.challenges.filter((c) => c.difficulty === difficulty);
  }

  /**
   * Reset progress for a new attempt
   */
  resetProgress(): void {
    this.progress = null;
  }

  /**
   * Check if challenge is completed
   */
  isChallengeCompleted(): boolean {
    return this.progress?.isCompleted ?? false;
  }

  /**
   * Get progress percentage
   */
  getProgressPercentage(): number {
    if (!this.progress || !this.currentChallenge) {
      return 0;
    }

    return Math.min(
      100,
      (this.progress.currentValue / this.currentChallenge.targetValue) * 100
    );
  }

  /**
   * Get time remaining for daily challenge (in milliseconds)
   */
  getTimeRemainingForDaily(): number {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    return tomorrow.getTime() - now.getTime();
  }

  /**
   * Get formatted time remaining (HH:MM:SS)
   */
  getFormattedTimeRemaining(): string {
    const ms = this.getTimeRemainingForDaily();
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
}

// Export singleton instance
export const challengeSystem = new ChallengeSystem();
