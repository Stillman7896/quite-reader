import { error } from '@sveltejs/kit';

export const MAX_BYTES = 3_000_000; // 3 MB
export const FETCH_TIMEOUT_MS = 12_000;

const USER_AGENT =
  'Mozilla/5.0 (compatible; QuietReader/1.0; +https://quiet-reader.pages.dev)';

export interface FetchedPage {
  html: string;
  finalUrl: string;
  contentType: string;
}

/**
 * Server-side fetch with:
 *  - timeout via AbortController
 *  - streaming size cap
 *  - content-type validation
 *  - honest User-Agent
 *  - redirect following (fetch default), final URL captured for relative-URL resolution
 */
export async function fetchArticle(target: URL): Promise<FetchedPage> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(target.toString(), {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.8',
      },
    });
  } catch {
    clearTimeout(timer);
    throw error(504, 'Could not reach that page');
  }

  if (!res.ok) {
    clearTimeout(timer);
    throw error(res.status, `Upstream returned ${res.status}`);
  }

  const contentType = res.headers.get('content-type') ?? '';
  if (!contentType.includes('text/html') && !contentType.includes('application/xhtml')) {
    clearTimeout(timer);
    throw error(415, 'URL does not point to an HTML page');
  }

  const reader = res.body?.getReader();
  if (!reader) {
    clearTimeout(timer);
    throw error(502, 'Empty response');
  }

  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_BYTES) {
        reader.cancel().catch(() => {});
        throw error(413, 'Page too large');
      }
      chunks.push(value);
    }
  } finally {
    clearTimeout(timer);
  }

  // Concatenate without Buffer (Workers-safe)
  const merged = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    merged.set(c, offset);
    offset += c.byteLength;
  }

  const html = new TextDecoder('utf-8').decode(merged);
  const finalUrl = res.url || target.toString();

  return { html, finalUrl, contentType };
}
