export function GET({ site }: { site: URL }) {
  const base = site.toString().replace(/\/$/, '');
  const body = import.meta.env.PUBLIC_NOINDEX === '1'
    ? `User-agent: *\nDisallow: /\n`
    : `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
