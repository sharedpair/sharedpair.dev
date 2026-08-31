interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

const APEX_HOST = "sharedpair.dev";
const WWW_HOST = "www.sharedpair.dev";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.hostname === WWW_HOST) {
      url.hostname = APEX_HOST;
      return Response.redirect(url.toString(), 301);
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
