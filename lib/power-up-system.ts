/**
 * Simple Power-Ups System
 * Shield, Coin Magnet, Slow Motion
 */

export type PowerUpType = "shield" | "coinMagnet" | "slowMotion";

export interface PowerUp {
  id: string;
  type: PowerUpType;
  x: number;
  y: number;
  width: number;
  height: number;
  duration: number; // milliseconds
  active: boolean;
  timeRemaining: number;
}

export interface ActivePowerUp {
  type: PowerUpType;
  timeRemaining: number;
}

export class PowerUpSystem {
  private powerUps: PowerUp[] = [];
  private activePowerUps: Map<PowerUpType, number> = new Map();
  private nextId = 0;

  /**
   * Spawn a power-up at position
   */
  public spawnPowerUp(type: PowerUpType, x: number, y: number): void {
    const duration = this.getPowerUpDuration(type);
    const powerUp: PowerUp = {
      id: `powerup-${this.nextId++}`,
      type,
      x,
      y,
      width: 20,
      height: 20,
      duration,
      active: true,
      timeRemaining: duration,
    };
    this.powerUps.push(powerUp);
  }

  /**
   * Get all active power-ups on screen
   */
  public getPowerUps(): PowerUp[] {
    return this.powerUps.filter((p) => p.active);
  }

  /**
   * Collect a power-up
   */
  public collectPowerUp(powerUpId: string): PowerUpType | null {
    const index = this.powerUps.findIndex((p) => p.id === powerUpId);
    if (index === -1) return null;

    const powerUp = this.powerUps[index];
    this.powerUps.splice(index, 1);

    // Activate power-up
    this.activatePowerUp(powerUp.type);
    return powerUp.type;
  }

  /**
   * Activate a power-up
   */
  private activatePowerUp(type: PowerUpType): void {
    const duration = this.getPowerUpDuration(type);
    this.activePowerUps.set(type, duration);
  }

  /**
   * Update power-ups (called each frame)
   */
  public update(deltaTime: number): void {
    // Update spawned power-ups
    this.powerUps = this.powerUps.filter((p) => {
      p.timeRemaining -= deltaTime;
      p.active = p.timeRemaining > 0;
      return p.active;
    });

    // Update active power-ups
    const toRemove: PowerUpType[] = [];
    this.activePowerUps.forEach((timeRemaining, type) => {
      const newTime = timeRemaining - deltaTime;
      if (newTime <= 0) {
        toRemove.push(type);
      } else {
        this.activePowerUps.set(type, newTime);
      }
    });

    toRemove.forEach((type) => this.activePowerUps.delete(type));
  }

  /**
   * Check if power-up is active
   */
  public isPowerUpActive(type: PowerUpType): boolean {
    return this.activePowerUps.has(type);
  }

  /**
   * Get active power-up time remaining
   */
  public getPowerUpTimeRemaining(type: PowerUpType): number {
    return this.activePowerUps.get(type) || 0;
  }

  /**
   * Get all active power-ups
   */
  public getActivePowerUps(): ActivePowerUp[] {
    const active: ActivePowerUp[] = [];
    this.activePowerUps.forEach((timeRemaining, type) => {
      active.push({ type, timeRemaining });
    });
    return active;
  }

  /**
   * Deactivate a power-up (e.g., when shield is used)
   */
  public deactivatePowerUp(type: PowerUpType): void {
    this.activePowerUps.delete(type);
  }

  /**
   * Get power-up duration
   */
  private getPowerUpDuration(type: PowerUpType): number {
    switch (type) {
      case "shield":
        return Infinity; // Single use
      case "coinMagnet":
        return 8000; // 8 seconds
      case "slowMotion":
        return 5000; // 5 seconds
      default:
        return 0;
    }
  }

  /**
   * Get power-up color
   */
  public getPowerUpColor(type: PowerUpType): string {
    switch (type) {
      case "shield":
        return "#00FF00"; // Green
      case "coinMagnet":
        return "#FFFF00"; // Yellow
      case "slowMotion":
        return "#FF00FF"; // Magenta
      default:
        return "#FFFFFF";
    }
  }

  /**
   * Reset all power-ups
   */
  public reset(): void {
    this.powerUps = [];
    this.activePowerUps.clear();
  }
}
