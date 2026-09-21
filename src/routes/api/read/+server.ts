import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { assertSafeUrl } from '$lib/server/url';
import { fetchArticle } from '$lib/server/fetchArticle';
import { parseArticle } from '$lib/server/parseArticle';
import { sanitizeArticleHtml } from '$lib/server/sanitize';
import type { Article } from '$lib/types';

export const GET: RequestHandler = async ({ url }) => {
  const target = url.searchParams.get('url');
  if (!target) throw error(400, 'Missing url');

  // 1. Validate & SSRF-guard
  const parsed = assertSafeUrl(target);

  // 2. Fetch the page server-side (client never touches the target)
  const { html, finalUrl } = await fetchArticle(parsed);

  // 3. Extract the article with Readability
  const raw = parseArticle(html, finalUrl);
  if (!raw) throw error(422, 'Could not extract an article from this page');

  // 4. Sanitize the HTML before it ever leaves the server
  const content = sanitizeArticleHtml(raw.content);

  // 5. Shape the response
  const payload: Article = {
    title: raw.title,
    byline: raw.byline,
    siteName: raw.siteName || parsed.hostname,
    excerpt: raw.excerpt,
    lang: raw.lang,
    dir: raw.dir,
    publishedTime: raw.publishedTime,
    length: raw.length,
    url: finalUrl,
    content,
  };

  return json(payload);
};
