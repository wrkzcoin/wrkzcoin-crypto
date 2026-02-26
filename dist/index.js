"use strict";
// Copyright (c) 2020, The TurtleCoin Developers
//
// Please see the included LICENSE file for more information.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crypto = exports.COIN_DECIMAL_PLACES = exports.COIN_TICKER = exports.CryptoType = void 0;
const js_sha3_1 = require("js-sha3");
const Interfaces_1 = require("./Interfaces");
Object.defineProperty(exports, "CryptoType", { enumerable: true, get: function () { return Interfaces_1.CryptoType; } });
exports.COIN_TICKER = 'WRKZ';
exports.COIN_DECIMAL_PLACES = 2;
/**
 * @ignore
 */
const userCryptoFunctions = {};
/**
 * @ignore
 */
const moduleVars = {
    crypto: null,
    type: Interfaces_1.CryptoType.UNKNOWN
};
/**
 * @ignore
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line no-extend-native
Array.prototype.toVectorString = function () {
    if (!moduleVars.crypto.VectorString) {
        throw new Error('VectorString unavailable');
    }
    const arr = new moduleVars.crypto.VectorString();
    this.map(elem => arr.push_back(elem));
    return arr;
};
/**
 * A class containing the WrkzCoin cryptographic primitive methods that wraps
 * the Node.js native module, the WASM binary, or native JS implementations
 * into a common interface
 */
