# NumSequenceSeed

Copyright (c) 2026 LingXuan-Li

[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](https://github.com/LingXuan-Li/NumSequenceSeed/blob/main/LICENSE)

![Status](https://img.shields.io/badge/Status-In%20Development-orange?style=flat-square)
[![Last Commit](https://img.shields.io/github/last-commit/LingXuan-Li/NumSequenceSeed?style=flat-square)](https://github.com/LingXuan-Li/NumSequenceSeed/commits/main)

A lightweight, deterministic sequence seed generator for TypeScript and JavaScript.

## What's this?

NumSequenceSeed is a TypeScript/JavaScript library for generating reproducible pseudo-random integer sequences and serializing their configurations or integer arrays into compact seed strings.

Instead of storing an entire generated sequence, you can store a seed and regenerate the same sequence whenever needed.

## Features

- **Deterministic generation** — The same seed always produces the same sequence.
- **Compact serialization** — Encode configurations and integer arrays into compact Base62 strings.
- **Reproducibility** — Reconstruct sequences from previously saved seeds.
- **TypeScript support** — Built-in type definitions.
- **Dual module support** — ESM and CommonJS.
- **No runtime dependencies** — Uses native JavaScript features, including BigInt.

## Installation

Install directly from GitHub using npm:

```bash
npm install github:LingXuan-Li/NumSequenceSeed
````

To install a specific version:

bash

```bash
npm install github:LingXuan-Li/NumSequenceSeed#v1.0.0
```

## Quick Start

### 1. Generate a sequence

typescript

```typescript
import { NumSequenceSeed } from "num-sequence-seed";

const seed = NumSequenceSeed.encode({
  originalSeed: 12345,
  min: 1,
  max: 100,
  count: 10,
});

const sequence = NumSequenceSeed.generate(seed);

console.log(seed);
console.log(sequence);
```

The generated sequence is deterministic. Using the same configuration will always produce the same sequence.

### 2. Restore a configuration

typescript

```typescript
import { decodeSeed } from "num-sequence-seed";

const config = decodeSeed(seed);

console.log(config);
```

The original configuration can be reconstructed from its serialized seed.

### 3. Serialize an integer array

typescript

```typescript
import { encodeList, decodeList } from "num-sequence-seed";

const original = [10, 20, 30, -5, 100];

const seed = encodeList(original);

const restored = decodeList(seed);

console.log(restored);
// [10, 20, 30, -5, 100]
```

This allows integer arrays to be stored or transferred as compact seed strings.

## API Reference

NumSequenceSeed provides five core functions and a unified API.

### Configuration Seed

#### `encodeSeed(config: SeedConfig): SeedString`

Encodes a random sequence configuration into a seed string.

typescript

```typescript
import { encodeSeed } from "num-sequence-seed";

const seed = encodeSeed({
  originalSeed: 12345,
  min: 0,
  max: 100,
  count: 20,
});
```

#### `decodeSeed(seed: SeedString): SeedConfig`

Decodes a configuration seed into its original configuration.

typescript

```typescript
import { decodeSeed } from "num-sequence-seed";

const config = decodeSeed(seed);
```

### Random Sequence Generation

#### `generate(seed: SeedString): number[]`

Generates a deterministic pseudo-random integer sequence from a configuration seed.

typescript

```typescript
import { generate } from "num-sequence-seed";

const numbers = generate(seed);
```

The generated values are within the inclusive range `[min, max]`.

### Integer List Serialization

#### `encodeList(values: readonly number[]): SeedString`

Encodes an integer array into a compact seed string.

typescript

```typescript
import { encodeList } from "num-sequence-seed";

const seed = encodeList([1, 2, 3, 4, 5]);
```

#### `decodeList(seed: SeedString): number[]`

Restores an integer array from its serialized seed.

typescript

```typescript
import { decodeList } from "num-sequence-seed";

const values = decodeList(seed);
```

## Unified API

All five core functions are also available through the `NumSequenceSeed` object.

typescript

```typescript
import { NumSequenceSeed } from "num-sequence-seed";

const seed = NumSequenceSeed.encode({
  originalSeed: 42,
  min: 1,
  max: 100,
  count: 10,
});

const sequence = NumSequenceSeed.generate(seed);

const config = NumSequenceSeed.decode(seed);

const listSeed = NumSequenceSeed.encodeList(sequence);

const restoredList = NumSequenceSeed.decodeList(listSeed);
```

## TypeScript Types

The library exports the following types:

typescript

```typescript
import type {
  SeedConfig,
  SeedString,
} from "num-sequence-seed";
```

### `SeedConfig`

typescript

```typescript
interface SeedConfig {
  originalSeed: number;
  min: number;
  max: number;
  count: number;
}
```

| Property | Description |
| --- | --- |
| `originalSeed` | Original unsigned 32-bit seed |
| `min` | Inclusive minimum generated value |
| `max` | Inclusive maximum generated value |
| `count` | Number of generated values |

### `SeedString`

A string representing a serialized configuration or integer list.

- `S` prefix: Configuration seed.
- `L` prefix: Integer list seed.

## Constraints

NumSequenceSeed validates its inputs before encoding or generating sequences.

### Configuration Constraints

| Parameter | Supported range |
| --- | --- |
| `originalSeed` | 0 to 4,294,967,295 |
| `min` | -1,000,000 to 1,000,000 |
| `max` | -1,000,000 to 1,000,000 |
| `count` | 1 to 1,000,000 |

Additional requirements:

- All numeric values must be safe integers.
- `min` must not exceed `max`.

### Integer List Constraints

- Each value must be a safe integer.
- Each value must be between -1,000,000 and 1,000,000.
- The maximum list length is 1,000,000.

Invalid inputs cause an `Error` to be thrown.

## How It Works

NumSequenceSeed uses compact serialization and deterministic pseudo-random generation.

### Configuration Encoding

Configuration values are packed into a single BigInt and encoded using Base62.

The resulting seed uses the following format:

text

```text
S + Base62(packed configuration)
```

### Integer List Encoding

Integer arrays are packed into a single BigInt.

The resulting seed uses the following format:

text

```text
L + Base62(length) + "." + Base62(packed values)
```

### Sequence Generation

NumSequenceSeed uses the xorshift32 pseudo-random number generation algorithm.

The generator:

1. Initializes its internal state from the original seed.
2. Generates deterministic pseudo-random values.
3. Maps each value into the requested inclusive integer range.
4. Repeats until the requested number of values has been generated.

> Note: This is a deterministic pseudo-random generator, not a cryptographically secure random number generator. Do not use it for cryptographic keys, passwords, or security-sensitive randomness.

## Development

### Clone the repository

bash

```bash
git clone https://github.com/LingXuan-Li/NumSequenceSeed.git
cd NumSequenceSeed
```

### Install dependencies

bash

```bash
npm install
```

### Run tests

bash

```bash
npm run test:run
```

### Run the demo

bash

```bash
npm run dev:demo
```

### Build the demo

bash

```bash
npm run build:demo
```

## License

This project is licensed under the MIT License.

See LICENSE for details.

## Repository

GitHub: [https://github.com/LingXuan-Li/NumSequenceSeed](<https://github.com/LingXuan-Li/NumSequenceSeed>)
