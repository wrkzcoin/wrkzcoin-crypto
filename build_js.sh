#!/bin/bash

# Copyright (c) 2026, The WrkzCoin Developers
# Portions derived from the TurtleCoin project contributors.
#
# Please see the included LICENSE file for more information.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EMSDK_DIR="${ROOT_DIR}/emsdk"
EMSDK_GIT_URL="https://github.com/emscripten-core/emsdk.git"

# Set up emscripten in a non-interactive way.
# This avoids prompts such as:
# "Username for 'https://github.com':"
if ! command -v emconfigure >/dev/null 2>&1; then
  if [[ -z "${EMSDK:-}" ]]; then
    echo "Installing emscripten..."
    echo ""

    if [[ ! -x "${EMSDK_DIR}/emsdk" ]]; then
      GIT_TERMINAL_PROMPT=0 git clone --depth 1 "${EMSDK_GIT_URL}" "${EMSDK_DIR}"
    fi

    pushd "${EMSDK_DIR}" >/dev/null
    ./emsdk install latest
    ./emsdk activate latest
    # shellcheck disable=SC1091
    source "${EMSDK_DIR}/emsdk_env.sh"
    popd >/dev/null
  else
    # shellcheck disable=SC1091
    source "${EMSDK}/emsdk_env.sh"
  fi
fi

# This patch only applies to old fastcomp layouts.
if [[ -f "${EMSDK_DIR}/fastcomp/emscripten/src/shell.js" ]]; then
  patch -N --verbose "${EMSDK_DIR}/fastcomp/emscripten/src/shell.js" "${ROOT_DIR}/scripts/emscripten.patch" || true
fi

mkdir -p "${ROOT_DIR}/dist"
mkdir -p "${ROOT_DIR}/jsbuild"
cd "${ROOT_DIR}/jsbuild"
rm -rf *

emcmake cmake .. -DNO_AES=1 -DARCH=default -DBUILD_WASM=1 -DBUILD_JS=0
make && cp wrkzcoin-crypto-wasm.js "${ROOT_DIR}/dist"

emcmake cmake .. -DNO_AES=1 -DARCH=default -DBUILD_WASM=0 -DBUILD_JS=1
make && cp wrkzcoin-crypto.js "${ROOT_DIR}/dist"
