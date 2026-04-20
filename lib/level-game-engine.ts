/**
 * Level Game Engine for Cyber Dash
 * Extends base GameEngine with level-specific rules and mechanics
 */

import { GameEngine, GameEngineState } from "./game-engine";
import { LevelDefinition, getLevelById } from "./level-system";
import { PowerUpManager, ShieldPowerUp, SlowMotionPowerUp, CoinMagnetPowerUp } from "./power-ups";

export interface LevelGameState extends GameEngineState {
  levelId: number;
  levelName: string;
  levelDuration: number;
  levelTimeRemaining: number;
  levelProgress: number; // 0-100
  coinsCollectedThisLevel: number;
  noCrashAchieved: boolean;
  powerUpsActive: string[];
  shieldActive: boolean;
}

export class LevelGameEngine {
  private baseEngine: GameEngine;
  private level: LevelDefinition;
  private powerUpManager: PowerUpManager;
  private shield: ShieldPowerUp;
  private slowMotion: SlowMotionPowerUp;
  private coinMagnet: CoinMagnetPowerUp;
  private levelStartTime: number = 0;
  private pausedTime: number = 0; // Time when game was paused
  private totalPausedDuration: number = 0; // Total time spent paused
  private coinsCollected: number = 0;
  private noCrashAchieved: boolean = true;
  private onLevelStateChangeCallback: ((state: LevelGameState) => void) | null = null;

  constructor(levelId: number) {
    this.level = getLevelById(levelId) || getLevelById(1)!;
    this.baseEngine = new GameEngine();
    this.powerUpManager = new PowerUpManager();
    this.shield = new ShieldPowerUp();
    this.slowMotion = new SlowMotionPowerUp();
    this.coinMagnet = new CoinMagnetPowerUp();

    this.setupPowerUpCallbacks();
  }

  /**
   * Setup power-up callbacks
   */
  private setupPowerUpCallbacks(): void {
    this.powerUpManager.onActivated((type) => {
      console.log(`[LevelEngine] Power-up activated: ${type}`);
      switch (type) {
        case "shield":
          this.shield.activate();
          break;
        case "slow-motion":
          this.slowMotion.activate();
          break;
        case "coin-magnet":
          this.coinMagnet.activate();
          break;
      }
    });

    this.powerUpManager.onExpired((type) => {
      console.log(`[LevelEngine] Power-up expired: ${type}`);
      switch (type) {
        case "shield":
          this.shield.deactivate();
          break;
        case "slow-motion":
          this.slowMotion.deactivate();
          break;
        case "coin-magnet":
          this.coinMagnet.deactivate();
          break;
      }
    });
  }

  /**
   * Register state change callback
   */
  public onLevelStateChange(callback: (state: LevelGameState) => void): void {
    this.onLevelStateChangeCallback = callback;
  }

  /**
   * Start level
   */
  public start(): void {
    this.levelStartTime = Date.now();
    this.coinsCollected = 0;
    this.noCrashAchieved = true;

    // Configure base engine for this level
    this.baseEngine.start();

    console.log(`[LevelEngine] Started level ${this.level.id}: ${this.level.name}`);
  }

  /**
   * Pause level
   */
  public pause(): void {
    this.pausedTime = Date.now();
    this.baseEngine.pause();
  }

  /**
   * Resume level
   */
  public resume(): void {
    if (this.pausedTime > 0) {
      // Add the pause duration to total paused time
      const pauseDuration = Date.now() - this.pausedTime;
      this.totalPausedDuration += pauseDuration;
      this.pausedTime = 0;
    }
    this.baseEngine.resumeGame();
  }

  /**
   * Handle jump
   */
  public jump(): void {
    this.baseEngine.jump();
  }

  /**
   * Handle slide
   */
  public slide(): void {
    this.baseEngine.slide();
  }

  /**
   * Handle collision
   */
  public handleCollision(): void {
    this.noCrashAchieved = false;

    // Check if shield is active
    if (this.shield.useShield()) {
      console.log("[LevelEngine] Shield blocked collision");
      return; // Shield blocked the collision
    }

    // No shield, end game
    console.log("[LevelEngine] Collision - game over");
  }

