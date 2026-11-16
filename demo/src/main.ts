
import { NumSequenceSeed } from "../../src/index";
import type { SeedConfig } from "../../src/types";

function getElement<T extends HTMLElement>(id: string): T {
    const element = document.getElementById(id);

    if (!element) {
        throw new Error(`Element not found: ${id}`);
    }

    return element as T;
}

function getNumber(id: string): number {
    return Number(getElement<HTMLInputElement>(id).value);
}

function showResult(id: string, value: unknown): void {
    getElement<HTMLElement>(id).textContent =
        typeof value === "string"
            ? value
            : JSON.stringify(value, null, 2);
}

function showError(id: string, error: unknown): void {
    showResult(
        id,
        error instanceof Error ? error.message : String(error)
    );
}

// --------------------------------
// Configuration Seed
// --------------------------------

getElement<HTMLButtonElement>("encodeConfig").addEventListener(
    "click",
    () => {
        try {
            const config: SeedConfig = {
                originalSeed: getNumber("originalSeed"),
                min: getNumber("min"),
                max: getNumber("max"),
                count: getNumber("count"),
            };

            const seed = NumSequenceSeed.encode(config);

            getElement<HTMLInputElement>("configSeed").value = seed;
            getElement<HTMLInputElement>("randomSeed").value = seed;

            showResult("configResult", seed);
        } catch (error) {
            showError("configResult", error);
        }
    }
);

getElement<HTMLButtonElement>("decodeConfig").addEventListener(
    "click",
    () => {
        try {
            const seed = getElement<HTMLInputElement>("configSeed").value;

            const config = NumSequenceSeed.decode(seed);

            getElement<HTMLInputElement>("originalSeed").value =
                String(config.originalSeed);

            getElement<HTMLInputElement>("min").value =
                String(config.min);

            getElement<HTMLInputElement>("max").value =
                String(config.max);

            getElement<HTMLInputElement>("count").value =
                String(config.count);

            getElement<HTMLInputElement>("randomSeed").value = seed;

            showResult("configResult", config);
        } catch (error) {
            showError("configResult", error);
        }
    }
);

// --------------------------------
// Random Generator
// --------------------------------

getElement<HTMLButtonElement>("generate").addEventListener(
    "click",
    () => {
        try {
            const seed = getElement<HTMLInputElement>("randomSeed").value;

            const result = NumSequenceSeed.generate(seed);

            showResult("randomResult", {
                count: result.length,
                values: result,
            });
        } catch (error) {
            showError("randomResult", error);
        }
    }
);

// --------------------------------
// List Seed
// --------------------------------

getElement<HTMLButtonElement>("encodeList").addEventListener(
    "click",
    () => {
        try {
            const input = getElement<HTMLTextAreaElement>("listInput").value;

            const values = input
                .split(/[,\s]+/)
                .filter((value) => value.length > 0)
                .map(Number);

            const seed = NumSequenceSeed.encodeList(values);

            getElement<HTMLInputElement>("listSeed").value = seed;

            showResult("listResult", {
                original: values,
                seed,
            });
        } catch (error) {
            showError("listResult", error);
        }
    }
);

getElement<HTMLButtonElement>("decodeList").addEventListener(
    "click",
    () => {
        try {
            const seed = getElement<HTMLInputElement>("listSeed").value;

            const result = NumSequenceSeed.decodeList(seed);

            getElement<HTMLTextAreaElement>("listInput").value =
                result.join(", ");

            showResult("listResult", {
                count: result.length,
                values: result,
            });
        } catch (error) {
            showError("listResult", error);
        }
    }
);
