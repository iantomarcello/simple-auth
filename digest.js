/**
 * Generates a simple hash.
 * @xample `node digest "username|password"`
 */

export {};

const args = process.argv.slice(2);

async function digest(cred) {
  const hashBuffer = await crypto.subtle.digest(
    { name: 'SHA-512' },
    new TextEncoder().encode(cred),
  );
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

console.log(await digest(args[0]));
