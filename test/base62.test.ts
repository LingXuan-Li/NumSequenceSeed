import { describe, expect, it } from "vitest";
import { encode62, decode62 } from "../src/core/base62";

describe("Base62", () => {
  describe("encode62", () => {
    it("should encode zero", () => {
      expect(encode62(0n)).toBe("0");
    });

    it("should encode values from 0 to 61", () => {
      const charset =
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

      for (let i = 0; i < 62; i++) {
        expect(encode62(BigInt(i))).toBe(charset[i]);
      }
    });

    it("should encode values greater than 61", () => {
      expect(encode62(62n)).toBe("10");
      expect(encode62(63n)).toBe("11");
      expect(encode62(3844n)).toBe("100");
    });

    it("should encode large BigInt values", () => {
      const value = 123456789012345678901234567890n;

      expect(encode62(value)).toBe(encode62(value));
    });

    it("should reject negative values", () => {
      expect(() => encode62(-1n)).toThrow("Negative values are not supported");
    });
  });

  describe("decode62", () => {
    it("should decode zero", () => {
      expect(decode62("0")).toBe(0n);
    });

    it("should decode all Base62 characters", () => {
      const charset =
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

      for (let i = 0; i < 62; i++) {
        expect(decode62(charset[i])).toBe(BigInt(i));
      }
    });

    it("should decode multi-character values", () => {
      expect(decode62("10")).toBe(62n);
      expect(decode62("11")).toBe(63n);
      expect(decode62("100")).toBe(3844n);
    });

    it("should reject empty strings", () => {
      expect(() => decode62("")).toThrow();
    });

    it("should reject invalid characters", () => {
      expect(() => decode62("!")).toThrow();
      expect(() => decode62("12@34")).toThrow();
      expect(() => decode62("あ")).toThrow();
    });

    it("should reject non-canonical representations", () => {
      expect(() => decode62("00")).toThrow("Non-canonical Base62 string");

      expect(() => decode62("001")).toThrow("Non-canonical Base62 string");
    });
  });

  describe("Round-trip", () => {
    it("should restore original values", () => {
      const values = [
        0n,
        1n,
        61n,
        62n,
        123456789n,
        123456789012345678901234567890n,
      ];

      for (const value of values) {
        expect(decode62(encode62(value))).toBe(value);
      }
    });
  });
});
