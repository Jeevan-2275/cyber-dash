/**
 * Cyber Dash Game Engine
 * Core game loop, physics, obstacles, and collision detection
 */

import { AnimationEffects, EFFECT_PRESETS } from "./animation-effects";
import { PowerUpSystem, PowerUpType } from "./power-up-system";
import { CoinSystem } from "./coin-system";
import { getScreenMetrics, getPlayerSize, getObstacleSize, scaleValue } from "./responsive-layout";

export type GameState = "idle" | "playing" | "gameOver";

export interface PlayerState {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityY: number;
  isJumping: boolean;
  isSliding: boolean;
  slidingDuration: number;
}

export interface Obstacle {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: "wall" | "gap" | "moving";
  speed?: number; // for moving obstacles
}

export interface GameEngineState {
  state: GameState;
  score: number;
  highScore: number;
  speed: number;
  speedMultiplier: number;
  player: PlayerState;
  obstacles: Obstacle[];
  gameTime: number;
  frameCount: number;
  combo: number;
  coinsCollected: number;
  totalCoins: number;
  isPaused: boolean;
  countdownTime: number;
}

export class GameEngine {
  private state: GameEngineState;
  private gameLoopId: number | null = null;
  private lastFrameTime: number = 0;
  private deltaTime: number = 0;
  private animationEffects: AnimationEffects = new AnimationEffects();
  private powerUpSystem: PowerUpSystem = new PowerUpSystem();
  private coinSystem: CoinSystem = new CoinSystem();
  private lastCoinSpawnTime: number = 0;
  private coinSpawnInterval: number = 2500; // ms between coin spawns

  // Game constants
  private readonly GRAVITY = 0.6;
  private readonly JUMP_STRENGTH = -12;
  private readonly SLIDE_DURATION = 300; // ms
  private readonly BASE_SPEED = 5;
  private readonly MAX_SPEED = 12;
  private readonly SPEED_INCREMENT = 0.02;
  private readonly OBSTACLE_SPAWN_INTERVAL = 1500; // ms
  private readonly GROUND_LEVEL = 0.7; // 70% from top

  // Screen dimensions (will be set dynamically)
  private screenWidth: number = 375;
  private screenHeight: number = 812;
  private screenMetrics = getScreenMetrics();
  private playerSize = getPlayerSize(this.screenMetrics);
  private obstacleSize = getObstacleSize(this.screenMetrics, "wall");

  // Callbacks
  private onStateChange: ((state: GameEngineState) => void) | null = null;
  private onCollision: (() => void) | null = null;
  private onScoreIncrease: ((score: number) => void) | null = null;

  constructor(highScore: number = 0, totalCoins: number = 0) {
    this.powerUpSystem = new PowerUpSystem();
    this.coinSystem = new CoinSystem();
    this.state = {
      state: "idle",
      score: 0,
      highScore,
      speed: this.BASE_SPEED,
      speedMultiplier: 1,
      player: {
        x: scaleValue(50, this.screenMetrics),
        y: this.screenHeight * this.GROUND_LEVEL,
        width: this.playerSize.width,
        height: this.playerSize.height,
        velocityY: 0,
        isJumping: false,
        isSliding: false,
        slidingDuration: 0,
      },
      obstacles: [],
      gameTime: 0,
      frameCount: 0,
      combo: 0,
      coinsCollected: 0,
      totalCoins,
      isPaused: false,
      countdownTime: 3000,
    };
    this.lastCoinSpawnTime = Date.now();
  }

  /**
   * Set screen dimensions and recalculate responsive sizes
   */
  public setScreenDimensions(width: number, height: number): void {
    this.screenWidth = width;
    this.screenHeight = height;
    // Recalculate responsive metrics
    this.screenMetrics = getScreenMetrics();
    this.playerSize = getPlayerSize(this.screenMetrics);
    this.obstacleSize = getObstacleSize(this.screenMetrics, "wall");
    // Update player size and position
    this.state.player.width = this.playerSize.width;
    this.state.player.height = this.playerSize.height;
    this.state.player.y = this.screenHeight * this.GROUND_LEVEL;
    this.state.player.x = scaleValue(50, this.screenMetrics);
  }

  /**
   * Register state change callback
   */
  public onStateChanged(callback: (state: GameEngineState) => void): void {
    this.onStateChange = callback;
  }

  /**
   * Register collision callback
   */
  public onCollisionDetected(callback: () => void): void {
    this.onCollision = callback;
  }

  /**
   * Register score increase callback
   */
  public onScoreIncreased(callback: (score: number) => void): void {
    this.onScoreIncrease = callback;
  }

