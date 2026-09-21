import DOMPurify from 'isomorphic-dompurify';

const ALLOWED_TAGS = [
  'p', 'br', 'hr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'blockquote', 'pre', 'code', 'em', 'strong', 'i', 'b', 'u', 's',
  'ul', 'ol', 'li', 'dl', 'dt', 'dd',
  'a', 'img', 'figure', 'figcaption', 'picture', 'source',
  'table', 'thead', 'tbody', 'tr', 'th', 'td', 'caption',
  'sup', 'sub', 'mark', 'time', 'abbr', 'cite', 'q', 'small',
];

const ALLOWED_ATTR = [
  'href', 'src', 'srcset', 'alt', 'title',
  'width', 'height', 'datetime', 'cite', 'lang', 'dir',
];

const FORBID_TAGS = [
  'script', 'style', 'iframe', 'form', 'input', 'button',
  'object', 'embed', 'link', 'meta', 'base', 'noscript',
];

/**
 * Sanitizes Readability output. Inline images (data:) are permitted
 * for `img.src`; everything else must be http(s) or mailto.
 */
export function sanitizeArticleHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|data:image\/)/i,
    FORBID_TAGS,
    // Strip everything not on the allowlist rather than keeping as text.
    KEEP_CONTENT: true,
    RETURN_TRUSTED_TYPE: false,
  });
}
