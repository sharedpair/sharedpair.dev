import releaseData from '../data/generated/release-registry.json';

export const prerender = true;
const escapeXml = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
const rfc2822 = (value: string) => new Date(value).toUTCString();

export function GET() {
  const apps = releaseData.packages.filter((row) => row.kind === 'application').sort((a, b) => b.updatedAt!.localeCompare(a.updatedAt!));
  const items = apps.map((app) => {
    const link = `https://sharedpair.dev/applications/${app.slug}/`;
    const description = `${app.description} Package ${app.version}; ${app.runtime}; lifecycle state: ${app.state}.`;
    return `    <item>
      <title>${escapeXml(`${app.name} — ${app.state}`)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${rfc2822(app.updatedAt!)}</pubDate>
      <description>${escapeXml(description)}</description>
    </item>`;
  }).join('\n');
  const latest = apps.map((app) => app.updatedAt!).sort().at(-1)!;
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Shared Pair applications</title>
    <link>https://sharedpair.dev/</link>
    <description>Verified and published applications using versioned Shared Pair Electron runtimes.</description>
    <language>en-us</language>
    <lastBuildDate>${rfc2822(latest)}</lastBuildDate>
    <atom:link href="https://sharedpair.dev/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
