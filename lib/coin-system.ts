/**
 * Simple Coin System
 * Spawn coins, collect, track
 */

export interface Coin {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  collected: boolean;
}

export class CoinSystem {
  private coins: Coin[] = [];
  private nextId = 0;
  private totalCoinsCollected = 0;

  /**
   * Spawn a coin at position
   */
  public spawnCoin(x: number, y: number): void {
    const coin: Coin = {
      id: `coin-${this.nextId++}`,
      x,
      y,
      width: 12,
      height: 12,
      collected: false,
    };
    this.coins.push(coin);
  }

  /**
   * Get all active coins
   */
  public getCoins(): Coin[] {
    return this.coins.filter((c) => !c.collected);
  }

  /**
   * Collect a coin
   */
  public collectCoin(coinId: string): boolean {
    const coin = this.coins.find((c) => c.id === coinId);
    if (!coin) return false;

    coin.collected = true;
    this.totalCoinsCollected++;
    return true;
  }

  /**
   * Get total coins collected this game
   */
  public getTotalCollected(): number {
    return this.totalCoinsCollected;
  }

  /**
   * Remove off-screen coins
   */
  public removeOffScreenCoins(screenWidth: number): void {
    this.coins = this.coins.filter((c) => c.x > -50 && !c.collected);
  }

  /**
   * Reset coins
   */
  public reset(): void {
    this.coins = [];
    this.totalCoinsCollected = 0;
  }
}
