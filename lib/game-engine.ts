/**
 * Cyber Dash Game Engine
 * Core game loop, physics, obstacles, and collision detection
 */

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
}

export class GameEngine {
  private state: GameEngineState;
  private gameLoopId: number | null = null;
  private lastFrameTime: number = 0;
  private deltaTime: number = 0;

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

  // Callbacks
  private onStateChange: ((state: GameEngineState) => void) | null = null;
  private onCollision: (() => void) | null = null;
  private onScoreIncrease: ((score: number) => void) | null = null;

  constructor(highScore: number = 0) {
    this.state = {
      state: "idle",
      score: 0,
      highScore,
      speed: this.BASE_SPEED,
      speedMultiplier: 1,
      player: {
        x: 50,
        y: this.screenHeight * this.GROUND_LEVEL,
        width: 30,
        height: 40,
        velocityY: 0,
        isJumping: false,
        isSliding: false,
        slidingDuration: 0,
      },
      obstacles: [],
      gameTime: 0,
      frameCount: 0,
    };
  }

  /**
   * Set screen dimensions
   */
  public setScreenDimensions(width: number, height: number): void {
    this.screenWidth = width;
    this.screenHeight = height;
    // Update ground level based on screen height
    this.state.player.y = this.screenHeight * this.GROUND_LEVEL;
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
   * Start the game
   */
  public start(): void {
    this.state.state = "playing";
    this.state.score = 0;
    this.state.speed = this.BASE_SPEED;
    this.state.speedMultiplier = 1;
    this.state.gameTime = 0;
    this.state.frameCount = 0;
    this.state.obstacles = [];
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

      this.gameLoopId = requestAnimationFrame(loop);
    };

    this.gameLoopId = requestAnimationFrame(loop);
  }

  /**
   * Private: Update game state
   */
  private update(deltaTime: number): void {
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
    this.state.score = Math.floor(this.state.gameTime / 100); // 1 point per 100ms

    if (this.state.score > previousScore && this.state.score % 10 === 0) {
      if (this.onScoreIncrease) {
        this.onScoreIncrease(this.state.score);
      }
    }
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
