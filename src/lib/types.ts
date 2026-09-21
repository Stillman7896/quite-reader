export interface Article {
  title: string;
  byline: string;
  siteName: string;
  excerpt: string;
  lang: string;
  dir: string;
  publishedTime: string;
  length: number;
  url: string;
  content: string; // sanitized HTML
}