  /**
   * Start the game with countdown
   */
  public start(): void {
    this.state.state = "playing";
    this.state.score = 0;
    this.state.speed = this.BASE_SPEED;
    this.state.speedMultiplier = 1;
    this.state.gameTime = 0;
    this.state.frameCount = 0;
    this.state.obstacles = [];
    this.state.combo = 0;
    this.state.coinsCollected = 0;
    this.state.isPaused = false;
    this.state.countdownTime = 3000; // 3 second countdown
    this.state.player.velocityY = 0;
    this.state.player.isJumping = false;
    this.state.player.isSliding = false;
    this.state.player.y = this.screenHeight * this.GROUND_LEVEL;

    this.lastFrameTime = Date.now();
    this.startGameLoop();
    this.emitStateChange();
  }

  /**
   * Pause the game
   */
  public pause(): void {
    if (this.state.state === "playing" && !this.state.isPaused) {
      this.state.isPaused = true;
      this.emitStateChange();
    }
  }

  /**
   * Resume the game
   */
  public resumeGame(): void {
    if (this.state.state === "playing" && this.state.isPaused) {
      this.state.isPaused = false;
      this.lastFrameTime = Date.now();
      this.emitStateChange();
    }
  }

  /**
   * Check if game is paused
   */
  public isPaused(): boolean {
    return this.state.isPaused;
  }

  /**
   * Stop the game loop (old pause method)
   */
  public stopGameLoop(): void {
    if (this.gameLoopId !== null) {
      cancelAnimationFrame(this.gameLoopId);
      this.gameLoopId = null;
    }
  }

  /**
   * Resume the game
   */
  public resume(): void {
    if (this.state.state === "playing") {
      this.lastFrameTime = Date.now();
      this.startGameLoop();
    }
  }

  /**
   * End the game
   */
  public end(): void {
    this.state.state = "gameOver";
    if (this.gameLoopId !== null) {
      cancelAnimationFrame(this.gameLoopId);
      this.gameLoopId = null;
    }
    if (this.state.score > this.state.highScore) {
      this.state.highScore = this.state.score;
    }
    this.emitStateChange();
  }

  /**
   * Handle player jump
   */
  public jump(): void {
    if (this.state.state !== "playing") return;
    if (this.state.player.isJumping || this.state.player.isSliding) return;

    this.state.player.isJumping = true;
    this.state.player.velocityY = this.JUMP_STRENGTH;
  }

  /**
   * Handle player slide
   */
  public slide(): void {
    if (this.state.state !== "playing") return;
    if (this.state.player.isSliding || this.state.player.isJumping) return;

    this.state.player.isSliding = true;
    this.state.player.slidingDuration = this.SLIDE_DURATION;
  }

  /**
   * Get current game state
   */
  public getState(): GameEngineState {
    return { ...this.state };
  }

  /**
   * Get player state
   */
  public getPlayer(): PlayerState {
    return { ...this.state.player };
  }

  /**
   * Get obstacles
   */
  public getObstacles(): Obstacle[] {
    return [...this.state.obstacles];
  }

  /**
   * Get animation effects
   */
  public getAnimationEffects(): AnimationEffects {
    return this.animationEffects;
  }

  /**
   * Private: Start the game loop
   */
  private startGameLoop(): void {
    const loop = () => {
      const now = Date.now();
      this.deltaTime = Math.min((now - this.lastFrameTime) / 1000, 0.016); // Cap at 60 FPS
      this.lastFrameTime = now;

      if (this.state.state === "playing") {
        this.update(this.deltaTime);
        this.emitStateChange();
      }

      // Only schedule next frame if game is still running
      if (this.state.state !== "gameOver") {
        this.gameLoopId = requestAnimationFrame(loop);
      } else {
        this.gameLoopId = null;
      }
    };

    this.gameLoopId = requestAnimationFrame(loop);
  }

  /**
   * Private: Update game state
   */
  private update(deltaTime: number): void {
    // Skip update if paused
    if (this.state.isPaused) {
      return;
    }

    // Handle countdown
    if (this.state.countdownTime > 0) {
      this.state.countdownTime -= deltaTime * 1000;
      if (this.state.countdownTime <= 0) {
        this.state.countdownTime = 0;
      }
      return; // Don't update game logic during countdown
    }

    // Update game time
    this.state.gameTime += deltaTime * 1000;
    this.state.frameCount++;

    // Update speed and difficulty
    this.updateDifficulty();

    // Update player
    this.updatePlayer(deltaTime);

    // Update obstacles
    this.updateObstacles(deltaTime);

    // Spawn new obstacles
    this.spawnObstacles();

    // Check collisions
    this.checkCollisions();

    // Update score
    this.updateScore();

    // Update animation effects
    this.animationEffects.update(deltaTime * 1000);

    // Update power-ups
    this.powerUpSystem.update(deltaTime * 1000);

    // Spawn coins
    this.spawnCoins();

    // Update coins
    this.coinSystem.removeOffScreenCoins(this.screenWidth);

    // Check coin collisions
    this.checkCoinCollisions();

    // Check power-up collisions
    this.checkPowerUpCollisions();
  }