class Crypto {
    /**
     * Returns the type of the cryptographic primitives used by the wrapper
     */
    static get type() {
        return moduleVars.type;
    }
    /**
     * Returns if the Node.js native library is being used
     */
    static get isNative() {
        switch (moduleVars.type) {
            case Interfaces_1.CryptoType.NODEADDON:
                return true;
            default:
                return false;
        }
    }
    /**
     * Returns if the wrapper is loaded and ready
     */
    static get isReady() {
        return (moduleVars.crypto !== null &&
            typeof moduleVars.crypto.cn_fast_hash === 'function');
    }
    /**
     * Retrieves the array of user-defined cryptographic primitive functions
     * that replace our primitives at runtime
     */
    static get userCryptoFunctions() {
        return userCryptoFunctions;
    }
    /**
     * Allows for updating the user-defined cryptographic primitive functions
     * that will replace our primitives at runtime.
     * @param config
     */
    static set userCryptoFunctions(config) {
        Object.keys(config)
            .forEach(key => {
            userCryptoFunctions[key] = config[key];
        });
    }
    /**
     * Forces the wrapper to use the JS (slow) cryptographic primitives
     */
    static forceJSCrypto() {
        return loadNativeJS();
    }
    /**
     * Creates a new wrapper object
     * @param [config] may contain user-defined cryptographic primitive functions
     * that will replace our primitives at runtime.
     */
    constructor(config) {
        if (!initialize()) {
            throw new Error('Could not initialize underlying cryptographic library');
        }
        if (config) {
            Crypto.userCryptoFunctions = config;
        }
    }
    /**
     * Returns the type of the cryptographic primitives used by the wrapper
     */
    get type() {
        return Crypto.type;
    }
    /**
     * Returns if the Node.js native library is being used
     */
    get isNative() {
        return Crypto.isNative;
    }
    /**
     * Returns if the wrapper is loaded and ready
     */
    get isReady() {
        return Crypto.isReady;
    }
    /**
     * Retrieves the array of user-defined cryptographic primitive functions
     * that replace our primitives at runtime
     */
    get userCryptoFunctions() {
        return Crypto.userCryptoFunctions;
    }
    /**
     * Allows for updating the user-defined cryptographic primitive functions
     * that will replace our primitives at runtime.
     * @param config
     */
    set userCryptoFunctions(config) {
        Crypto.userCryptoFunctions = config;
    }
    /**
     * Forces the wrapper to use the JS (slow) cryptographic primitives
     */
    forceJSCrypto() {
        return Crypto.forceJSCrypto();
    }
    /**
     * Calculates the multisignature (m) private keys using our private spend key
     * and the public spend keys of other participants in a M:N scheme
     * @param private_spend_key our private spend key
     * @param public_keys an array of the other participants public spend keys
     */
    calculateMultisigPrivateKeys(private_spend_key, public_keys) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.checkScalar(private_spend_key))) {
                throw new Error('privateSpendKey is not a scalar');
            }
            if (!Array.isArray(public_keys)) {
                throw new Error('public_keys must be an array');
            }
            public_keys = public_keys.map(elem => elem.toLowerCase());
            for (const key of public_keys) {
                if (!(yield this.checkKey(key))) {
                    throw new Error(`calculateMultisigPrivateKeys: Invalid public key found '${key}'`);
                }
            }
            return tryRunFunc('calculateMultisigPrivateKeys', private_spend_key.toLowerCase(), public_keys);
        });
    }
    /**
     * Calculates a shared private key from the private keys supplied
     * @param private_keys the array of private keys
     */
    calculateSharedPrivateKey(private_keys) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(private_keys)) {
                throw new Error('private_keys must be an array');
            }
            private_keys = private_keys.map(elem => elem.toLowerCase());
            for (const key of private_keys) {
                if (!(yield this.checkScalar(key))) {
                    throw new Error('Invalid private key found');
                }
            }
            return tryRunFunc('calculateSharedPrivateKey', private_keys);
        });
    }
    /**
     * Calculates a shared public key from the public keys supplied
     * @param public_keys the array of public keys
     */
    calculateSharedPublicKey(public_keys) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(public_keys)) {
                throw new Error('public_keys must be an array');
            }
            public_keys = public_keys.map(elem => elem.toLowerCase());
            for (const key of public_keys) {
                if (!(yield this.checkKey(key))) {
                    throw new Error(`calculateSharedPublicKey: Invalid public key found '${key}'`);
                }
            }
            return tryRunFunc('calculateSharedPublicKey', public_keys);
        });
    }
    /**
     * Checks whether a given key is a public key
     * @param public_key the public key to check
     */
    checkKey(public_key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isHex64(public_key)) {
                return false;
            }
            return tryRunFunc('checkKey', public_key.toLowerCase());
        });
    }
    /**
     * Checks a set of ring signatures to verify that they are valid
     * @param prefix_hash the hash (often the transaction prefix hash)
     * @param key_image real key_image used to generate the signatures
     * @param input_keys the output keys used during signing (mixins + real)
     * @param signatures the signatures
     */
    checkRingSignatures(prefix_hash, key_image, input_keys, signatures) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isHex64(prefix_hash)) {
                return false;
            }
            if (!isHex64(key_image)) {
                return false;
            }
            if (!Array.isArray(input_keys)) {
                return false;
            }
            if (!Array.isArray(signatures)) {
                return false;
            }
            let err = false;
            input_keys = input_keys.map(elem => elem.toLowerCase());
            signatures = signatures.map(elem => elem.toLowerCase());
            for (const key of input_keys) {
                if (!(yield this.checkKey(key))) {
                    err = true;
                }
            }
            for (const sig of signatures) {
                if (!isHex128(sig)) {
                    err = true;
                }
            }
            if (err) {
                return false;
            }
            return tryRunFunc('checkRingSignature', prefix_hash.toLowerCase(), key_image.toLowerCase(), input_keys, signatures);
        });
    }
    /**
     * Checks whether the given key is a private key
     * @param private_key
     */
    checkScalar(private_key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isHex64(private_key)) {
                return false;
            }
            private_key = private_key.toLowerCase();
            return (private_key === (yield this.scReduce32(private_key)));
        });
    }
    /**
     * Checks that the given signature is valid for the hash and public key supplied
     * @param message_digest the hash (message digest) used
     * @param public_key the public key of the private key used to sign
     * @param signature the signature
     */
    checkSignature(message_digest, public_key, signature) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isHex64(message_digest)) {
                return false;
            }
            if (!(yield this.checkKey(public_key))) {
                return false;
            }
            if (!isHex128(signature)) {
                return false;
            }
            return tryRunFunc('checkSignature', message_digest.toLowerCase(), public_key.toLowerCase(), signature.toLowerCase());
        });
    }
    /**
     * Calculates the hash of the data supplied using the cn_fast_hash method
     * @param data
     */
    cn_fast_hash(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isHex(data)) {
                throw new Error('Supplied data must be in hexadecimal form');
            }
            data = data.toLowerCase();
            return tryRunFunc('cn_fast_hash', data)
                .catch(() => { return js_sha3_1.keccak256(Buffer.from(data, 'hex')); });
        });
    }
    /**
     * Completes a given set of prepared ring signatures using the single
     * private_ephemeral
     * @param private_ephemeral private ephemeral of the output being spent
     * @param real_output_index the position of the signature in the array that belongs
     * to the real output being spent
     * @param k the random scalar provided with the prepared ring signatures
     * @param signatures the prepared ring signatures
     */
    completeRingSignatures(private_ephemeral, real_output_index, k, signatures) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.checkScalar(private_ephemeral))) {
                throw new Error('Invalid private key found');
            }
            if (!Array.isArray(signatures)) {
                throw new Error('signatures must be an array');
            }
            if (!isUInt(real_output_index) || real_output_index > signatures.length - 1) {
                throw new Error('Invalid real_output_index format');
            }
            if (!(yield this.checkScalar(k))) {
                throw new Error('Invalid k found');
            }
            for (const sig of signatures) {
                if (!isHex128(sig)) {
                    throw new Error('Invalid signature found');
                }
            }
            return tryRunFunc('completeRingSignatures', private_ephemeral.toLowerCase(), real_output_index, k.toLowerCase(), signatures);
        });
    }
    /**
     * Converts a key derivation to its resulting scalar
     * @param derivation the key derivation
     * @param output_index the index of the output in the transaction
     */
    derivationToScalar(derivation, output_index) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isHex64(derivation)) {
                throw new Error('Invalid derivation found');
            }
            if (!isUInt(output_index)) {
                throw new Error('Invalid output index found');
            }
            return tryRunFunc('derivationToScalar', derivation.toLowerCase(), output_index);
        });
    }
    /**
     * Derives the public ephemeral from the key derivation, output index, and
     * our public spend key
     * @param derivation the key derivation
     * @param output_index the index of the output in the transaction
     * @param public_key our public spend key
     */
    derivePublicKey(derivation, output_index, public_key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isHex64(derivation)) {
                throw new Error('Invalid derivation found');
            }
            if (!isUInt(output_index)) {
                throw new Error('Invalid output index found');
            }
            if (!(yield this.checkKey(public_key))) {
                throw new Error(`derivePublicKey: Invalid public key found '${public_key}'`);
            }
            return tryRunFunc('derivePublicKey', derivation.toLowerCase(), output_index, public_key.toLowerCase());
        });
    }
    /**
     * Derives the private ephemeral from the key derivation, output index, and
     * our private spend key
     * @param derivation the key derivation
     * @param output_index the index of the output in the transaction
     * @param private_key our private spend key
     */
    deriveSecretKey(derivation, output_index, private_key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isHex64(derivation)) {
                throw new Error('Invalid derivation found');
            }
            if (!isUInt(output_index)) {
                throw new Error('Invalid output index found');
            }
            if (!(yield this.checkScalar(private_key))) {
                throw new Error('Invalid private key found');
            }
            return tryRunFunc('deriveSecretKey', derivation.toLowerCase(), output_index, private_key.toLowerCase());
        });
    }
    /**
     * Generates a set of deterministic spend keys for a sub wallet given
     * our root private spend key and the index of the subwallet
     * @param private_key our root private spend key (seed)
     * @param walletIndex the index of the subwallet
     */
    generateDeterministicSubwalletKeys(private_key, walletIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.checkScalar(private_key))) {
                throw new Error('Invalid private key found');
            }
            if (!isUInt(walletIndex)) {
                throw new Error('Invalid wallet index found');
            }
            const keys = yield tryRunFunc('generateDeterministicSubwalletKeys', private_key.toLowerCase(), walletIndex);
            if (keys) {
                return {
                    private_key: keys.private_key || keys.secretKey || keys.SecretKey,
                    public_key: keys.public_key || keys.PublicKey
                };
            }
            else {
                throw new Error('Could not generate deterministic subwallet keys');
            }
        });
    }
    /**
     * Generates a key derivation (aB) given the public key and private key
     * @param public_key
     * @param private_key
     */
    generateKeyDerivation(public_key, private_key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.checkKey(public_key))) {
                throw new Error(`generateKeyDerivation: Invalid public key found '${public_key}'`);
            }
            if (!(yield this.checkScalar(private_key))) {
                throw new Error('Invalid private key found');
            }
            return tryRunFunc('generateKeyDerivation', public_key.toLowerCase(), private_key.toLowerCase());
        });
    }
    /**
     * Generates a key derivation scalar H_s(aB) given the public key and private key
     * @param public_key the public key
     * @param private_key the private key
     * @param output_index the output index
     */
    generateKeyDerivationScalar(public_key, private_key, output_index) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.checkKey(public_key))) {
                throw new Error(`generateKeyDerivationScalar: Invalid public key found '${public_key}'`);
            }
            if (!(yield this.checkScalar(private_key))) {
                throw new Error('Invalid private key found');
            }
            if (!isUInt(output_index)) {
                throw new Error('Invalid output index found');
            }
            return tryRunFunc('generateKeyDerivationScalar', public_key.toLowerCase(), private_key.toLowerCase(), output_index);
        });
    }
    /**
     * Generates a key image given the public ephemeral and the private ephemeral
     * @param publicEphemeral the public ephemeral of the output
     * @param private_ephemeral the private ephemeral of the output
     */
    generateKeyImage(publicEphemeral, private_ephemeral) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.checkKey(publicEphemeral))) {
                throw new Error('Invalid public ephemeral found');
            }
            if (!(yield this.checkScalar(private_ephemeral))) {
                throw new Error('Invalid private ephemeral found');
            }
            return tryRunFunc('generateKeyImage', publicEphemeral.toLowerCase(), private_ephemeral.toLowerCase());
        });
    }
    /**
     * Generates a new random key pair
     */
    generateKeys() {
        return __awaiter(this, void 0, void 0, function* () {
            const keys = yield tryRunFunc('generateKeys');
            if (keys) {
                return {
                    private_key: keys.private_key || keys.secretKey || keys.SecretKey,
                    public_key: keys.public_key || keys.publicKey || keys.PublicKey
                };
            }
            else {
                throw new Error('Could not generate keys');
            }
        });
    }
    /**
     * Generates a partial signing key for a multisig ring signature set
     * @param signature the prepared real input signature
     * @param private_key our private spend key (or multisig private key)
     */
    generatePartialSigningKey(signature, private_key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isHex128(signature)) {
                throw new Error('Invalid signature found');
            }
            if (!(yield this.checkScalar(private_key))) {
                throw new Error('Invalid private key found');
            }
            return tryRunFunc('generatePartialSigningKey', signature.toLowerCase(), private_key.toLowerCase());
        });
    }
    /**
     * Generates a private view key from the private spend key
     * @param private_key the private spend key
     */
    generatePrivateViewKeyFromPrivateSpendKey(private_key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.checkScalar(private_key))) {
                throw new Error('Invalid private key found');
            }
            return tryRunFunc('generatePrivateViewKeyFromPrivateSpendKey', private_key.toLowerCase());
        });
    }
    /**
     * Generates ring signatures for the supplied values
     * @param hash the message digest hash (often the transaction prefix hash)
     * @param key_image the key image of the output being spent
     * @param public_keys an array of the output keys used for signing (mixins + our output)
     * @param private_ephemeral the private ephemeral of the output being spent
     * @param real_output_index the array index of the real output being spent in the public_keys array
     */
    generateRingSignatures(hash, key_image, public_keys, private_ephemeral, real_output_index) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isHex64(hash)) {
                throw new Error('Invalid hash found');
            }
            if (!isHex64(key_image)) {
                throw new Error('Invalid key image found');
            }
            if (!(yield this.checkScalar(private_ephemeral))) {
                throw new Error('Invalid private key found');
            }
            if (!Array.isArray(public_keys)) {
                throw new Error('public keys must be an array');
            }
            if (!isUInt(real_output_index) || real_output_index > public_keys.length - 1) {
                throw new Error('Invalid real index found');
            }
            public_keys = public_keys.map(elem => elem.toLowerCase());
            for (const key of public_keys) {
                if (!(yield this.checkKey(key))) {
                    throw new Error(`generateRingSignatures: Invalid public key found '${key}'`);
                }
            }
            return tryRunFunc('generateRingSignatures', hash.toLowerCase(), key_image.toLowerCase(), public_keys, private_ephemeral.toLowerCase(), real_output_index);
        });
    }
    /**
     * Generates a signature for the given message digest (hash)
     * @param hash the hash
     * @param public_key the public key used in signing
     * @param private_key the private key used to sign
     */
    generateSignature(hash, public_key, private_key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isHex64(hash)) {
                throw new Error('Invalid hash found');
            }
            if (!(yield this.checkKey(public_key))) {
                throw new Error(`generateSignature: Invalid public key found '${public_key}'`);
            }
            if (!(yield this.checkScalar(private_key))) {
                throw new Error('Invalid private key found');
            }
            return tryRunFunc('generateSignature', hash.toLowerCase(), public_key.toLowerCase(), private_key.toLowerCase());
        });
    }
    /**
     * Generates a vew key pair from the private spend key
     * @param private_key the private spend key
     */
    generateViewKeysFromPrivateSpendKey(private_key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.checkScalar(private_key))) {
                throw new Error('Invalid private key found');
            }
            const keys = yield tryRunFunc('generateViewKeysFromPrivateSpendKey', private_key.toLowerCase());
            if (keys) {
                return {
                    private_key: keys.private_key || keys.secretKey || keys.SecretKey,
                    public_key: keys.public_key || keys.PublicKey
                };
            }
            else {
                throw new Error('Could not generate view keys from private spend key');
            }
        });
    }
    /**
     * Converts a hash to an elliptic curve point
     * @param hash the hash
     */
    hashToEllipticCurve(hash) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isHex64(hash)) {
                throw new Error('Invalid hash found');
            }
            return tryRunFunc('hashToEllipticCurve', hash.toLowerCase());
        });
    }
    /**
     * Converts a hash to a scalar
     * @param hash the hash
     */
    hashToScalar(hash) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isHex64(hash)) {
                throw new Error('Invalid hash found');
            }
            return tryRunFunc('hashToScalar', hash.toLowerCase());
        });
    }
    /**
     * Prepares ring signatures for completion or restoration later
     * @param hash the message digest hash (often the transaction prefix hash)
     * @param key_image the key image of the output being spent
     * @param public_keys an array of the output keys used for signing (mixins + our output)
     * @param real_output_index the array index of the real output being spent in the public_keys array
     * @param k a random scalar (private key)
     */
    prepareRingSignatures(hash, key_image, public_keys, real_output_index, k) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isHex64(hash)) {
                throw new Error('Invalid hash found');
            }
            if (!isHex64(key_image)) {
                throw new Error('Invalid key image found');
            }
            if (!Array.isArray(public_keys)) {
                throw new Error('public_keys must be an array');
            }
            if (!isUInt(real_output_index) || real_output_index > public_keys.length - 1) {
                throw new Error('Invalid real index found');
            }
            if (k) {
                k = k.toLowerCase();
            }
            hash = hash.toLowerCase();
            key_image = key_image.toLowerCase();
            public_keys = public_keys.map(elem => elem.toLowerCase());
            for (const key of public_keys) {
                if (!(yield this.checkKey(key))) {
                    throw new Error(`prepareRingSignatures: Invalid public key found '${key}'`);
                }
            }
            let result;
            if (!k) {
                result = yield tryRunFunc('prepareRingSignatures', hash, key_image, public_keys, real_output_index);
            }
            else {
                if (moduleVars.type === Interfaces_1.CryptoType.NODEADDON) {
                    result = yield tryRunFunc('prepareRingSignatures', hash, key_image, public_keys, real_output_index, k);
                }
                else if (moduleVars.type === Interfaces_1.CryptoType.JS ||
                    moduleVars.type === Interfaces_1.CryptoType.WASM ||
                    moduleVars.type === Interfaces_1.CryptoType.WASMJS) {
                    result = yield tryRunFunc('prepareRingSignaturesK', hash, key_image, public_keys, real_output_index, k);
                }
                else {
                    result = yield tryRunFunc('prepareRingSignatures', hash, key_image, public_keys, real_output_index, k);
                }
            }
            if (result) {
                return {
                    signatures: result.signatures,
                    k: result.key
                };
            }
            else {
                throw new Error('Could not prepare ring signatures');
            }
        });
    }
    /**
     * Re-initializes the underlying cryptographic primitives
     */
    reloadCrypto() {
        return __awaiter(this, void 0, void 0, function* () {
            return initialize();
        });
    }
    /**
     * Restores a key image from a set of partial key images generated by the other
     * participants in a multisig wallet
     * @param publicEphemeral the transaction public ephemeral
     * @param derivation the key derivation of the our output
     * @param output_index the index of our output in the transaction
     * @param partialKeyImages the array of partial key images from the needed
     * number of participants in the multisig scheme
     */
    restoreKeyImage(publicEphemeral, derivation, output_index, partialKeyImages) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.checkKey(publicEphemeral))) {
                throw new Error('Invalid public ephemeral found');
            }
            if (!isHex64(derivation)) {
                throw new Error('Invalid derivation found');
            }
            if (!isUInt(output_index)) {
                throw new Error('Invalid output index found');
            }
            if (!Array.isArray(partialKeyImages)) {
                throw new Error('partial key images must be an array');
            }
            partialKeyImages = partialKeyImages.map(elem => elem.toLowerCase());
            for (const key of partialKeyImages) {
                if (!isHex64(key)) {
                    throw new Error('Invalid key image found');
                }
            }
            return tryRunFunc('restoreKeyImage', publicEphemeral.toLowerCase(), derivation.toLowerCase(), output_index, partialKeyImages);
        });
    }
    /**
     * Restores the ring signatures using the previously prepared ring signatures
     * and the necessary number of partial signing keys generated by other
     * participants in the multisig wallet
     * @param derivation the key derivation for the output being spent
     * @param output_index the index of the output being spent in the transaction
     * @param partialSigningKeys the array of partial signing keys from the necessary number
     * of participants
     * @param real_output_index the index of the real input in the ring signatures
     * @param k the random scalar generated py preparing the ring signatures
     * @param signatures the prepared ring signatures
     */
    restoreRingSignatures(derivation, output_index, partialSigningKeys, real_output_index, k, signatures) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isHex64(derivation)) {
                throw new Error('Invalid derivation found');
            }
            if (!isUInt(output_index)) {
                throw new Error('Invalid output index found');
            }
            if (!Array.isArray(partialSigningKeys)) {
                throw new Error('partial signing keys must be an array');
            }
            if (!(yield this.checkScalar(k))) {
                throw new Error('Invalid k found');
            }
            if (!Array.isArray(signatures)) {
                throw new Error('signatures must be an array');
            }
            if (!isUInt(real_output_index) || real_output_index > signatures.length - 1) {
                throw new Error('Invalid real index found');
            }
            partialSigningKeys = partialSigningKeys.map(elem => elem.toLowerCase());
            signatures = signatures.map(elem => elem.toLowerCase());
            for (const key of partialSigningKeys) {
                if (!(yield this.checkScalar(key))) {
                    throw new Error('Invalid partial signing key found');
                }
            }
            for (const sig of signatures) {
                if (!isHex128(sig)) {
                    throw new Error('Invalid signature found');
                }
            }
            return tryRunFunc('restoreRingSignatures', derivation.toLowerCase(), output_index, partialSigningKeys, real_output_index, k.toLowerCase(), signatures);
        });
    }
    /**
     * Derives the public key using the derivation scalar
     * @param derivationScalar the derivation scalar
     * @param public_key the public key
     */
    scalarDerivePublicKey(derivationScalar, public_key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.checkScalar(derivationScalar))) {
                throw new Error('Invalid derivation scalar found');
            }
            if (!(yield this.checkKey(public_key))) {
                throw new Error(`scalarDerivePublicKey: Invalid public key found '${public_key}'`);
            }
            return tryRunFunc('scalarDerivePublicKey', derivationScalar.toLowerCase(), public_key.toLowerCase());
        });
    }
    /**
     * Derives the private key using the derivation scalar
     * @param derivationScalar the derivation scalar
     * @param private_key the private key
     */
    scalarDeriveSecretKey(derivationScalar, private_key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.checkScalar(derivationScalar))) {
                throw new Error('Invalid derivation scalar found');
            }
            if (!(yield this.checkScalar(private_key))) {
                throw new Error('Invalid private key found');
            }
            return tryRunFunc('scalarDeriveSecretKey', derivationScalar.toLowerCase(), private_key.toLowerCase());
        });
    }
    /**
     * Multiplies two key images together
     * @param key_imageA
     * @param key_imageB
     */
    scalarmultKey(key_imageA, key_imageB) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isHex64(key_imageA)) {
                throw new Error('Invalid key image A found');
            }
            if (!isHex64(key_imageB)) {
                throw new Error('Invalid key image B found');
            }
            return tryRunFunc('scalarmultKey', key_imageA.toLowerCase(), key_imageB.toLowerCase());
        });
    }
    /**
     * Reduces a value to a scalar (mod q)
     * @param data
     */
    scReduce32(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isHex64(data)) {
                throw new Error('Invalid data format');
            }
            return tryRunFunc('scReduce32', data.toLowerCase());
        });
    }
    /**
     * Calculates the public key of a private key
     * @param private_key
     */
    secretKeyToPublicKey(private_key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.checkScalar(private_key))) {
                throw new Error('Invalid private key found');
            }
            return tryRunFunc('secretKeyToPublicKey', private_key.toLowerCase());
        });
    }
    /**
     * Calculates the merkle tree branch of the given hashes
     * @param hashes the array of hashes
     */
    tree_branch(hashes) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(hashes)) {
                throw new Error('hashes must be an array');
            }
            hashes = hashes.map(elem => elem.toLowerCase());
            for (const hash of hashes) {
                if (!isHex64(hash)) {
                    throw new Error('Invalid hash found');
                }
            }
            return tryRunFunc('tree_branch', hashes);
        });
    }
    /**
     * Calculates the depth of the merkle tree
     * @param count the number of hashes in the tree
     */
    tree_depth(count) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isUInt(count)) {
                throw new Error('Invalid count found');
            }
            return tryRunFunc('tree_depth', count);
        });
    }
    /**
     * Calculates the merkle tree hash of the given hashes
     * @param hashes the array of hashes
     */
    tree_hash(hashes) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(hashes)) {
                throw new Error('hashes must be an array');
            }
            hashes = hashes.map(elem => elem.toLowerCase());
            for (const hash of hashes) {
                if (!isHex64(hash)) {
                    throw new Error('Invalid hash found');
                }
            }
            return tryRunFunc('tree_hash', hashes);
        });
    }
    /**
     * Calculates the merkle tree hash from the given branch information
     * @param branches the merkle tree branches
     * @param leaf the leaf on the merkle tree
     * @param path the path on the merkle tree
     */
    tree_hash_from_branch(branches, leaf, path) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(branches)) {
                throw new Error('branches must be an array');
            }
            if (!isHex64(leaf)) {
                throw new Error('Invalid leaf found');
            }
            if (!isUInt(path)) {
                throw new Error('Invalid path found');
            }
            branches = branches.map(elem => elem.toLowerCase());
            for (const branch of branches) {
                if (!isHex64(branch)) {
                    throw new Error('Invalid branch found');
                }
            }
            if (moduleVars.type === Interfaces_1.CryptoType.NODEADDON) {
                return tryRunFunc('tree_hash_from_branch', branches, leaf.toLowerCase(), path);
            }
            else {
                return tryRunFunc('tree_hash_from_branch', branches, leaf.toLowerCase(), path.toString());
            }
        });
    }
    /**
     * Underives a public key instead of deriving it
     * @param derivation the key derivation
     * @param output_index the index of the output in the transaction
     * @param outputKey the output key in the transaction
     */
    underivePublicKey(derivation, output_index, outputKey) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isHex64(derivation)) {
                throw new Error('Invalid derivation found');
            }
            if (!isUInt(output_index)) {
                throw new Error('Invalid output index found');
            }
            if (!(yield this.checkKey(outputKey))) {
                throw new Error('Invalid output key found');
            }
            return tryRunFunc('underivePublicKey', derivation.toLowerCase(), output_index, outputKey.toLowerCase());
        });
    }
    /**
     * Calculates the hash of the data supplied using the cn_slow_hash_v0 method
     * @param data
     */
    cn_slow_hash_v0(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isHex(data)) {
                throw new Error('Invalid data found');
            }
            return tryRunFunc('cn_slow_hash_v0', data.toLowerCase());
        });
    }
    /**
     * Calculates the hash of the data supplied using the cn_slow_hash_v1 method
     * @param data
     */
    cn_slow_hash_v1(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isHex(data)) {
                throw new Error('Invalid data found');
            }
            return tryRunFunc('cn_slow_hash_v1', data.toLowerCase());
        });
    }
    /**
     * Calculates the hash of the data supplied using the cn_slow_hash_v2 method
     * @param data
     */
    cn_slow_hash_v2(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isHex(data)) {
                throw new Error('Invalid data found');
            }
            return tryRunFunc('cn_slow_hash_v2', data.toLowerCase());
        });
    }
    /**
     * Calculates the hash of the data supplied using the cn_lite_slow_hash_v0 method
     * @param data
     */
    cn_lite_slow_hash_v0(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isHex(data)) {
                throw new Error('Invalid data found');
            }
            return tryRunFunc('cn_lite_slow_hash_v0', data.toLowerCase());
        });
    }
    /**
     * Calculates the hash of the data supplied using the cn_lite_slow_hash_v1 method
     * @param data
     */
    cn_lite_slow_hash_v1(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isHex(data)) {
                throw new Error('Invalid data found');
            }
            return tryRunFunc('cn_lite_slow_hash_v1', data.toLowerCase());
        });
    }
    /**
     * Calculates the hash of the data supplied using the cn_lite_slow_hash_v2 method
     * @param data
     */
    cn_lite_slow_hash_v2(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isHex(data)) {
                throw new Error('Invalid data found');
            }
            return tryRunFunc('cn_lite_slow_hash_v2', data.toLowerCase());
        });
    }
    /**
     * Calculates the hash of the data supplied using the cn_dark_slow_hash_v0 method
     * @param data
     */
    cn_dark_slow_hash_v0(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isHex(data)) {
                throw new Error('Invalid data found');
            }
            return tryRunFunc('cn_dark_slow_hash_v0', data.toLowerCase());
        });
    }
    /**
     * Calculates the hash of the data supplied using the cn_dark_slow_hash_v1 method
     * @param data
     */
    cn_dark_slow_hash_v1(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isHex(data)) {
                throw new Error('Invalid data found');
            }
            return tryRunFunc('cn_dark_slow_hash_v1', data.toLowerCase());
        });
    }
    /**
     * Calculates the hash of the data supplied using the cn_dark_slow_hash_v2 method
     * @param data
     */
    cn_dark_slow_hash_v2(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isHex(data)) {
                throw new Error('Invalid data found');
            }
            return tryRunFunc('cn_dark_slow_hash_v2', data.toLowerCase());
        });
    }
    /**
     * Calculates the hash of the data supplied using the cn_dark_lite_slow_hash_v0 method
     * @param data
     */
    cn_dark_lite_slow_hash_v0(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isHex(data)) {
                throw new Error('Invalid data found');
            }
            return tryRunFunc('cn_dark_lite_slow_hash_v0', data.toLowerCase());
        });
    }
    /**
     * Calculates the hash of the data supplied using the cn_dark_lite_slow_hash_v1 method
     * @param data
     */
    cn_dark_lite_slow_hash_v1(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isHex(data)) {
                throw new Error('Invalid data found');
            }
            return tryRunFunc('cn_dark_lite_slow_hash_v1', data.toLowerCase());
        });
    }
    /**
     * Calculates the hash of the data supplied using the cn_dark_lite_slow_hash_v2 method
     * @param data
     */
    cn_dark_lite_slow_hash_v2(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isHex(data)) {
                throw new Error('Invalid data found');
            }
            return tryRunFunc('cn_dark_lite_slow_hash_v2', data.toLowerCase());
        });
    }
    /**
     * Calculates the hash of the data supplied using the cn_turtle_slow_hash_v0 method
     * @param data
     */
    cn_turtle_slow_hash_v0(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isHex(data)) {
                throw new Error('Invalid data found');
            }
            return tryRunFunc('cn_turtle_slow_hash_v0', data.toLowerCase());
        });
    }
    /**
     * Calculates the hash of the data supplied using the cn_turtle_slow_hash_v1 method
     * @param data
     */
    cn_turtle_slow_hash_v1(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isHex(data)) {
                throw new Error('Invalid data found');
            }
            return tryRunFunc('cn_turtle_slow_hash_v1', data.toLowerCase());
        });
    }
    /**
     * Calculates the hash of the data supplied using the cn_turtle_slow_hash_v2 method
     * @param data
     */
    cn_turtle_slow_hash_v2(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isHex(data)) {
                throw new Error('Invalid data found');
            }
            return tryRunFunc('cn_turtle_slow_hash_v2', data.toLowerCase());
        });
    }
    /**
     * Calculates the hash of the data supplied using the cn_turtle_lite_slow_hash_v0 method
     * @param data
     */
    cn_turtle_lite_slow_hash_v0(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isHex(data)) {
                throw new Error('Invalid data found');
            }
            return tryRunFunc('cn_turtle_lite_slow_hash_v0', data.toLowerCase());
        });
    }
    /**
     * Calculates the hash of the data supplied using the cn_turtle_lite_slow_hash_v1 method
     * @param data
     */
    cn_turtle_lite_slow_hash_v1(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isHex(data)) {
                throw new Error('Invalid data found');
            }
            return tryRunFunc('cn_turtle_lite_slow_hash_v1', data.toLowerCase());
        });
    }
    /**
     * Calculates the hash of the data supplied using the cn_turtle_lite_slow_hash_v2 method
     * @param data
     */
    cn_turtle_lite_slow_hash_v2(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isHex(data)) {
                throw new Error('Invalid data found');
            }
            return tryRunFunc('cn_turtle_lite_slow_hash_v2', data.toLowerCase());
        });
    }
    /**
     * Calculates the hash of the data supplied using the generateTransactionPow method
     * @param data
     */
    generateTransactionPow(serializedTransaction, nonceOffset, diff) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isHex(serializedTransaction)) {
                throw new Error('Invalid data found');
            }
            if (!isUInt(diff)) {
                throw new Error('Invalid diff found');
            }
            return tryRunFunc('generateTransactionPow', serializedTransaction, nonceOffset, diff);
        });
    }
    /**
     * Calculates the hash of the data supplied using the cn_upx method
     * @param data
     */
    cn_upx(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isHex(data)) {
                throw new Error('Invalid data found');
            }
            return tryRunFunc('cn_upx', data.toLowerCase());
        });
    }
    /**
     * Calculates the hash of the data supplied using the cn_soft_shell_slow_hash_v0 method
     * @param data
     * @param height the height of the blockchain
     */
    cn_soft_shell_slow_hash_v0(data, height) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isHex(data)) {
                throw new Error('Invalid data found');
            }
            if (!isUInt(height)) {
                throw new Error('Invalid height found');
            }
            return tryRunFunc('cn_soft_shell_slow_hash_v0', data.toLowerCase(), height);
        });
    }
    /**
     * Calculates the hash of the data supplied using the cn_soft_shell_slow_hash_v1 method
     * @param data
     * @param height the height of the blockchain
     */
    cn_soft_shell_slow_hash_v1(data, height) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isHex(data)) {
                throw new Error('Invalid data found');
            }
            if (!isUInt(height)) {
                throw new Error('Invalid height found');
            }
            return tryRunFunc('cn_soft_shell_slow_hash_v1', data.toLowerCase(), height);
        });
    }
    /**
     * Calculates the hash of the data supplied using the cn_soft_shell_slow_hash_v2 method
     * @param data
     * @param height the height of the blockchain
     */
    cn_soft_shell_slow_hash_v2(data, height) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isHex(data)) {
                throw new Error('Invalid data found');
            }
            if (!isUInt(height)) {
                throw new Error('Invalid height found');
            }
            return tryRunFunc('cn_soft_shell_slow_hash_v2', data.toLowerCase(), height);
        });
    }
    /**
     * Calculates the hash of the data supplied using the chukwa_slow_hash method
     * @param data
     * @param version
     */
    chukwa_slow_hash(data, version = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isHex(data)) {
                throw new Error('Invalid data found');
            }
            let func = 'chukwa_slow_hash_';
            switch (version) {
                case 1:
                    func += 'v1';
                    break;
                case 2:
                    func += 'v2';
                    break;
                default:
                    throw new Error('Unknown Chukwa version number');
            }
            return tryRunFunc(func, data.toLowerCase());
        });
    }
    /**
     * Calculates the hash of the data supplied using the chukwa_slow_hash_base method
     * @param data
     * @param iterations
     * @param memory
     * @param threads
     */
    chukwa_slow_hash_base(data, iterations, memory, threads) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isHex(data)) {
                throw new Error('Invalid data found');
            }
            return tryRunFunc('chukwa_slow_hash_base', data.toLowerCase(), iterations, memory, threads);
        });
    }
    /**
     * Calculates the hash of the data supplied using the chukwa_slow_hash_v1 method
     * @param data
     */
    chukwa_slow_hash_v1(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isHex(data)) {
                throw new Error('Invalid data found');
            }
            return tryRunFunc('chukwa_slow_hash_v1', data.toLowerCase());
        });
    }
    /**
     * Calculates the hash of the data supplied using the chukwa_slow_hash_v2 method
     * @param data
     */
    chukwa_slow_hash_v2(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isHex(data)) {
                throw new Error('Invalid data found');
            }
            return tryRunFunc('chukwa_slow_hash_v2', data.toLowerCase());
        });
    }
}
exports.Crypto = Crypto;
/**
 * @ignore
 */
