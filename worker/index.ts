import candidateData from "../src/data/application-candidates.json";

interface VoteStorage {
  get<T>(key: string): Promise<T | undefined>;
  put(key: string, value: unknown): Promise<void>;
}

interface VoteObjectState {
  storage: VoteStorage;
}

interface VoteObjectStub {
  fetch(request: Request): Promise<Response>;
}

interface VoteObjectNamespace {
  idFromName(name: string): unknown;
  get(id: unknown): VoteObjectStub;
}

interface R2ObjectBody {
  body: ReadableStream;
  httpEtag: string;
  writeHttpMetadata(headers: Headers): void;
}

interface R2Bucket {
  get(key: string): Promise<R2ObjectBody | null>;
}

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  VOTE_COUNTER: VoteObjectNamespace;
  APT_REPO: R2Bucket;
}

const APEX_HOST = "sharedpair.dev";
const WWW_HOST = "www.sharedpair.dev";
const APT_HOST = "apt.sharedpair.dev";
const VOTE_KEY = "candidate-vote-counts-v1";
const candidateSlugs = new Set(candidateData.candidates.filter((candidate) => candidate.audit?.state === "viable").map((candidate) => candidate.slug));

function json(body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
}

export class VoteCounter {
  constructor(private state: VoteObjectState) {}

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const counts = await this.state.storage.get<Record<string, number>>(VOTE_KEY) ?? {};
    if (request.method === "GET") return json({ counts });
    if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
    const slug = url.pathname.slice(1);
    if (!candidateSlugs.has(slug)) return json({ error: "Unknown candidate" }, 404);
    counts[slug] = Math.min((counts[slug] ?? 0) + 1, Number.MAX_SAFE_INTEGER);
    await this.state.storage.put(VOTE_KEY, counts);
    return json({ slug, count: counts[slug] });
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.hostname === APT_HOST) {
      if (request.method !== "GET" && request.method !== "HEAD") return new Response("Method not allowed\n", { status: 405 });
      const path = decodeURIComponent(url.pathname.slice(1));
      const key = url.pathname.endsWith("/") ? `${path}index.html` : path;
      const object = await env.APT_REPO.get(key);
      if (!object) return new Response("Not found\n", { status: 404 });
      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set("ETag", object.httpEtag);
      headers.set("X-Content-Type-Options", "nosniff");
      return new Response(request.method === "HEAD" ? null : object.body, { headers });
    }

    if (url.hostname === WWW_HOST) {
      url.hostname = APEX_HOST;
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname === "/api/votes") {
      if (request.method !== "GET") return json({ error: "Method not allowed" }, 405);
      const counter = env.VOTE_COUNTER.get(env.VOTE_COUNTER.idFromName("global"));
      return counter.fetch(new Request("https://votes.internal/", { method: "GET" }));
    }

    const vote = url.pathname.match(/^\/api\/votes\/([a-z0-9-]+)$/);
    if (vote) {
      if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
      const origin = request.headers.get("Origin");
      if (origin && new URL(origin).hostname !== APEX_HOST) return json({ error: "Origin not allowed" }, 403);
      const slug = vote[1];
      if (!candidateSlugs.has(slug)) return json({ error: "Unknown candidate" }, 404);
      const counter = env.VOTE_COUNTER.get(env.VOTE_COUNTER.idFromName("global"));
      return counter.fetch(new Request(`https://votes.internal/${slug}`, { method: "POST" }));
    }

    if (url.pathname === "/reports" || url.pathname === "/reports/") {
      url.pathname = "/runtimes/";
      url.hash = "technical-notes";
      return Response.redirect(url.toString(), 301);
    }

    const legacyReport = url.pathname.match(/^\/reports\/([^/]+)\/?$/);
    if (legacyReport) {
      url.pathname = `/runtimes/${legacyReport[1]}/`;
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};
