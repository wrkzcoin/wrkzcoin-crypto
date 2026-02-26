// Copyright (c) 2018-2020, The TurtleCoin Developers
//
// Please see the included LICENSE file for more information.

'use strict';

const Crypto = require('../').Crypto;
const WrkzCoinCrypto = new Crypto();
const iterations = process.env.BENCHMARK_ITERATIONS || 10000;
const timer = require('perf_hooks').performance;

function runTest (title, func, iters) {
    iters = iters || iterations;
    if (iters === iterations &&
        title.indexOf('slow') !== -1) { iters = iters / 1000; }
    const a = timer.now();
    for (var i = 0; i < iters; i++) {
        func();
    }
    const b = timer.now();
    const ms = (b - a) / iters;
    const ops = 1000 / ms;

    console.log('%s: %sms\t[%s/s]',
        title
            .padEnd(22, ' '),
        ms.toFixed(2)
            .padStart(10, ' '),
        ops.toFixed(2)
            .padStart(10, ' ')
    );
}

console.log('');
console.log('Starting core crypto benchmarks...');
console.log('');

runTest('cn_fast_hash', () => WrkzCoinCrypto.cn_fast_hash('00000000'));

runTest('secretKeyToPublicKey',
    () => WrkzCoinCrypto.secretKeyToPublicKey(
        '9e401f727e5327080b2db6266e782356738e1eb828f39191f97771a4e401e101'
    )
);

runTest(
    'generateKeyDerivation',
    () => WrkzCoinCrypto.generateKeyDerivation(
        '3b0cc2b066812e6b9fcc42a797dc3c723a7344b604fd4be0b22e06254ff57f94',
        '6968a0b8f744ec4b8cea5ec124a1b4bd1626a2e6f31e999f8adbab52c4dfa909'
    ),
    100
);

runTest('derivePublicKey',
    () => WrkzCoinCrypto.derivePublicKey(
        '4827dbde0c0994c0979e2f9c046825bb4a065b6e35cabc0290ff5216af060c20',
        2,
        '854a637b2863af9e8e8216eb2382f3d16616b3ac3e53d0976fbd6f8da6c56418'
    ),
    100
);

runTest('underivePublicKey',
    () => WrkzCoinCrypto.underivePublicKey(
        '4827dbde0c0994c0979e2f9c046825bb4a065b6e35cabc0290ff5216af060c20',
        2,
        'bb55bef919d1c9f74b5b52a8a6995a1dc4af4c0bb8824f5dc889012bc748173d'
    ),
    100
);

runTest('deriveSecretKey',
    () => WrkzCoinCrypto.deriveSecretKey(
        '4827dbde0c0994c0979e2f9c046825bb4a065b6e35cabc0290ff5216af060c20',
        2,
        'd9d555a892a85f64916cae1a168bd3f7f400b6471c7b12b438b599601298210b'
    ),
    100
);

runTest('generateKeyImage',
    () => WrkzCoinCrypto.generateKeyImage(
        'bb55bef919d1c9f74b5b52a8a6995a1dc4af4c0bb8824f5dc889012bc748173d',
        'e52ece5717f01843e3accc4df651d669e339c31eb8059145e881faae19ad4a0e'
    ),
    100
);

console.log('');
