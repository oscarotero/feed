import { JsonFeed, serve } from "./deps.ts";
import heydesigner from "./heydesigner.ts";
import godly from "./godly.ts";

const routes = new Map<string, () => Promise<JsonFeed>>([
  ["/heydesigner", heydesigner],
  ["/godly", godly],
]);

serve(async (request) => {
  const { pathname } = new URL(request.url);

  for (const [route, handler] of routes) {
    if (pathname.startsWith(route)) {
      const feed = await handler();

      return new Response(JSON.stringify(feed), {
        headers: {
          "content-type": "application/rss+xml;charset=UTF-8",
        },
      });
    }
  }

  return new Response("Not found", { status: 404 });
}, { port: 8080 });

console.log("Listening on http://localhost:8080");
