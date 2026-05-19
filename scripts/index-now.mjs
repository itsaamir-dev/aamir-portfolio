/**
 * Submits all site URLs to IndexNow (Bing, Yandex, and others).
 * Run after each deploy: npm run index-now
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://itsaamir.dev";
const KEY      = "a8f3d9c2e5b7a1d4c6e8f2b9a3d5c7e1";
const HOST     = new URL(SITE_URL).hostname;

async function getUrlsFromSitemap() {
  const res  = await fetch(`${SITE_URL}/sitemap.xml`);
  const text = await res.text();
  return [...text.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
}

async function submitToIndexNow(urls) {
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method:  "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host:        HOST,
      key:         KEY,
      keyLocation: `${SITE_URL}/${KEY}.txt`,
      urlList:     urls,
    }),
  });
  return res.status;
}

const urls = await getUrlsFromSitemap();
console.log(`Submitting ${urls.length} URLs to IndexNow...`);
urls.forEach(u => console.log(" -", u));

const status = await submitToIndexNow(urls);

if (status === 200 || status === 202) {
  console.log(`\nDone. Status: ${status} — URLs queued for indexing.`);
} else {
  console.error(`\nFailed. HTTP ${status}`);
  process.exit(1);
}
