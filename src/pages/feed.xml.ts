import { progress } from '../data/project';

export const prerender = true;

const escapeXml = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

export function GET() {
  const entries = progress.map((item, index) => `
  <entry>
    <id>https://sharedpair.dev/#project-feed-${item.date}-${index}</id>
    <title>${escapeXml(`${item.state === 'next' ? 'Next' : 'Shipped'}: ${item.entry}`)}</title>
    <updated>${item.date}T12:00:00Z</updated>
    <link href="https://sharedpair.dev/#project-feed" />
    <content type="text">${escapeXml(item.entry)}</content>
    <category term="${item.state}" />
  </entry>`).join('');

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>https://sharedpair.dev/feed.xml</id>
  <title>Shared Pair project feed</title>
  <updated>${progress[0].date}T12:00:00Z</updated>
  <link href="https://sharedpair.dev/" />
  <link href="https://sharedpair.dev/feed.xml" rel="self" type="application/atom+xml" />${entries}
</feed>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' } });
}
