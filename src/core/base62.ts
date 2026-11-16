// --------------------------------
// Base62 Encoding
// --------------------------------

/**
 * Encodes a non-negative BigInt into a Base62 string.
 *
 * Uses the following character set:
 * 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz
 *
 * @param value - Value to encode.
 * @returns Base62 encoded string.
 * @throws Error if the value is negative.
 */
import {
  CHARSET,
  BASE62,
} from "../constants.js";

export function encode62(value: bigint): string {
  if (value < 0n) {
    throw new Error("Negative values are not supported");
  }

  if (value === 0n) return "0";

  let result = "";

  while (value > 0n) {
    result = CHARSET[Number(value % BASE62)] + result;
    value /= BASE62;
  }

  return result;
}

/**
 * Decodes a canonical Base62 string into a BigInt.
 *
 * Rejects invalid characters and non-canonical representations.
 *
 * @param str - Base62 encoded string.
 * @returns Decoded BigInt value.
 * @throws Error if the input is invalid or non-canonical.
 */
export function decode62(str: string): bigint {
  if (!str || !/^[0-9A-Za-z]+$/.test(str)) {
    throw new Error("Invalid Base62 string");
  }

  let value = 0n;

  for (const char of str) {
    const digit = CHARSET.indexOf(char);

    value = value * BASE62 + BigInt(digit);
  }

  // Ensure the input uses the canonical representation.
  if (encode62(value) !== str) {
    throw new Error("Non-canonical Base62 string");
  }

  return value;
}
