const REDIRECT_BASE =
  process.env.NEXT_PUBLIC_REDIRECT_URL?.replace(/\/$/, "") ??
  "http://localhost:8000/r";

export const getShortUrl = (slug: string): string =>
  `${REDIRECT_BASE}/${slug}`;
