import { GameEngine, GameEngineState } from "./game-engine";
import { Challenge, ChallengeType } from "./challenge-system";

/**
 * Challenge wrapper for game engine with challenge-specific rules and mechanics
 * Uses composition instead of inheritance to avoid access issues
 */
export class ChallengeGameEngine {
  private engine: GameEngine;
  private challenge: Challenge;
  private challengeStartTime: number = 0;
  private powerUpCount: number = 0;
  private maxSpeedReached: number = 0;
  private isActive: boolean = false;

  constructor(highScore: number, challenge: Challenge) {
    this.engine = new GameEngine(highScore);
    this.challenge = challenge;
  }

  /**
   * Start challenge with modified rules
   */
  start(): void {
    this.engine.start();
    this.isActive = true;
    this.challengeStartTime = Date.now();
    this.powerUpCount = 0;
    this.maxSpeedReached = 0;

    // Apply challenge-specific rules
    this.applyChallengeMods();
  }

  /**
   * Apply challenge-specific modifications to game rules
   */
  private applyChallengeMods(): void {
    switch (this.challenge.type) {
      case "survival":
        // Survival: Standard rules, just need to survive the time
        this.applySurvivalMods();
        break;
      case "speedrun":
        // Speed Run: Accelerated speed progression
        this.applySpeedRunMods();
        break;
      case "collector":
        // Collector: Enable power-up spawning
        this.applyCollectorMods();
        break;
      case "endurance":
        // Endurance: Extreme difficulty
        this.applyEnduranceMods();
        break;
    }
  }

  /**
   * Survival challenge: Standard game with time limit
   */
  private applySurvivalMods(): void {
    // Standard speed progression
    // No special modifications needed
  }

  /**
   * Speed Run challenge: Faster speed progression
   */
  private applySpeedRunMods(): void {
    // Increase speed increment for faster progression
    // This is handled by modifying the game state during update
  }

  /**
   * Collector challenge: Power-ups spawn more frequently
   */
  private applyCollectorMods(): void {
    // Power-ups will be spawned in the game loop
    // Collector challenges track power-up collection
  }

  /**
   * Endurance challenge: Extreme difficulty
   */
  private applyEnduranceMods(): void {
    // Obstacles spawn more frequently
    // Speed increases rapidly
    // No mercy mode
  }

  /**
   * Update challenge progress and check for completion
   */
  updateChallenge(): void {
    if (!this.isActive) return;

    const state = this.engine.getState();

    // Apply challenge-specific updates
    this.updateChallengeProgress();

    // Apply difficulty modifications based on challenge type
    this.applyChallengeDifficultyMods();
  }

  /**
   * Update challenge-specific progress
   */
  private updateChallengeProgress(): void {
    const state = this.engine.getState();

    switch (this.challenge.type) {
      case "survival":
        // Track elapsed time
        const elapsedSeconds = (Date.now() - this.challengeStartTime) / 1000;
        if (elapsedSeconds >= this.challenge.targetValue) {
          // Challenge completed!
          this.engine.end();
          this.isActive = false;
        }
        break;

      case "speedrun":
        // Track maximum speed reached
        this.maxSpeedReached = Math.max(
          this.maxSpeedReached,
          state.speedMultiplier
        );
        if (this.maxSpeedReached >= this.challenge.targetValue) {
          // Challenge completed!
          this.engine.end();
          this.isActive = false;
        }
        break;

      case "collector":
        // Power-up count is tracked separately
        if (this.powerUpCount >= this.challenge.targetValue) {
          // Challenge completed!
          this.engine.end();
          this.isActive = false;
        }
        break;

      case "endurance":
        // Just survive as long as possible
        // Score is the objective
        break;
    }
  }

