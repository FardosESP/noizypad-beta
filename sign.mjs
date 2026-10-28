// Signs control.json into lease.json (Ed25519). Runs in the Action every 12 h and on every change,
// so the beta copies keep renewing on their own. Key: secret LEASE_PRIVATE_KEY (PKCS#8 PEM).
import { createPrivateKey, sign } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

/** How long a lease is valid. The app runs offline at most this long after the last renewal. */
const LEASE_SECS = 2 * 24 * 3600;
/** Delivery code baked into each exe by build-beta.sh. */
const CODE = /^[a-z0-9]{6,32}$/;

const control = JSON.parse(readFileSync('control.json', 'utf8'));
const fail = msg => { console.error(`control.json: ${msg}`); process.exit(1); };
if (typeof control.block_all !== 'boolean') fail('block_all must be true or false');
const builds = control.builds;
if (!builds || typeof builds !== 'object' || Array.isArray(builds)) fail('builds must be { "code": "note", ... }');
const codes = Object.keys(builds);
if (!codes.every(c => CODE.test(c))) fail('each code in builds must be 6 to 32 lowercase letters or digits');
if (codes.length > 256) fail('at most 256 builds');

const key = process.env.LEASE_PRIVATE_KEY;
if (!key) fail('secret LEASE_PRIVATE_KEY is missing');

const issued = Math.floor(Date.now() / 1000);
const payload = Buffer.from(JSON.stringify({ v: 1, issued, expires: issued + LEASE_SECS, all: control.block_all, builds: codes }));
const sig = sign(null, payload, createPrivateKey(key));
writeFileSync('lease.json', JSON.stringify({ payload: payload.toString('base64'), sig: sig.toString('base64') }) + '\n');
console.log(`lease.json signed: issued ${new Date(issued * 1000).toISOString()}, all=${control.block_all}, builds=[${codes}]`);