function initialize() {
    if (moduleVars.crypto === null) {
        if (loadNativeAddon()) {
            return true;
        }
        if (loadBrowserWASM()) {
            return true;
        }
        if (loadWASMJS()) {
            return true;
        }
        return loadNativeJS();
    }
    else {
        return true;
    }
}
/**
 * @ignore
 */
function tryRunFunc(...args) {
    return __awaiter(this, void 0, void 0, function* () {
        function tryVectorStringToArray(vs) {
            if (vs instanceof moduleVars.crypto.VectorString) {
                const tmp = [];
                for (let i = 0; i < vs.size(); i++) {
                    tmp.push(vs.get(i));
                }
                return tmp;
            }
            else {
                return vs;
            }
        }
        const func = args.shift();
        return new Promise((resolve, reject) => {
            if (userCryptoFunctions[func]) {
                try {
                    return resolve(userCryptoFunctions[func](...args));
                }
                catch (e) {
                    return reject(new Error('Error with use defined cryptographic primitive'));
                }
            }
            else if (moduleVars.type === Interfaces_1.CryptoType.NODEADDON && moduleVars.crypto[func]) {
                /* If the function name starts with 'check' then it
                   will return a boolean which we can just send back
                   up the stack */
                if (func.indexOf('check') === 0) {
                    try {
                        return resolve(moduleVars.crypto[func](...args));
                    }
                    catch (e) {
                        return reject(new Error('Underlying cryptographic module failure'));
                    }
                }
                else {
                    try {
                        const [err, res] = moduleVars.crypto[func](...args);
                        if (err) {
                            return reject(err);
                        }
                        return resolve(res);
                    }
                    catch (e) {
                        return reject(new Error('Underlying cryptographic method failure'));
                    }
                }
            }
            else if (moduleVars.crypto[func]) {
                for (let i = 0; i < args.length; i++) {
                    if (Array.isArray(args[i])) {
                        args[i] = args[i].toVectorString();
                    }
                }
                try {
                    const res = moduleVars.crypto[func](...args);
                    if (typeof res !== 'object' || res instanceof moduleVars.crypto.VectorString) {
                        return resolve(tryVectorStringToArray(res));
                    }
                    else {
                        Object.keys(res).forEach((key) => {
                            res[key] = tryVectorStringToArray(res[key]);
                        });
                        return resolve(res);
                    }
                }
                catch (e) {
                    return reject(new Error('Underlying cryptographic method failure'));
                }
            }
            else {
                return reject(new Error('Could not locate method in underlying Cryptographic library'));
            }
        });
    });
}
/**
 * @ignore
 */