  /**
   * Collect coin
   */
  public collectCoin(): void {
    this.coinsCollected++;
    this.coinMagnet.addCoin();
  }

  /**
   * Spawn power-up
   */
  public spawnPowerUp(type: "shield" | "slow-motion" | "coin-magnet"): void {
    const powerUp = this.level.powerUps.find((p) => p.type === type);
    if (powerUp) {
      this.powerUpManager.activatePowerUp(type, powerUp.duration);
    }
  }

  /**
   * Check if level is complete
   */
  public isLevelComplete(): boolean {
    if (this.level.duration > 0) {
      // Time-based level (excluding paused time)
      const elapsed = Date.now() - this.levelStartTime - this.totalPausedDuration;
      return elapsed >= this.level.duration;
    }

    // Distance-based level (not implemented yet)
    return false;
  }

  /**
   * Get level progress (0-100)
   */
  public getLevelProgress(): number {
    if (this.level.duration > 0) {
      const elapsed = Date.now() - this.levelStartTime - this.totalPausedDuration;
      return Math.min(100, (elapsed / this.level.duration) * 100);
    }
    return 0;
  }

  /**
   * Get time remaining
   */
  public getTimeRemaining(): number {
    if (this.level.duration > 0) {
      const elapsed = Date.now() - this.levelStartTime - this.totalPausedDuration;
      return Math.max(0, this.level.duration - elapsed);
    }
    return 0;
  }

  /**
   * Get current game state
   */
  public getState(): LevelGameState {
    const baseState = this.baseEngine.getState();
    const timeRemaining = this.getTimeRemaining();

    return {
      ...baseState,
      levelId: this.level.id,
      levelName: this.level.name,
      levelDuration: this.level.duration,
      levelTimeRemaining: timeRemaining,
      levelProgress: this.getLevelProgress(),
      coinsCollectedThisLevel: this.coinsCollected,
      noCrashAchieved: this.noCrashAchieved,
      powerUpsActive: this.powerUpManager.getActivePowerUps(),
      shieldActive: this.shield.isActive(),
    };
  }

  /**
   * Calculate level rewards
   */
  public calculateRewards(): {
    baseCoins: number;
    noCrashBonus: number;
    highScoreBonus: number;
    totalCoins: number;
    stars: number;
  } {
    const baseCoins = this.level.baseCoins;
    const noCrashBonus = this.noCrashAchieved ? this.level.noCrashBonus : 0;

    // High score bonus based on score
    const score = this.baseEngine.getState().score;
    const highScoreBonus =
      score >= baseCoins ? this.level.highScoreBonus : 0;

    const totalCoins = baseCoins + noCrashBonus + highScoreBonus;

    // Calculate stars
    let stars = 0;
    if (score >= baseCoins * 2) stars = 3;
    else if (score >= baseCoins * 1.5) stars = 2;
    else if (score >= baseCoins) stars = 1;

    return {
      baseCoins,
      noCrashBonus,
      highScoreBonus,
      totalCoins,
      stars,
    };
  }

  /**
   * Get level info
   */
  public getLevel(): LevelDefinition {
    return this.level;
  }

  /**
   * Get active power-ups info
   */
  public getActivePowerUpsInfo(): Array<{
    type: string;
    name: string;
    remaining: number;
  }> {
    return this.powerUpManager.getActivePowerUps().map((type) => ({
      type,
      name: this.powerUpManager.getPowerUpInfo(type as any).name,
      remaining: this.powerUpManager.getRemainingTime(type as any),
    }));
  }

  /**
   * Get speed multiplier (considering slow motion)
   */
  public getSpeedMultiplier(): number {
    return this.slowMotion.getSpeedMultiplier();
  }

  /**
   * Cleanup
   */
  public cleanup(): void {
    this.powerUpManager.clearAll();
    this.shield.deactivate();
    this.slowMotion.deactivate();
    this.coinMagnet.deactivate();
  }
}
