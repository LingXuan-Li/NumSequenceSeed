import { describe, expect, it } from "vitest";
import { encodeSeed, decodeSeed } from "../src/core/config-seed";
import { encode62 } from "../src/core/base62";
import type { SeedConfig } from "../src/types.js";

describe("Configuration Seed", () => {
  const validConfig: SeedConfig = {
    originalSeed: 123456789,
    min: -100,
    max: 100,
    count: 100,
  };

  describe("encodeSeed", () => {
    it("should generate a seed with S prefix", () => {
      const seed = encodeSeed(validConfig);

      expect(seed.startsWith("S")).toBe(true);
    });

    it("should generate deterministic seeds", () => {
      expect(encodeSeed(validConfig)).toBe(encodeSeed(validConfig));
    });

    it("should reject invalid configurations", () => {
      expect(() =>
        encodeSeed({
          ...validConfig,
          count: 0,
        }),
      ).toThrow();
    });
  });

  describe("decodeSeed", () => {
    it("should restore the original configuration", () => {
      const seed = encodeSeed(validConfig);

      expect(decodeSeed(seed)).toEqual(validConfig);
    });

    it("should reject incorrect seed prefixes", () => {
      expect(() => decodeSeed("L123")).toThrow("Invalid seed type");
    });

    it("should reject empty seed payloads", () => {
      expect(() => decodeSeed("S")).toThrow();
    });

    it("should reject invalid Base62 payloads", () => {
      expect(() => decodeSeed("S!@#")).toThrow();
    });

    it("should reject decoded invalid configurations", () => {
      const invalidSeed =
        "S" + encode62(4_294_967_296n * 2_000_001n * 2_000_001n * 1_000_000n);

      expect(() => decodeSeed(invalidSeed)).toThrow("Invalid configuration");
    });
  });

  describe("Round-trip", () => {
    const configs: SeedConfig[] = [
      {
        originalSeed: 0,
        min: 0,
        max: 0,
        count: 1,
      },
      {
        originalSeed: 1,
        min: -1,
        max: 1,
        count: 10,
      },
      {
        originalSeed: 4_294_967_295,
        min: -1_000_000,
        max: 1_000_000,
        count: 1_000_000,
      },
      {
        originalSeed: 123456789,
        min: -500,
        max: -100,
        count: 500,
      },
    ];

    it.each(configs)("should restore configuration: %o", (config) => {
      expect(decodeSeed(encodeSeed(config))).toEqual(config);
    });
  });
});
