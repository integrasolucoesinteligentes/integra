export function GET({ site }: { site: URL }) {
  const base = site.toString().replace(/\/$/, '');
  const isPreview = !!process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production';
  const body = isPreview
    ? `User-agent: *\nDisallow: /\n`
    : `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
