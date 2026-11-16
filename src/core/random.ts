// --------------------------------
// Random Generator
// --------------------------------

/**
 * Generates a deterministic sequence of pseudo-random integers.
 *
 * Uses a 32-bit xorshift algorithm (xorshift32).
 *
 * The generator is initialized from the original seed.
 * A zero state is replaced with 1 because xorshift32
 * cannot produce a non-zero sequence from a zero state.
 *
 * Generated values are uniformly mapped to the inclusive
 * range [min, max] using Math.floor().
 *
 * @param seed - Serialized configuration seed.
 * @returns Generated integer array.
 * @throws Error if the configuration seed is invalid.
 */
import { decodeSeed } from "./config-seed.js";
import type { SeedString } from "../types.js";

export function generate(seed: SeedString): number[] {
  const config = decodeSeed(seed);

  let state = config.originalSeed >>> 0;

  // xorshift32 requires a non-zero initial state.
  if (state === 0) state = 1;

  /**
   * Generates the next pseudo-random number.
   *
   * Returns a floating-point value in the range [0, 1).
   */
  function random(): number {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;

    // Keep the internal state as an unsigned 32-bit integer.
    state >>>= 0;

    return state / 4_294_967_296;
  }

  // Generate the requested number of integers.
  return Array.from(
    { length: config.count },
    () =>
      Math.floor(
        random() * (config.max - config.min + 1)
      ) + config.min
  );
}