
import { describe, expect, it } from "vitest";
import {
    validateConfig,
    validateValue,
} from "../src/core/validation";
import type { SeedConfig } from "../src/types.js";

describe("Validation", () => {
    describe("validateConfig", () => {
        const validConfig: SeedConfig = {
            originalSeed: 123456789,
            min: -100,
            max: 100,
            count: 100,
        };

        it("should accept valid configuration", () => {
            expect(() => validateConfig(validConfig)).not.toThrow();
        });

        it("should accept minimum supported seed", () => {
            expect(() =>
                validateConfig({
                    ...validConfig,
                    originalSeed: 0,
                })
            ).not.toThrow();
        });

        it("should accept maximum supported seed", () => {
            expect(() =>
                validateConfig({
                    ...validConfig,
                    originalSeed: 4_294_967_295,
                })
            ).not.toThrow();
        });

        it("should accept minimum and maximum values", () => {
            expect(() =>
                validateConfig({
                    ...validConfig,
                    min: -1_000_000,
                    max: 1_000_000,
                })
            ).not.toThrow();
        });

        it("should accept count boundaries", () => {
            for (const count of [1, 1_000_000]) {
                expect(() =>
                    validateConfig({
                        ...validConfig,
                        count,
                    })
                ).not.toThrow();
            }
        });

        it("should reject negative seeds", () => {
            expect(() =>
                validateConfig({
                    ...validConfig,
                    originalSeed: -1,
                })
            ).toThrow("Invalid configuration");
        });

        it("should reject seeds exceeding uint32", () => {
            expect(() =>
                validateConfig({
                    ...validConfig,
                    originalSeed: 4_294_967_296,
                })
            ).toThrow("Invalid configuration");
        });

        it("should reject non-integer seeds", () => {
            expect(() =>
                validateConfig({
                    ...validConfig,
                    originalSeed: 1.5,
                })
            ).toThrow();
        });

        it("should reject unsafe integers", () => {
            expect(() =>
                validateConfig({
                    ...validConfig,
                    originalSeed: Number.MAX_SAFE_INTEGER + 1,
                })
            ).toThrow();
        });

        it("should reject invalid ranges", () => {
            expect(() =>
                validateConfig({
                    ...validConfig,
                    min: 1_000_001,
                })
            ).toThrow();

            expect(() =>
                validateConfig({
                    ...validConfig,
                    max: -1_000_001,
                })
            ).toThrow();

            expect(() =>
                validateConfig({
                    ...validConfig,
                    min: 100,
                    max: -100,
                })
            ).toThrow();
        });

        it("should reject invalid counts", () => {
            for (const count of [0, -1, 1_000_001, 1.5]) {
                expect(() =>
                    validateConfig({
                        ...validConfig,
                        count,
                    })
                ).toThrow();
            }
        });
    });

    describe("validateValue", () => {
        it("should accept valid integer values", () => {
            expect(() => validateValue(0)).not.toThrow();
            expect(() => validateValue(100)).not.toThrow();
            expect(() => validateValue(-100)).not.toThrow();
        });

        it("should accept supported boundaries", () => {
            expect(() => validateValue(-1_000_000)).not.toThrow();
            expect(() => validateValue(1_000_000)).not.toThrow();
        });

        it("should reject values outside the range", () => {
            expect(() => validateValue(-1_000_001)).toThrow();
            expect(() => validateValue(1_000_001)).toThrow();
        });

        it("should reject non-integer values", () => {
            expect(() => validateValue(1.5)).toThrow();
            expect(() => validateValue(NaN)).toThrow();
            expect(() => validateValue(Infinity)).toThrow();
        });
    });
});
