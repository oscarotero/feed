import { serve } from "https://deno.land/std@0.117.0/http/server.ts";
import heydesigner from "./heydesigner.ts";

serve(async (request) => {
  const { pathname } = new URL(request.url);
  if (pathname.startsWith("/heydesigner")) {
    const feed = await heydesigner();

    return new Response(JSON.stringify(feed), {
      headers: {
        "content-type": "application/rss+xml;charset=UTF-8",
      },
    });
  }

  return new Response("Not found", { status: 404 });
}, { addr: ":8080" });

console.log("Listening on http://localhost:8080");
