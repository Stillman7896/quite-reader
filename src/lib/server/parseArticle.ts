import { Readability } from '@mozilla/readability';
import { parseHTML } from 'linkedom';

export interface ParsedArticle {
  title: string;
  byline: string;
  siteName: string;
  excerpt: string;
  lang: string;
  dir: string;
  publishedTime: string;
  length: number;
  content: string; // RAW HTML — sanitize before sending to client
}

/**
 * Parses raw HTML with Mozilla Readability on a Workers-compatible DOM.
 *
 * `baseUrl` should be the *final* URL after redirects, so Readability can
 * resolve relative image/link URLs correctly.
 */
export function parseArticle(html: string, baseUrl: string): ParsedArticle | null {
  const { document } = parseHTML(html);

  // linkedom does not set baseURI by default; Readability needs it for
  // converting relative URLs to absolute.
  Object.defineProperty(document, 'baseURI', {
    value: baseUrl,
    configurable: true,
  });

  const article = new Readability(document as unknown as Document, {
    charThreshold: 300,
    keepClasses: false,
    // Readability's default video regex is fine; leave unset.
  }).parse();

  if (!article || !article.content) return null;

  return {
    title: article.title ?? '',
    byline: article.byline ?? '',
    siteName: article.siteName ?? '',
    excerpt: article.excerpt ?? '',
    lang: article.lang ?? '',
    dir: article.dir ?? 'ltr',
    publishedTime: article.publishedTime ?? '',
    length: article.length ?? 0,
    content: article.content,
  };
}
