/**
 * Animation & Effects System
 * Handles screen shake, slow-motion, and visual feedback
 */

export interface ScreenShakeConfig {
  intensity: number; // 0-10
  duration: number; // milliseconds
  frequency: number; // Hz
}

export class AnimationEffects {
  private screenShakeIntensity = 0;
  private screenShakeDuration = 0;
  private screenShakeFrequency = 0;
  private screenShakeTimer = 0;
  private screenShakeOffset = { x: 0, y: 0 };

  private slowMotionFactor = 1;
  private slowMotionDuration = 0;
  private slowMotionTimer = 0;

  /**
   * Trigger screen shake effect
   */
  triggerScreenShake(config: ScreenShakeConfig): void {
    this.screenShakeIntensity = config.intensity;
    this.screenShakeDuration = config.duration;
    this.screenShakeFrequency = config.frequency;
    this.screenShakeTimer = 0;
  }

  /**
   * Trigger slow-motion effect
   */
  triggerSlowMotion(factor: number, duration: number): void {
    this.slowMotionFactor = factor;
    this.slowMotionDuration = duration;
    this.slowMotionTimer = 0;
  }

  /**
   * Update effects (call every frame)
   */
  update(deltaTime: number): void {
    // Update screen shake
    if (this.screenShakeTimer < this.screenShakeDuration) {
      this.screenShakeTimer += deltaTime;

      // Calculate shake offset using sine wave
      const progress = this.screenShakeTimer / this.screenShakeDuration;
      const angle = this.screenShakeTimer * this.screenShakeFrequency * Math.PI;

      const intensity = this.screenShakeIntensity * (1 - progress); // Fade out
      this.screenShakeOffset.x = Math.sin(angle) * intensity;
      this.screenShakeOffset.y = Math.cos(angle) * intensity;
    } else {
      this.screenShakeOffset.x = 0;
      this.screenShakeOffset.y = 0;
    }

    // Update slow-motion
    if (this.slowMotionTimer < this.slowMotionDuration) {
      this.slowMotionTimer += deltaTime;
    } else {
      this.slowMotionFactor = 1;
    }
  }

  /**
   * Get current screen shake offset
   */
  getScreenShakeOffset(): { x: number; y: number } {
    return { ...this.screenShakeOffset };
  }

  /**
   * Get current slow-motion factor
   */
  getSlowMotionFactor(): number {
    return this.slowMotionFactor;
  }

  /**
   * Check if screen shake is active
   */
  isScreenShaking(): boolean {
    return this.screenShakeTimer < this.screenShakeDuration;
  }

  /**
   * Check if slow-motion is active
   */
  isSlowMotionActive(): boolean {
    return this.slowMotionTimer < this.slowMotionDuration;
  }

  /**
   * Reset all effects
   */
  reset(): void {
    this.screenShakeIntensity = 0;
    this.screenShakeDuration = 0;
    this.screenShakeTimer = 0;
    this.screenShakeOffset = { x: 0, y: 0 };
    this.slowMotionFactor = 1;
    this.slowMotionDuration = 0;
    this.slowMotionTimer = 0;
  }
}

/**
 * Predefined effect presets
 */
export const EFFECT_PRESETS = {
  // Collision effects
  COLLISION_LIGHT: {
    intensity: 3,
    duration: 100,
    frequency: 8,
  },
  COLLISION_MEDIUM: {
    intensity: 5,
    duration: 150,
    frequency: 10,
  },
  COLLISION_HEAVY: {
    intensity: 8,
    duration: 200,
    frequency: 12,
  },

  // Near-miss effects
  NEAR_MISS_LIGHT: {
    intensity: 2,
    duration: 80,
    frequency: 6,
  },
  NEAR_MISS_MEDIUM: {
    intensity: 3,
    duration: 100,
    frequency: 8,
  },

  // Power-up effects
  POWER_UP_ACTIVATE: {
    intensity: 4,
    duration: 120,
    frequency: 10,
  },
};

/**
 * Animation timing utilities
 */
export const ANIMATION_TIMING = {
  JUMP_DURATION: 400, // milliseconds
  SLIDE_DURATION: 300,
  COLLISION_FREEZE: 100, // brief freeze on collision
  POWER_UP_FLASH: 150, // flash duration
};

/**
 * Easing functions for smooth animations
 */
export const EASING = {
  // Ease out (decelerate)
  easeOut: (t: number): number => 1 - Math.pow(1 - t, 3),

  // Ease in (accelerate)
  easeIn: (t: number): number => t * t * t,

  // Ease in-out
  easeInOut: (t: number): number =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,

  // Linear
  linear: (t: number): number => t,

  // Bounce (for impact effects)
  bounce: (t: number): number => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  },
};
