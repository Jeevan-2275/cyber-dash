/**
 * Simplified Level Game Engine
 * Extends base GameEngine with level-specific rules
 */

import { GameEngine, GameEngineState } from "./game-engine";
import { SimpleLevel } from "./simple-levels";

export class SimpleLevelEngine {
  private gameEngine: GameEngine;
  private level: SimpleLevel;
  private levelStartTime: number = 0;
  private levelTimeRemaining: number = 0;
  private levelCompleted: boolean = false;

  constructor(level: SimpleLevel, highScore: number = 0) {
    this.level = level;
    this.gameEngine = new GameEngine(highScore);
    this.levelTimeRemaining = level.duration;
  }

  /**
   * Initialize the level
   */
  public initialize(screenWidth: number, screenHeight: number): void {
    this.gameEngine.setScreenDimensions(screenWidth, screenHeight);
    this.levelStartTime = Date.now();
    this.levelTimeRemaining = this.level.duration;
  }

  /**
   * Start the level
   */
  public start(): void {
    this.gameEngine.start();
  }

  /**
   * End the level
   */
  public end(): void {
    this.gameEngine.end();
  }

  /**
   * Pause the level
   */
  public pause(): void {
    this.gameEngine.pause();
  }

  /**
   * Resume the level
   */
  public resume(): void {
    this.gameEngine.resume();
  }

  /**
   * Handle player jump
   */
  public jump(): void {
    this.gameEngine.jump();
  }

  /**
   * Handle player slide
   */
  public slide(): void {
    this.gameEngine.slide();
  }

  /**
   * Update level state
   */
  public update(): GameEngineState {
    const state = this.gameEngine.getState();

    // Calculate time remaining
    const elapsedTime = Date.now() - this.levelStartTime;
    this.levelTimeRemaining = Math.max(0, this.level.duration - elapsedTime);

    // Check if level is completed (survived full duration)
    if (this.levelTimeRemaining <= 0 && state.state === "playing") {
      this.levelCompleted = true;
      this.gameEngine.end();
    }

    return state;
  }

  /**
   * Get game engine state
   */
  public getState(): GameEngineState {
    return this.gameEngine.getState();
  }

  /**
   * Get level time remaining (milliseconds)
   */
  public getTimeRemaining(): number {
    return this.levelTimeRemaining;
  }

  /**
   * Check if level is completed
   */
  public isLevelCompleted(): boolean {
    return this.levelCompleted && this.gameEngine.getState().state === "gameOver";
  }

  /**
   * Get level info
   */
  public getLevel(): SimpleLevel {
    return this.level;
  }

  /**
   * Get player state
   */
  public getPlayer() {
    return this.gameEngine.getPlayer();
  }

  /**
   * Get obstacles
   */
  public getObstacles() {
    return this.gameEngine.getObstacles();
  }

  /**
   * Register callbacks
   */
  public onStateChanged(callback: (state: GameEngineState) => void): void {
    this.gameEngine.onStateChanged(callback);
  }

  /**
   * Get animation effects
   */
  public getAnimationEffects() {
    return this.gameEngine.getAnimationEffects();
  }
}
