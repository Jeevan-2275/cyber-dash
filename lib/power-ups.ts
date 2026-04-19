/**
 * Power-ups System for Cyber Dash
 * Manages shield, slow motion, and coin magnet power-ups
 */

export type PowerUpType = "shield" | "slow-motion" | "coin-magnet";

export interface ActivePowerUp {
  type: PowerUpType;
  startTime: number;
  duration: number;
}

export class PowerUpManager {
  private activePowerUps: Map<PowerUpType, ActivePowerUp> = new Map();
  private onPowerUpActivated: ((type: PowerUpType) => void) | null = null;
  private onPowerUpExpired: ((type: PowerUpType) => void) | null = null;

  /**
   * Register callback for power-up activation
   */
  public onActivated(callback: (type: PowerUpType) => void): void {
    this.onPowerUpActivated = callback;
  }

  /**
   * Register callback for power-up expiration
   */
  public onExpired(callback: (type: PowerUpType) => void): void {
    this.onPowerUpExpired = callback;
  }

  /**
   * Activate a power-up
   */
  public activatePowerUp(type: PowerUpType, duration: number): void {
    const now = Date.now();
    this.activePowerUps.set(type, {
      type,
      startTime: now,
      duration,
    });

    console.log(`[PowerUp] Activated ${type} for ${duration}ms`);
    if (this.onPowerUpActivated) {
      this.onPowerUpActivated(type);
    }
  }

  /**
   * Check if power-up is active
   */
  public isActive(type: PowerUpType): boolean {
    const powerUp = this.activePowerUps.get(type);
    if (!powerUp) return false;

    const elapsed = Date.now() - powerUp.startTime;
    if (elapsed >= powerUp.duration) {
      this.activePowerUps.delete(type);
      if (this.onPowerUpExpired) {
        this.onPowerUpExpired(type);
      }
      return false;
    }

    return true;
  }

  /**
   * Get remaining time for power-up
   */
  public getRemainingTime(type: PowerUpType): number {
    const powerUp = this.activePowerUps.get(type);
    if (!powerUp) return 0;

    const elapsed = Date.now() - powerUp.startTime;
    const remaining = Math.max(0, powerUp.duration - elapsed);
    return remaining;
  }

  /**
   * Get all active power-ups
   */
  public getActivePowerUps(): PowerUpType[] {
    const active: PowerUpType[] = [];
    for (const type of this.activePowerUps.keys()) {
      if (this.isActive(type)) {
        active.push(type);
      }
    }
    return active;
  }

  /**
   * Clear all power-ups
   */
  public clearAll(): void {
    this.activePowerUps.clear();
  }

  /**
   * Get power-up info
   */
  public getPowerUpInfo(type: PowerUpType): {
    name: string;
    description: string;
    color: string;
    icon: string;
  } {
    switch (type) {
      case "shield":
        return {
          name: "Shield",
          description: "Blocks one collision",
          color: "#00FFFF",
          icon: "🛡️",
        };
      case "slow-motion":
        return {
          name: "Slow Motion",
          description: "Temporarily slows the game",
          color: "#FF00FF",
          icon: "⏱️",
        };
      case "coin-magnet":
        return {
          name: "Coin Magnet",
          description: "Auto-collect nearby coins",
          color: "#FFFF00",
          icon: "💰",
        };
    }
  }
}

/**
 * Shield power-up: Blocks one collision
 */
export class ShieldPowerUp {
  private active: boolean = false;
  private usedOnce: boolean = false;

  public activate(): void {
    this.active = true;
    this.usedOnce = false;
    console.log("[Shield] Activated");
  }

  public isActive(): boolean {
    return this.active && !this.usedOnce;
  }

  public useShield(): boolean {
    if (this.isActive()) {
      this.usedOnce = true;
      console.log("[Shield] Used - blocked collision");
      return true;
    }
    return false;
  }

  public deactivate(): void {
    this.active = false;
    this.usedOnce = false;
  }
}

/**
 * Slow Motion power-up: Temporarily slows the game
 */
export class SlowMotionPowerUp {
  private slowFactor: number = 0.5; // 50% of normal speed
  private active: boolean = false;

  public activate(): void {
    this.active = true;
    console.log("[SlowMotion] Activated - game speed reduced to 50%");
  }

  public isActive(): boolean {
    return this.active;
  }

  public getSpeedMultiplier(): number {
    return this.active ? this.slowFactor : 1.0;
  }

  public deactivate(): void {
    this.active = false;
    console.log("[SlowMotion] Deactivated - game speed restored");
  }
}

/**
 * Coin Magnet power-up: Auto-collects nearby coins
 */
export class CoinMagnetPowerUp {
  private active: boolean = false;
  private magnetRadius: number = 150; // pixels
  private coinsCollected: number = 0;

  public activate(): void {
    this.active = true;
    this.coinsCollected = 0;
    console.log("[CoinMagnet] Activated - collecting nearby coins");
  }

  public isActive(): boolean {
    return this.active;
  }

  public getMagnetRadius(): number {
    return this.active ? this.magnetRadius : 0;
  }

  public addCoin(): void {
    if (this.active) {
      this.coinsCollected++;
    }
  }

  public getCoinsCollected(): number {
    return this.coinsCollected;
  }

  public deactivate(): void {
    this.active = false;
    console.log(
      `[CoinMagnet] Deactivated - collected ${this.coinsCollected} coins`
    );
  }
}
