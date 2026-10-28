// Signs control.json into lease.json (Ed25519). Runs in the Action every 12 h and on every change,
// so the beta copies keep renewing on their own. Key: secret LEASE_PRIVATE_KEY (PKCS#8 PEM).
import { createPrivateKey, sign } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

/** How long a lease is valid. The app runs offline at most this long after the last renewal. */
const LEASE_SECS = 2 * 24 * 3600;
/** Public id of a delivery (build-beta.sh prints it); the code itself is never published. */
const ID = /^[0-9a-f]{32}$/;

const control = JSON.parse(readFileSync('control.json', 'utf8'));
const fail = msg => { console.error(`control.json: ${msg}`); process.exit(1); };
if (typeof control.block_all !== 'boolean') fail('block_all must be true or false');
const builds = control.builds;
if (!builds || typeof builds !== 'object' || Array.isArray(builds)) fail('builds must be { "id": "note", ... }');
const ids = Object.keys(builds);
if (!ids.every(c => ID.test(c))) fail('each key in builds must be an id from build-beta.sh (32 hex digits), never a code');
if (ids.length > 256) fail('at most 256 builds');

const key = process.env.LEASE_PRIVATE_KEY;
if (!key) fail('secret LEASE_PRIVATE_KEY is missing');

const issued = Math.floor(Date.now() / 1000);
const payload = Buffer.from(JSON.stringify({ v: 2, issued, expires: issued + LEASE_SECS, all: control.block_all, builds: ids }));
const sig = sign(null, payload, createPrivateKey(key));
writeFileSync('lease.json', JSON.stringify({ payload: payload.toString('base64'), sig: sig.toString('base64') }) + '\n');
console.log(`lease.json signed: issued ${new Date(issued * 1000).toISOString()}, all=${control.block_all}, builds=[${ids}]`);
