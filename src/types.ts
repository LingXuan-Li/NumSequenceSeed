/**
 * NumSequenceSeed
 *
 * Shared type definitions.
 */

// --------------------------------
// Seed Configuration
// --------------------------------

/**
 * Configuration used to initialize
 * the deterministic random number generator.
 */
export interface SeedConfig {
  /** Original unsigned 32-bit random seed. */
  originalSeed: number;

  /** Inclusive lower bound of generated values. */
  min: number;

  /** Inclusive upper bound of generated values. */
  max: number;

  /** Number of values to generate. */
  count: number;
}

// --------------------------------
// Seed String
// --------------------------------

/**
 * Serialized seed representation.
 *
 * S prefix: Configuration seed.
 * L prefix: Integer list seed.
 */
export type SeedString = string;

// --------------------------------
// Integer List
// --------------------------------

/**
 * Integer array supported by NumSequenceSeed.
 *
 * Values must be safe integers between
 * -1,000,000 and 1,000,000.
 */
export type IntegerList = readonly number[];

// --------------------------------
// Random Sequence
// --------------------------------

/**
 * Generated sequence of pseudo-random integers.
 */
export type NumberSequence = number[];