  /**
   * Private: Update difficulty (speed increases over time)
   */
  private updateDifficulty(): void {
    const baseSpeed = this.BASE_SPEED + (this.state.score / 1000) * this.SPEED_INCREMENT;
    this.state.speed = Math.min(baseSpeed, this.MAX_SPEED);
    this.state.speedMultiplier = this.state.speed / this.BASE_SPEED;
  }

  /**
   * Private: Update player physics
   */
  private updatePlayer(deltaTime: number): void {
    const player = this.state.player;
    const groundLevel = this.screenHeight * this.GROUND_LEVEL;

    // Apply gravity
    if (player.isJumping) {
      player.velocityY += this.GRAVITY;

      // Check if player has landed
      if (player.velocityY > 0 && player.y >= groundLevel) {
        player.y = groundLevel;
        player.velocityY = 0;
        player.isJumping = false;
      }
    }

    // Update player Y position
    player.y += player.velocityY;

    // Clamp player to ground
    if (player.y > groundLevel) {
      player.y = groundLevel;
      player.velocityY = 0;
      player.isJumping = false;
    }

    // Update sliding
    if (player.isSliding) {
      player.slidingDuration -= deltaTime * 1000;
      if (player.slidingDuration <= 0) {
        player.isSliding = false;
        player.slidingDuration = 0;
      }
    }
  }

  /**
   * Private: Update obstacles
   */
  private updateObstacles(deltaTime: number): void {
    this.state.obstacles = this.state.obstacles
      .map((obstacle) => {
        const updatedObstacle = { ...obstacle };

        // Move obstacle left (scrolling effect)
        updatedObstacle.x -= this.state.speed;

        // Update moving obstacles
        if (obstacle.type === "moving" && obstacle.speed !== undefined) {
          updatedObstacle.y += obstacle.speed * deltaTime;

          // Bounce moving obstacles
          if (updatedObstacle.y <= 0 || updatedObstacle.y + updatedObstacle.height >= this.screenHeight * 0.6) {
            updatedObstacle.speed = -(obstacle.speed || 2);
          }
        }

        return updatedObstacle;
      })
      .filter((obstacle) => obstacle.x + obstacle.width > 0); // Remove off-screen obstacles
  }

  /**
   * Private: Spawn obstacles
   */
  private spawnObstacles(): void {
    const lastObstacle = this.state.obstacles[this.state.obstacles.length - 1];
    const shouldSpawn =
      this.state.obstacles.length === 0 ||
      lastObstacle.x < this.screenWidth - this.OBSTACLE_SPAWN_INTERVAL / this.state.speed;

    if (shouldSpawn) {
      const newObstacle = this.generateObstacle();
      this.state.obstacles.push(newObstacle);
    }
  }

  /**
   * Private: Generate a random obstacle
   */
  private generateObstacle(): Obstacle {
    const types: Array<"wall" | "gap" | "moving"> = ["wall", "gap", "moving"];
    const type = types[Math.floor(Math.random() * types.length)];

    const groundLevel = this.screenHeight * this.GROUND_LEVEL;
    const obstacleWidth = 40;
    const obstacleHeight = 50;

    let obstacle: Obstacle;

    switch (type) {
      case "wall":
        obstacle = {
          id: `obstacle-${Date.now()}-${Math.random()}`,
          x: this.screenWidth,
          y: groundLevel - obstacleHeight,
          width: obstacleWidth,
          height: obstacleHeight,
          type: "wall",
        };
        break;

      case "gap":
        obstacle = {
          id: `obstacle-${Date.now()}-${Math.random()}`,
          x: this.screenWidth,
          y: groundLevel,
          width: obstacleWidth * 1.5,
          height: 10, // Thin gap
          type: "gap",
        };
        break;

      case "moving":
        obstacle = {
          id: `obstacle-${Date.now()}-${Math.random()}`,
          x: this.screenWidth,
          y: groundLevel * 0.5,
          width: obstacleWidth,
          height: obstacleHeight,
          type: "moving",
          speed: 2,
        };
        break;

      default:
        obstacle = {
          id: `obstacle-${Date.now()}-${Math.random()}`,
          x: this.screenWidth,
          y: groundLevel - obstacleHeight,
          width: obstacleWidth,
          height: obstacleHeight,
          type: "wall",
        };
    }

    return obstacle;
  }

