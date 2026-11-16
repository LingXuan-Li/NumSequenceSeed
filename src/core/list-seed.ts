// --------------------------------
// List Seed
// --------------------------------

/**
 * Encodes an integer array into a compact seed string.
 *
 * Each value is shifted into a non-negative range and
 * packed into a single BigInt using VALUE_BASE.
 *
 * Seed format:
 * L + Base62(length) + "." + Base62(packed values)
 *
 * @param values - Integer array to encode.
 * @returns Serialized list seed.
 * @throws Error if the list length or any value is invalid.
 */
import type { SeedString } from "../types.js";

import { VALUE_BASE, MAX_COUNT } from "../constants.js";

import { encode62, decode62 } from "./base62.js";

import { validateValue } from "./validation.js";

export function encodeList(values: readonly number[]): SeedString {
  if (values.length > MAX_COUNT) {
    throw new Error("List is too large");
  }

  let packed = 0n;

  for (const value of values) {
    validateValue(value);

    // Append the next value using positional packing.
    packed = packed * VALUE_BASE + BigInt(value + 1_000_000);
  }

  return `L${encode62(BigInt(values.length))}.${encode62(packed)}`;
}

/**
 * Decodes a list seed into its original integer array.
 *
 * The list length is stored separately from the packed values,
 * allowing the original array order to be reconstructed.
 *
 * @param seed - Serialized list seed.
 * @returns Restored integer array.
 * @throws Error if the seed format or packed data is invalid.
 */
export function decodeList(seed: SeedString): number[] {
  if (!seed.startsWith("L")) {
    throw new Error("Invalid list seed type");
  }

  // Locate and validate the separator.
  const separator = seed.indexOf(".", 1);

  if (separator < 0 || separator !== seed.lastIndexOf(".")) {
    throw new Error("Invalid list seed format");
  }

  // Decode and validate the original list length.
  const count = Number(decode62(seed.slice(1, separator)));

  if (!Number.isSafeInteger(count) || count < 0 || count > MAX_COUNT) {
    throw new Error("Invalid list length");
  }

  let packed = decode62(seed.slice(separator + 1));

  const result = new Array<number>(count);

  // Extract values from right to left to restore original order.
  for (let i = count - 1; i >= 0; i--) {
    result[i] = Number(packed % VALUE_BASE) - 1_000_000;
    packed /= VALUE_BASE;
  }

  // Reject packed data containing values beyond the declared length.
  if (packed !== 0n) {
    throw new Error("Invalid packed list");
  }

  return result;
}
