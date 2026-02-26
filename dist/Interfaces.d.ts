/**
 * KeyPair object for holding privateKey and publicKey pairs
 */
export interface IKeyPair {
    /**
     * The private key
     */
    private_key: string;
    /**
     * The public key
     */
    public_key: string;
}
/**
 * A PreparedRingSignatures object for holding prepared signatures and the random scalar (k)
 */
export interface IPreparedRingSignatures {
    /**
     * The ring signatures
     */
    signatures: string[];
    /**
     * The random scalar key (k) for the signatures
     */
    k: string;
}
/**
 * Represents the type of underlying cryptographic methods
 */
export declare enum CryptoType {
    UNKNOWN = 0,
    NODEADDON = 1,
    WASM = 2,
    WASMJS = 3,
    JS = 4,
    MIXED = 5,
    EXTERNAL = 6
}
/** @ignore */
export interface IModuleSettings {
    crypto: any;
    type: CryptoType;
}
/**
 * An interface that defines all of the cryptographic methods that a user
 * can override by using external cryptography but still using this library
 */
export interface ICryptoConfig {
    calculateMultisigPrivateKeys?: (private_spend_key: string, public_keys: string[]) => Promise<string[]>;
    calculateSharedPrivateKey?: (private_keys: string[]) => Promise<string>;
    calculateSharedPublicKey?: (public_keys: string[]) => Promise<string>;
    checkKey?: (public_key: string) => Promise<boolean>;
    checkRingSignatures?: (prefix_hash: string, key_image: string, input_keys: string[], signatures: string[]) => Promise<boolean>;
    checkScalar?: (private_key: string) => Promise<boolean>;
    checkSignature?: (message_digest: string, public_key: string, signature: string) => Promise<boolean>;
    cn_fast_hash?: (input_data: string) => Promise<string>;
    completeRingSignatures?: (private_ephemeral: string, real_output_index: number, k: string, signatures: string[]) => Promise<string[]>;
    derivationToScalar?: (derivation: string, output_index: number) => Promise<string>;
    derivePublicKey?: (derivation: string, output_index: number, public_key: string) => Promise<string>;
    deriveSecretKey?: (derivation: string, output_index: number, private_key: string) => Promise<string>;
    generateDeterministicSubwalletKeys?: (private_key: string, wallet_index: number) => Promise<IKeyPair>;
    generateKeyDerivation?: (public_key: string, private_key: string) => Promise<string>;
    generateKeyDerivationScalar?: (public_key: string, private_key: string, output_index: number) => Promise<string>;
    generateKeyImage?: (public_ephemeral: string, private_ephemeral: string) => Promise<string>;
    generateKeys?: () => Promise<IKeyPair>;
    generatePartialSigningKey?: (signature: string, private_key: string) => Promise<string>;
    generatePrivateViewKeyFromPrivateSpendKey?: (private_key: string) => Promise<string>;
    generateRingSignatures?: (prefix_hash: string, key_image: string, public_keys: string[], private_ephemeral: string, real_output_index: number) => Promise<string[]>;
    generateSignature?: (message_digest: string, public_key: string, private_key: string) => Promise<string>;
    generateViewKeysFromPrivateSpendKey?: (private_key: string) => Promise<IKeyPair>;
    hashToEllipticCurve?: (data: string) => Promise<string>;
    hashToScalar?: (data: string) => Promise<string>;
    prepareRingSignatures?: (prefix_hash: string, key_image: string, public_keys: string[], real_output_index: number, k?: string) => Promise<IPreparedRingSignatures>;
    restoreKeyImage?: (public_ephemeral: string, derivation: string, output_index: number, partial_key_images: string[]) => Promise<string>;
    restoreRingSignatures?: (derivation: string, output_index: number, partial_signing_keys: string[], real_output_index: number, k: string, signatures: string[]) => Promise<string[]>;
    scalarDerivePublicKey?: (derivation_scalar: string, public_key: string) => Promise<string>;
    scalarDeriveSecretKey?: (derivation_scalar: string, private_key: string) => Promise<string>;
    scalarmultKey?: (key_image_a: string, key_image_b: string) => Promise<string>;
    scReduce32?: (data: string) => Promise<string>;
    secretKeyToPublicKey?: (private_key: string) => Promise<string>;
    tree_branch?: (hashes: string[]) => Promise<string[]>;
    tree_depth?: (count: number) => Promise<number>;
    tree_hash?: (hashes: string[]) => Promise<string>;
    tree_hash_from_branch?: (branches: string[], leaf: string, path: number) => Promise<string>;
    underivePublicKey?: (derivation: string, output_index: number, output_key: string) => Promise<string>;
    cn_slow_hash_v0?: (data: string) => Promise<string>;
    cn_slow_hash_v1?: (data: string) => Promise<string>;
    cn_slow_hash_v2?: (data: string) => Promise<string>;
    cn_lite_slow_hash_v0?: (data: string) => Promise<string>;
    cn_lite_slow_hash_v1?: (data: string) => Promise<string>;
    cn_lite_slow_hash_v2?: (data: string) => Promise<string>;
    cn_dark_slow_hash_v0?: (data: string) => Promise<string>;
    cn_dark_slow_hash_v1?: (data: string) => Promise<string>;
    cn_dark_slow_hash_v2?: (data: string) => Promise<string>;
    cn_dark_lite_slow_hash_v0?: (data: string) => Promise<string>;
    cn_dark_lite_slow_hash_v1?: (data: string) => Promise<string>;
    cn_dark_lite_slow_hash_v2?: (data: string) => Promise<string>;
    cn_turtle_slow_hash_v0?: (data: string) => Promise<string>;
    cn_turtle_slow_hash_v1?: (data: string) => Promise<string>;
    cn_turtle_slow_hash_v2?: (data: string) => Promise<string>;
    cn_turtle_lite_slow_hash_v0?: (data: string) => Promise<string>;
    cn_turtle_lite_slow_hash_v1?: (data: string) => Promise<string>;
    cn_turtle_lite_slow_hash_v2?: (data: string) => Promise<string>;
    cn_upx?: (data: string) => Promise<string>;
    cn_soft_shell_slow_hash_v0?: (data: string, height: number) => Promise<string>;
    cn_soft_shell_slow_hash_v1?: (data: string, height: number) => Promise<string>;
    cn_soft_shell_slow_hash_v2?: (data: string, height: number) => Promise<string>;
    chukwa_slow_hash?: (data: string, version?: number) => Promise<string>;
    chukwa_slow_hash_base?: (data: string, iterations: number, memory: number, threads: number) => Promise<string>;
    chukwa_slow_hash_v1?: (data: string) => Promise<string>;
    chukwa_slow_hash_v2?: (data: string) => Promise<string>;
    generateTransactionPow?: (serializedTransaction: string, nonceOffset: number, diff: number) => Promise<number>;
    [key: string]: any;
}
