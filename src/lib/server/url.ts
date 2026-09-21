import { error } from '@sveltejs/kit';

const BLOCKED_HOSTS = [
  /^localhost$/i,
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^169\.254\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^\[?::1\]?$/,
  /^0\./,
  /\.internal$/i,
  /\.local$/i,
];

const BLOCKED_PORTS = new Set([
  // Common internal services
  22, 23, 25, 53, 110, 135, 139, 143, 445, 1433, 1521, 3306, 3389, 5432, 5900, 6379, 9200, 11211,
]);

/**
 * Validates a raw URL string and returns a safe URL object.
 * Throws a SvelteKit `error(400)` if the URL is malformed or unsafe.
 */
export function assertSafeUrl(raw: string): URL {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    throw error(400, 'Invalid URL');
  }

  if (!/^https?:$/.test(u.protocol)) {
    throw error(400, 'Only http(s) URLs are allowed');
  }

  if (BLOCKED_HOSTS.some((r) => r.test(u.hostname))) {
    throw error(400, 'Host not allowed');
  }

  // If a port is explicitly specified and it's not a standard web port, block it.
  if (u.port) {
    const port = Number(u.port);
    if (BLOCKED_PORTS.has(port)) throw error(400, 'Port not allowed');
  }

  // Reject URLs with credentials
  if (u.username || u.password) {
    throw error(400, 'Credentials in URL are not allowed');
  }

  return u;
}
