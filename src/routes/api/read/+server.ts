import { json, error } from '@sveltejs/kit';
import { Readability } from '@mozilla/readability';
import { parseHTML } from 'linkedom';
import DOMPurify from 'isomorphic-dompurify';
import type { RequestHandler } from './$types';

const MAX_BYTES = 3_000_000; // 3 MB cap
const FETCH_TIMEOUT_MS = 12_000;

const BLOCKED_HOSTS = [
  /^localhost$/i,
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^169\.254\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^\[?::1\]?$/,
  /\.internal$/i,
];

function assertSafeUrl(raw: string): URL {
  let u: URL;
  try { u = new URL(raw); } catch { throw error(400, 'Invalid URL'); }
  if (!/^https?:$/.test(u.protocol)) throw error(400, 'Only http(s) URLs are allowed');
  if (BLOCKED_HOSTS.some(r => r.test(u.hostname))) throw error(400, 'Host not allowed');
  return u;
}

export const GET: RequestHandler = async ({ url }) => {
  const target = url.searchParams.get('url');
  if (!target) throw error(400, 'Missing url');

  const parsed = assertSafeUrl(target);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(parsed.toString(), {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        // Identify ourselves honestly; many sites serve cleaner HTML to browsers.
        'User-Agent': 'Mozilla/5.0 (compatible; QuietReader/1.0; +https://quiet-reader.pages.dev)',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.8',
      },
    });
  } catch (e) {
    throw error(504, 'Could not reach that page');
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) throw error(res.status, `Upstream returned ${res.status}`);
  const ctype = res.headers.get('content-type') || '';
  if (!ctype.includes('text/html') && !ctype.includes('application/xhtml')) {
    throw error(415, 'URL does not point to an HTML page');
  }

  // Size guard
  const reader = res.body?.getReader();
  if (!reader) throw error(502, 'Empty response');
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_BYTES) { reader.cancel(); throw error(413, 'Page too large'); }
    chunks.push(value);
  }
  const html = new TextDecoder('utf-8').decode(
    chunks.reduce((a, b) => {
      const out = new Uint8Array(a.length + b.length);
      out.set(a); out.set(b, a.length); return out;
    }, new Uint8Array())
  );

  // Parse with Readability on a Workers-compatible DOM
  const { document } = parseHTML(html);
  // linkedom doesn't set a base URI by default; Readability needs it for absolute URLs
  Object.defineProperty(document, 'baseURI', { value: parsed.toString() });

  const article = new Readability(document as unknown as Document, {
    charThreshold: 300,
    keepClasses: false,
  }).parse();

  if (!article || !article.content) {
    throw error(422, 'Could not extract an article from this page');
  }

  // Sanitize
  const clean = DOMPurify.sanitize(article.content, {
    ALLOWED_TAGS: [
      'p','br','hr','h1','h2','h3','h4','h5','h6',
      'blockquote','pre','code','em','strong','i','b','u','s',
      'ul','ol','li','dl','dt','dd',
      'a','img','figure','figcaption','picture','source',
      'table','thead','tbody','tr','th','td','caption',
      'sup','sub','mark','time','abbr','cite','q','small',
    ],
    ALLOWED_ATTR: ['href','src','srcset','alt','title','width','height','datetime','cite','lang','dir'],
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|data:image\/)/i,
    FORBID_TAGS: ['script','style','iframe','form','input','button','object','embed','link','meta'],
  });

  return json({
    title: article.title ?? '',
    byline: article.byline ?? '',
    siteName: article.siteName ?? parsed.hostname,
    excerpt: article.excerpt ?? '',
    lang: article.lang ?? '',
    dir: article.dir ?? 'ltr',
    publishedTime: article.publishedTime ?? '',
    length: article.length ?? 0,
    url: parsed.toString(),
    content: clean,
  });
};
