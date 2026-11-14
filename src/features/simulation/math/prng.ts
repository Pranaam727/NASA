/**
 * DETERMINISTIC PSEUDO-RANDOM NUMBER GENERATOR (Mulberry32 + Box-Muller)
 * Ensures reproducible simulation runs across identical seeds for hackathon demonstrations.
 */

export class SeededPRNG {
  private s: number;

  constructor(seed: number = 19690720) {
    // Apollo 11 moon landing timestamp default seed
    this.s = seed >>> 0;
  }

  /**
   * Resets the generator state to a specific seed.
   */
  public setSeed(seed: number): void {
    this.s = seed >>> 0;
  }

  /**
   * Returns a pseudo-random float between 0 (inclusive) and 1 (exclusive).
   * Mulberry32 algorithm.
   */
  public next(): number {
    let t = (this.s += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Returns a pseudo-random float in [min, max).
   */
  public nextRange(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  /**
   * Returns a pseudo-random integer in [min, max].
   */
  public nextInt(min: number, max: number): number {
    return Math.floor(this.nextRange(min, max + 1));
  }

  /**
   * Generates a normally distributed value using Box-Muller transform.
   * @param mean Center of distribution
   * @param stdDev Standard deviation
   */
  public nextGaussian(mean: number = 0, stdDev: number = 1): number {
    let u1 = this.next();
    let u2 = this.next();
    while (u1 === 0) u1 = this.next(); // avoid Math.log(0)

    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return mean + z0 * stdDev;
  }
}
