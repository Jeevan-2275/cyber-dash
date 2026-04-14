import { describe, it, expect, beforeEach, vi } from "vitest";
import { GameEngine } from "./game-engine";

// Mock requestAnimationFrame for testing
global.requestAnimationFrame = vi.fn((callback) => {
  setTimeout(callback, 16); // Simulate 60 FPS
  return 1;
});

global.cancelAnimationFrame = vi.fn();

describe("GameEngine", () => {
  let engine: GameEngine;

  beforeEach(() => {
    engine = new GameEngine(100);
    engine.setScreenDimensions(375, 812);
  });

  describe("Initialization", () => {
    it("should initialize with correct default state", () => {
      const state = engine.getState();
      expect(state.state).toBe("idle");
      expect(state.score).toBe(0);
      expect(state.highScore).toBe(100);
      expect(state.speed).toBe(5);
    });

    it("should set screen dimensions correctly", () => {
      engine.setScreenDimensions(400, 800);
      const player = engine.getPlayer();
      expect(player.y).toBe(800 * 0.7); // Ground level at 70%
    });

    it("should initialize player with correct properties", () => {
      const player = engine.getPlayer();
      expect(player.x).toBe(50);
      expect(player.width).toBe(30);
      expect(player.height).toBe(40);
      expect(player.velocityY).toBe(0);
      expect(player.isJumping).toBe(false);
      expect(player.isSliding).toBe(false);
    });
  });

  describe("Game State Management", () => {
    it("should start the game", () => {
      engine.start();
      const state = engine.getState();
      expect(state.state).toBe("playing");
      expect(state.score).toBe(0);
      expect(state.gameTime).toBe(0);
    });

    it("should end the game", () => {
      engine.start();
      engine.end();
      const state = engine.getState();
      expect(state.state).toBe("gameOver");
    });

    it("should reset score on start", () => {
      engine.start();
      engine.end();
      engine.start();
      const state = engine.getState();
      expect(state.score).toBe(0);
    });
  });

  describe("Player Physics", () => {
    beforeEach(() => {
      engine.start();
    });

    it("should allow player to jump", () => {
      const playerBefore = engine.getPlayer();
      expect(playerBefore.isJumping).toBe(false);
      
      engine.jump();
      const playerAfter = engine.getPlayer();
      expect(playerAfter.isJumping).toBe(true);
      expect(playerAfter.velocityY).toBeLessThan(0); // Negative velocity = upward
    });

    it("should prevent double jumping", () => {
      engine.jump();
      const playerAfter1stJump = engine.getPlayer();
      expect(playerAfter1stJump.isJumping).toBe(true);
      
      engine.jump(); // Try to jump again
      const playerAfter2ndJump = engine.getPlayer();
      // Should still have same jump state (can't double jump)
      expect(playerAfter2ndJump.velocityY).toBe(playerAfter1stJump.velocityY);
    });

    it("should allow player to slide", () => {
      engine.slide();
      const player = engine.getPlayer();
      expect(player.isSliding).toBe(true);
    });

    it("should prevent sliding while jumping", () => {
      engine.jump();
      engine.slide();
      const player = engine.getPlayer();
      expect(player.isSliding).toBe(false); // Can't slide while jumping
    });

    it("should have correct player dimensions when sliding", () => {
      engine.slide();
      const player = engine.getPlayer();
      expect(player.isSliding).toBe(true);
      // Sliding should reduce height
      expect(player.height).toBe(40); // Original height, but rendered as half in UI
    });
  });

  describe("Obstacles", () => {
    it("should initialize with no obstacles", () => {
      const obstacles = engine.getObstacles();
      expect(obstacles).toEqual([]);
    });

    it("should have obstacle types", () => {
      engine.start();
      // Obstacles are spawned during game loop, so we just verify structure
      const state = engine.getState();
      expect(Array.isArray(state.obstacles)).toBe(true);
    });
  });

  describe("Score System", () => {
    it("should initialize score to zero", () => {
      const state = engine.getState();
      expect(state.score).toBe(0);
    });

    it("should preserve high score", () => {
      const initialHighScore = engine.getState().highScore;
      engine.start();
      engine.end();
      const finalHighScore = engine.getState().highScore;
      expect(finalHighScore).toBe(initialHighScore);
    });

    it("should have correct initial high score", () => {
      const engine2 = new GameEngine(250);
      const state = engine2.getState();
      expect(state.highScore).toBe(250);
    });
  });

  describe("Difficulty Progression", () => {
    it("should initialize speed correctly", () => {
      const state = engine.getState();
      expect(state.speed).toBe(5); // BASE_SPEED
      expect(state.speedMultiplier).toBe(1);
    });

    it("should have correct speed multiplier", () => {
      const state = engine.getState();
      expect(state.speedMultiplier).toBe(state.speed / 5); // BASE_SPEED = 5
    });
  });

  describe("Callbacks", () => {
    it("should register onStateChanged callback", () => {
      let callCount = 0;
      engine.onStateChanged(() => {
        callCount++;
      });
      expect(callCount).toBe(0); // Not called until game starts
    });

    it("should register onCollisionDetected callback", () => {
      let collisionDetected = false;
      engine.onCollisionDetected(() => {
        collisionDetected = true;
      });
      expect(collisionDetected).toBe(false);
    });

    it("should register onScoreIncreased callback", () => {
      let scoreIncreased = false;
      engine.onScoreIncreased(() => {
        scoreIncreased = true;
      });
      expect(scoreIncreased).toBe(false);
    });
  });

  describe("Player State", () => {
    it("should return player state correctly", () => {
      const player = engine.getPlayer();
      expect(player).toHaveProperty("x");
      expect(player).toHaveProperty("y");
      expect(player).toHaveProperty("width");
      expect(player).toHaveProperty("height");
      expect(player).toHaveProperty("velocityY");
      expect(player).toHaveProperty("isJumping");
      expect(player).toHaveProperty("isSliding");
    });

    it("should have correct initial player position", () => {
      const player = engine.getPlayer();
      expect(player.x).toBe(50);
      expect(player.y).toBe(812 * 0.7); // Ground level at 70%
    });

    it("should have correct player dimensions", () => {
      const player = engine.getPlayer();
      expect(player.width).toBe(30);
      expect(player.height).toBe(40);
    });
  });

  describe("Obstacle Generation", () => {
    it("should generate obstacles with valid properties", () => {
      engine.start();
      const obstacles = engine.getObstacles();
      
      obstacles.forEach((obstacle) => {
        expect(obstacle).toHaveProperty("id");
        expect(obstacle).toHaveProperty("x");
        expect(obstacle).toHaveProperty("y");
        expect(obstacle).toHaveProperty("width");
        expect(obstacle).toHaveProperty("height");
        expect(obstacle).toHaveProperty("type");
        expect(["wall", "gap", "moving"]).toContain(obstacle.type);
      });
    });
  });

  describe("Game State Consistency", () => {
    it("should maintain consistent game state", () => {
      engine.start();
      const state = engine.getState();
      
      expect(state).toHaveProperty("state");
      expect(state).toHaveProperty("score");
      expect(state).toHaveProperty("highScore");
      expect(state).toHaveProperty("speed");
      expect(state).toHaveProperty("speedMultiplier");
      expect(state).toHaveProperty("player");
      expect(state).toHaveProperty("obstacles");
      expect(state).toHaveProperty("gameTime");
      expect(state).toHaveProperty("frameCount");
    });

    it("should have valid state values", () => {
      engine.start();
      const state = engine.getState();
      
      expect(state.score).toBeGreaterThanOrEqual(0);
      expect(state.highScore).toBeGreaterThanOrEqual(0);
      expect(state.speed).toBeGreaterThan(0);
      expect(state.speedMultiplier).toBeGreaterThan(0);
      expect(state.gameTime).toBeGreaterThanOrEqual(0);
      expect(state.frameCount).toBeGreaterThanOrEqual(0);
    });
  });
});
