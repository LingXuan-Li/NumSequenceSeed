/**
 * NumSequenceSeed
 *
 * Shared constants used throughout the library.
 */

// --------------------------------
// Base62
// --------------------------------

/** Base62 character set. */
export const CHARSET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

/** Base used for Base62 encoding and decoding. */
export const BASE62 = 62n;

// --------------------------------
// Value Range
// --------------------------------

/** Number of supported integer values. */
export const VALUE_BASE = 2_000_001n;

/** Offset used to shift negative values into a non-negative range. */
export const VALUE_OFFSET = 1_000_000;

// --------------------------------
// Seed Configuration
// --------------------------------

/** Maximum supported unsigned 32-bit seed. */
export const MAX_SEED = 4_294_967_295;

/** Maximum number of values allowed in a sequence or list. */
export const MAX_COUNT = 1_000_000;

/** Minimum supported integer value. */
export const MIN_VALUE = -1_000_000;

/** Maximum supported integer value. */
export const MAX_VALUE = 1_000_000;

/** Maximum unsigned 32-bit integer. */
export const UINT32_MAX = 4_294_967_296;
