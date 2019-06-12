/* eslint-disable */
// (C)2018 ModusBox Inc.

const chance = new require('chance')();

const Config = require('./config.js');
const TlsResolver = require('./tlsResolver.js');

let config = new Config();

console.log('Starting pathfinder TLS test...');

let resolver = new TlsResolver(config, () => {});

(async function() {

    await resolver.connect();

    let results = await Promise.all(
        // chance also supports { country: 'fr', mobile: true }
        // current documentation: https://chancejs.com/location/phone.html
        Array.from({ length: 2000 }, chance.phone.bind(chance, { country: 'uk', mobile: true }))
             .map((el, i) => new Promise((resolve, reject) => {
                 setTimeout(async () => {
                     console.log(`pf query ${i} with ${el}`);
                     const result = await resolver.query(el);
                     console.log('result', result);
                     resolve();
                 }, i * 100);
             }))
    );

    resolver.destroy();
    console.log('Test complete.');

})();
