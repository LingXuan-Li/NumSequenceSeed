
/**
 * NumSequenceSeed
 *
 * Deterministic random number generation
 * and seed serialization utility.
 *
 * Public API entry point.
 */

// --------------------------------
// Configuration Seed
// --------------------------------

export {
  encodeSeed,
  decodeSeed,
} from "./core/config-seed.js";

// --------------------------------
// List Seed
// --------------------------------

export {
  encodeList,
  decodeList,
} from "./core/list-seed.js";

// --------------------------------
// Random Generator
// --------------------------------

export {
  generate,
} from "./core/random.js";

// --------------------------------
// Types
// --------------------------------

export type {
  SeedConfig,
  SeedString,
} from "./types.js";

// --------------------------------
// Unified API
// --------------------------------

import {
  encodeSeed,
  decodeSeed,
} from "./core/config-seed.js";

import {
  encodeList,
  decodeList,
} from "./core/list-seed.js";

import {
  generate,
} from "./core/random.js";

/**
 * Unified public API for NumSequenceSeed.
 */
export const NumSequenceSeed = {
  encode: encodeSeed,
  decode: decodeSeed,
  generate,
  encodeList,
  decodeList,
} as const;
