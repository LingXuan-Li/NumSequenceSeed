// --------------------------------
// Configuration Seed
// --------------------------------

/**
 * Encodes a random generator configuration into a seed string.
 *
 * The configuration is packed into a single BigInt and
 * serialized using Base62 encoding.
 *
 * Seed format:
 * S + Base62(packed configuration)
 *
 * @param config - Random generator configuration.
 * @returns Serialized configuration seed.
 * @throws Error if the configuration is invalid.
 */

import type { SeedConfig, SeedString } from "../types.js";

import {
  VALUE_BASE,
} from "../constants.js";

import {
  encode62,
  decode62,
} from "./base62.js";

import {
  validateConfig,
} from "./validation.js";

export function encodeSeed(config: SeedConfig): SeedString {
  validateConfig(config);

  const { originalSeed, min, max, count } = config;

  // Pack all configuration values into a single integer.
  const packed =
    (
      (
        BigInt(originalSeed) * VALUE_BASE +
        BigInt(min + 1_000_000)
      ) * VALUE_BASE +
      BigInt(max + 1_000_000)
    ) * 1_000_000n +
    BigInt(count - 1);

  return "S" + encode62(packed);
}

/**
 * Decodes a configuration seed into its original configuration.
 *
 * Extracts each packed value using division and modulo operations.
 *
 * @param seed - Serialized configuration seed.
 * @returns Restored random generator configuration.
 * @throws Error if the seed format or decoded configuration is invalid.
 */
export function decodeSeed(seed: SeedString): SeedConfig {
  if (!seed.startsWith("S")) {
    throw new Error("Invalid seed type");
  }

  let value = decode62(seed.slice(1));

  // Extract the generated value count.
  const count = Number(value % 1_000_000n) + 1;
  value /= 1_000_000n;

  // Extract the maximum value.
  const max = Number(value % VALUE_BASE) - 1_000_000;
  value /= VALUE_BASE;

  // Extract the minimum value.
  const min = Number(value % VALUE_BASE) - 1_000_000;
  value /= VALUE_BASE;

  // Remaining value represents the original seed.
  const originalSeed = Number(value);

  const config = { originalSeed, min, max, count };

  validateConfig(config);

    return config;
}
