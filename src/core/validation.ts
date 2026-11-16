// --------------------------------
// Validation
// --------------------------------

/**
 * Validates a random generator configuration.
 *
 * Checks integer safety, supported ranges, and count constraints.
 *
 * @param config - Configuration to validate.
 * @throws Error if any configuration value is invalid.
 */
import type { SeedConfig } from "../types.js";

import { MAX_SEED, MAX_COUNT } from "../constants.js";

export function validateConfig(config: SeedConfig): void {
  const { originalSeed, min, max, count } = config;

  if (
    !Number.isSafeInteger(originalSeed) ||
    originalSeed < 0 ||
    originalSeed > MAX_SEED ||
    !Number.isSafeInteger(min) ||
    !Number.isSafeInteger(max) ||
    min < -1_000_000 ||
    max > 1_000_000 ||
    min > max ||
    !Number.isSafeInteger(count) ||
    count < 1 ||
    count > MAX_COUNT
  ) {
    throw new Error("Invalid configuration");
  }
}

/**
 * Validates an integer list value.
 *
 * @param value - Integer to validate.
 * @throws Error if the value is outside the supported range.
 */
export function validateValue(value: number): void {
  if (!Number.isSafeInteger(value) || value < -1_000_000 || value > 1_000_000) {
    throw new Error("Invalid list value");
  }
}
