import { JsonFeed, parseFeed } from "./deps.ts";

export default async function getFeed(): Promise<JsonFeed> {
  const response = await fetch("https://heydesigner.com/feed/");
  const xml = await response.text();
  const feed = await parseFeed(xml);

  const jsonFeed: JsonFeed = {
    version: "https://jsonfeed.org/version/1",
    title: feed.title?.value || "",
    "home_page_url": feed.links[0],
    "feed_url": "https://heydesigner.com/feed/",
    description: feed.description,
    items: [],
  };

  const items = await Promise.all(feed.entries.map(async (entry) => {
    const response = await fetch(entry.id);
    const html = await response.text();
    const match = html.match(/a href="([^"]+)\?ref=heydesigner"/);

    if (match) {
      const [, url] = match;

      return {
        id: entry.id,
        url: url,
        title: entry.title?.value,
        summary: entry.description?.value,
        content_html: entry.description?.value,
        content_text: entry.description?.value,
        date_published: entry.publishedRaw,
      };
    }
  }));

  // @ts-ignore: pasa de todo, tio
  jsonFeed.items = items.filter((item) => item);

  return jsonFeed;
}

if (import.meta.main) {
  console.log(JSON.stringify(await getFeed(), null, 2));
}