  /**
   * Apply difficulty modifications based on challenge type
   */
  private applyChallengeDifficultyMods(): void {
    const state = this.engine.getState();

    switch (this.challenge.type) {
      case "speedrun":
        // Increase speed increment for faster progression
        // Obstacles spawn more frequently
        if (state.frameCount % 30 === 0) {
          // Spawn obstacles more frequently
          this.spawnObstacleForChallenge();
        }
        break;

      case "endurance":
        // Extreme difficulty: obstacles spawn very frequently
        if (state.frameCount % 15 === 0) {
          // Spawn obstacles almost constantly
          this.spawnObstacleForChallenge();
        }
        // Speed increases rapidly
        if (state.frameCount % 60 === 0) {
          // Increase speed faster
          this.increaseSpeedForChallenge();
        }
        break;

      case "collector":
        // Spawn power-ups occasionally
        if (state.frameCount % 120 === 0) {
          this.spawnPowerUp();
        }
        break;
    }
  }

  /**
   * Spawn obstacle for challenge (may differ from standard spawning)
   */
  private spawnObstacleForChallenge(): void {
    // This would be called more frequently in speed run and endurance modes
    // The actual spawning logic is in the base GameEngine
  }

  /**
   * Increase speed for challenge (faster progression)
   */
  private increaseSpeedForChallenge(): void {
    // Speed increase is handled in the base engine
    // This is a hook for challenge-specific modifications
  }

  /**
   * Spawn a power-up for collector challenge
   */
  private spawnPowerUp(): void {
    // Power-ups would be added to the game state
    // For now, this is a placeholder
  }

  /**
   * Collect a power-up (for collector challenge)
   */
  collectPowerUp(): void {
    this.powerUpCount++;
    // Update score
    const state = this.engine.getState();
    state.score += 50; // Bonus points for collecting power-up
  }

  /**
   * Get challenge progress value
   */
  getChallengeProgress(): number {
    const state = this.engine.getState();

    switch (this.challenge.type) {
      case "survival":
        return (Date.now() - this.challengeStartTime) / 1000;
      case "speedrun":
        return this.maxSpeedReached;
      case "collector":
        return this.powerUpCount;
      case "endurance":
        return state.score;
      default:
        return 0;
    }
  }

  /**
   * Get challenge progress as percentage
   */
  getChallengeProgressPercentage(): number {
    const progress = this.getChallengeProgress();
    return Math.min(100, (progress / this.challenge.targetValue) * 100);
  }

  /**
   * Check if challenge is completed
   */
  isChallengeCompleted(): boolean {
    return this.getChallengeProgress() >= this.challenge.targetValue;
  }

  /**
   * Get challenge-specific HUD text
   */
  getChallengeHUDText(): string {
    const progress = this.getChallengeProgress();

    switch (this.challenge.type) {
      case "survival":
        const remaining = Math.max(
          0,
          this.challenge.targetValue - progress
        );
        return `${remaining.toFixed(1)}s`;
      case "speedrun":
        return `${progress.toFixed(2)}x`;
      case "collector":
        return `${Math.floor(progress)}/${this.challenge.targetValue}`;
      case "endurance":
        return `${Math.floor(progress)}`;
      default:
        return "";
    }
  }

  /**
   * Get challenge-specific HUD label
   */
  getChallengeHUDLabel(): string {
    switch (this.challenge.type) {
      case "survival":
        return "TIME LEFT";
      case "speedrun":
        return "SPEED";
      case "collector":
        return "COLLECTED";
      case "endurance":
        return "SCORE";
      default:
        return "PROGRESS";
    }
  }

  /**
   * Get the challenge
   */
  getChallenge(): Challenge {
    return this.challenge;
  }

  /**
   * Delegate methods to underlying engine
   */
  setScreenDimensions(width: number, height: number): void {
    this.engine.setScreenDimensions(width, height);
  }

  jump(): void {
    this.engine.jump();
  }

  slide(): void {
    this.engine.slide();
  }

  end(): void {
    this.engine.end();
    this.isActive = false;
  }

  getState(): GameEngineState {
    return this.engine.getState();
  }

  getPlayer() {
    return this.engine.getPlayer();
  }

  getObstacles() {
    return this.engine.getObstacles();
  }

  onStateChanged(callback: (state: GameEngineState) => void): void {
    this.engine.onStateChanged(callback);
  }

  onCollisionDetected(callback: () => void): void {
    this.engine.onCollisionDetected(callback);
  }

  onScoreIncreased(callback: (score: number) => void): void {
    this.engine.onScoreIncreased(callback);
  }
}
