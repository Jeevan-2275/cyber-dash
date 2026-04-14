/**
 * Particle System for Cyber Dash
 * Generates and manages visual particle effects
 */

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // 0-1, where 1 is fully visible
  maxLife: number;
  size: number;
  color: string;
  type: "jump" | "collision" | "score";
}

export class ParticleSystem {
  private particles: Particle[] = [];
  private particleId = 0;

  /**
   * Create particles for jump effect
   */
  public createJumpParticles(x: number, y: number): void {
    const particleCount = 6;
    const colors = ["#00D9FF", "#8B00FF", "#FF006E"];

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const speed = 3 + Math.random() * 2;

      const particle: Particle = {
        id: `particle-${this.particleId++}`,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2, // Upward bias
        life: 1,
        maxLife: 0.6,
        size: 4 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: "jump",
      };

      this.particles.push(particle);
    }
  }

  /**
   * Create particles for collision effect
   */
  public createCollisionParticles(x: number, y: number): void {
    const particleCount = 12;
    const colors = ["#FF006E", "#00D9FF"];

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const speed = 4 + Math.random() * 3;

      const particle: Particle = {
        id: `particle-${this.particleId++}`,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: 0.8,
        size: 3 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: "collision",
      };

      this.particles.push(particle);
    }
  }

  /**
   * Create particles for score increase
   */
  public createScoreParticles(x: number, y: number): void {
    const particleCount = 8;
    const colors = ["#00D9FF", "#8B00FF"];

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const speed = 2 + Math.random() * 1.5;

      const particle: Particle = {
        id: `particle-${this.particleId++}`,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        life: 1,
        maxLife: 0.5,
        size: 2 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: "score",
      };

      this.particles.push(particle);
    }
  }

  /**
   * Update particles
   */
  public update(deltaTime: number): void {
    this.particles = this.particles
      .map((particle) => {
        const updated = { ...particle };

        // Update position
        updated.x += updated.vx;
        updated.y += updated.vy;

        // Apply gravity
        updated.vy += 0.15;

        // Update life
        updated.life -= deltaTime / updated.maxLife;

        return updated;
      })
      .filter((particle) => particle.life > 0);
  }

  /**
   * Get all particles
   */
  public getParticles(): Particle[] {
    return [...this.particles];
  }

  /**
   * Clear all particles
   */
  public clear(): void {
    this.particles = [];
  }
}