  /**
   * Private: Check collisions
   */
  private checkCollisions(): void {
    const player = this.state.player;
    const groundLevel = this.screenHeight * this.GROUND_LEVEL;

    // Check collision with each obstacle
    for (const obstacle of this.state.obstacles) {
      if (this.isColliding(player, obstacle)) {
        // If sliding, check if we can pass under the obstacle
        if (player.isSliding && obstacle.type === "wall") {
          // Sliding allows passing under walls
          continue;
        }

        // Collision detected
        this.animationEffects.triggerScreenShake(EFFECT_PRESETS.COLLISION_MEDIUM);
        this.end();
        if (this.onCollision) {
          this.onCollision();
        }
        return;
      }
    }

    // Check if player falls off the ground (gap collision)
    if (player.y > groundLevel + 50) {
      this.end();
      if (this.onCollision) {
        this.onCollision();
      }
    }
  }

  /**
   * Private: Check if two rectangles collide
   */
  private isColliding(rect1: PlayerState, rect2: Obstacle): boolean {
    // Adjust player collision box if sliding
    let playerHeight = rect1.height;
    let playerY = rect1.y;

    if (rect1.isSliding) {
      playerHeight = rect1.height * 0.5;
      playerY = rect1.y + rect1.height * 0.5;
    }

    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      playerY < rect2.y + rect2.height &&
      playerY + playerHeight > rect2.y
    );
  }

  /**
   * Private: Update score
   */
  private updateScore(): void {
    const previousScore = this.state.score;
    // Base score: 1 point per 100ms
    // Combo bonus: +1 point per combo level every 500ms
    const comboBonus = Math.floor((this.state.gameTime / 500) * this.state.combo);
    this.state.score = Math.floor(this.state.gameTime / 100) + comboBonus;

    // Increase combo every 5 seconds of survival
    const timeSinceLastCombo = this.state.gameTime % 5000;
    if (timeSinceLastCombo < 100) {
      this.state.combo = Math.floor(this.state.gameTime / 5000) + 1;
    }

    if (this.state.score > previousScore && this.state.score % 10 === 0) {
      if (this.onScoreIncrease) {
        this.onScoreIncrease(this.state.score);
      }
    }
  }

  /**
   * Private: Spawn coins
   */
  private spawnCoins(): void {
    const now = Date.now();
    if (now - this.lastCoinSpawnTime > this.coinSpawnInterval) {
      const randomX = Math.random() * (this.screenWidth - 40) + 20;
      const randomY = Math.random() * (this.screenHeight * 0.5) + 100;
      this.coinSystem.spawnCoin(randomX, randomY);
      this.lastCoinSpawnTime = now;
    }
  }

  /**
   * Private: Check coin collisions
   */
  private checkCoinCollisions(): void {
    const coins = this.coinSystem.getCoins();
    const player = this.state.player;

    for (const coin of coins) {
      if (
        player.x < coin.x + coin.width &&
        player.x + player.width > coin.x &&
        player.y < coin.y + coin.height &&
        player.y + player.height > coin.y
      ) {
        this.coinSystem.collectCoin(coin.id);
        this.state.coinsCollected++;
        this.state.totalCoins++;
      }
    }
  }

  /**
   * Private: Check power-up collisions
   */
  private checkPowerUpCollisions(): void {
    const powerUps = this.powerUpSystem.getPowerUps();
    const player = this.state.player;

    for (const powerUp of powerUps) {
      if (
        player.x < powerUp.x + powerUp.width &&
        player.x + player.width > powerUp.x &&
        player.y < powerUp.y + powerUp.height &&
        player.y + player.height > powerUp.y
      ) {
        this.powerUpSystem.collectPowerUp(powerUp.id);
      }
    }
  }

  /**
   * Get coins
   */
  public getCoins() {
    return this.coinSystem.getCoins();
  }

  /**
   * Get power-ups
   */
  public getPowerUps() {
    return this.powerUpSystem.getPowerUps();
  }

  /**
   * Get active power-ups
   */
  public getActivePowerUps() {
    return this.powerUpSystem.getActivePowerUps();
  }

  /**
   * Private: Emit state change
   */
  private emitStateChange(): void {
    if (this.onStateChange) {
      this.onStateChange(this.getState());
    }
  }
}
