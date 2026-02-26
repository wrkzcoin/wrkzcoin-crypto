"use strict";
// Copyright (c) 2020, The TurtleCoin Developers
//
// Please see the included LICENSE file for more information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoType = void 0;
/**
 * Represents the type of underlying cryptographic methods
 */
var CryptoType;
(function (CryptoType) {
    CryptoType[CryptoType["UNKNOWN"] = 0] = "UNKNOWN";
    CryptoType[CryptoType["NODEADDON"] = 1] = "NODEADDON";
    CryptoType[CryptoType["WASM"] = 2] = "WASM";
    CryptoType[CryptoType["WASMJS"] = 3] = "WASMJS";
    CryptoType[CryptoType["JS"] = 4] = "JS";
    CryptoType[CryptoType["MIXED"] = 5] = "MIXED";
    CryptoType[CryptoType["EXTERNAL"] = 6] = "EXTERNAL";
})(CryptoType = exports.CryptoType || (exports.CryptoType = {}));
