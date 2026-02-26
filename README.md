# WrkzCoin Crypto Library

Standalone cryptography library for WrkzCoin with a focus on building `wrkzcoin-crypto-wasm.js` for multiple Linux distributions and platforms.

## Build Targets

- WASM JS bundle: `dist/wrkzcoin-crypto-wasm.js`
- Native JS bundle: `dist/wrkzcoin-crypto.js`

## Quick Build (WASM-focused)

```bash
git clone -b master --single-branch https://github.com/wrkzcoin/wrkzcoin-crypto
cd wrkzcoin-crypto
yarn install
yarn build-typescript
```

Then build WASM/JS:

```bash
yarn build-native
```

If `yarn build-native` fails due to submodule/private repo fetch, use the manual build path below.

## Manual WASM Build (No `build-native` script)

Prerequisite: Emscripten tools available in `PATH` (`emcmake`, `emconfigure`, `emmake`).

```bash
mkdir -p dist
mkdir -p jsbuild
cd jsbuild

emconfigure cmake .. -DNO_AES=1 -DARCH=default -DBUILD_WASM=1 -DBUILD_JS=0
cmake --build . -- -j
cp wrkzcoin-crypto-wasm.js ../dist/

emconfigure cmake .. -DNO_AES=1 -DARCH=default -DBUILD_WASM=0 -DBUILD_JS=1
cmake --build . -- -j
cp wrkzcoin-crypto.js ../dist/
```

## Platform Prerequisites

### Ubuntu / Debian

```bash
sudo apt-get update
sudo apt-get install -y build-essential cmake git python3 make curl
```

### Fedora / RHEL / Rocky

```bash
sudo dnf groupinstall -y "Development Tools"
sudo dnf install -y cmake git python3 make curl
```

### Alpine

```bash
sudo apk add --no-cache build-base cmake git python3 make bash curl
```

### macOS

```bash
xcode-select --install
brew install cmake git python make
```

### Windows

Recommended: WSL2 (Ubuntu) and use Linux steps above.

## TypeScript Usage (Local Build)

```ts
import { Crypto } from './dist';
const crypto = new Crypto();
```

## Notes

- Coin ticker: `WRKZ`
- Decimal places: `2`
- This repo is source-distributed; no npm package is required.

## Credits

Cryptonote Developers, Bytecoin Developers, Monero Developers, Forknote Project, TurtleCoin Community, WrkzCoin Community.