function loadBrowserWASM() {
    if (typeof window === 'undefined') {
        return false;
    }
    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const Self = window.WrkzCoinCrypto();
        if (Object.getOwnPropertyNames(Self).length === 0 ||
            typeof Self.cn_fast_hash === 'undefined') {
            return false;
        }
        moduleVars.crypto = Self;
        moduleVars.type = Interfaces_1.CryptoType.WASM;
        return true;
    }
    catch (e) {
        return false;
    }
}
/**
 * @ignore
 */
function loadNativeAddon() {
    try {
        const Self = require('bindings')('wrkzcoin-crypto.node');
        if (Object.getOwnPropertyNames(Self).length === 0 ||
            typeof Self.cn_fast_hash === 'undefined') {
            return false;
        }
        moduleVars.crypto = Self;
        moduleVars.type = Interfaces_1.CryptoType.NODEADDON;
        return true;
    }
    catch (e) {
        return false;
    }
}
/**
 * @ignore
 */
function loadNativeJS() {
    try {
        const Self = require('./wrkzcoin-crypto.js')();
        if (Object.getOwnPropertyNames(Self).length === 0 ||
            typeof Self.cn_fast_hash === 'undefined') {
            return false;
        }
        moduleVars.crypto = Self;
        moduleVars.type = Interfaces_1.CryptoType.JS;
        return true;
    }
    catch (e) {
        return false;
    }
}
/**
 * @ignore
 */
function loadWASMJS() {
    if (typeof window === 'undefined') {
        return false;
    }
    try {
        const Self = require('./wrkzcoin-crypto-wasm.js')();
        if (Object.getOwnPropertyNames(Self).length === 0) {
            return false;
        }
        moduleVars.crypto = Self;
        moduleVars.type = Interfaces_1.CryptoType.WASMJS;
        return true;
    }
    catch (e) {
        return false;
    }
}
/**
 * @ignore
 */
function isHex(value) {
    if (value.length % 2 !== 0) {
        return false;
    }
    const regex = new RegExp('^[0-9a-fA-F]{' + value.length + '}$');
    return regex.test(value);
}
/**
 * @ignore
 */
function isHex64(value) {
    return (isHex(value) && value.length === 64);
}
/**
 * @ignore
 */
function isHex128(value) {
    return (isHex(value) && value.length === 128);
}
/**
 * @ignore
 */
function isUInt(value) {
    return (value === toInt(value) && toInt(value) >= 0);
}
/**
 * @ignore
 */
function toInt(value) {
    if (typeof value === 'number') {
        return value;
    }
    else {
        const tmp = parseInt(value, 10);
        if (tmp.toString().length === value.toString().length) {
            return tmp;
        }
    }
    return false;
}
