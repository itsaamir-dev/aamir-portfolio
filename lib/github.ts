import "server-only";

// Minimal GitHub contents API client used by the blog cron to commit posts.
// Pushing to the production branch triggers a Vercel deployment.

const REPO   = process.env.GITHUB_REPO   ?? "itsaamir-dev/aamir-portfolio";
const BRANCH = process.env.GITHUB_BRANCH ?? "main";

function headers() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN is not set.");
  return {
    Authorization:          `Bearer ${token}`,
    Accept:                 "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

/** File names in a repo directory on the production branch ([] if it doesn't exist). */
export async function listDir(dir: string): Promise<string[]> {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${dir}?ref=${BRANCH}`, {
    headers: headers(), cache: "no-store",
  });
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`GitHub list ${dir} failed: ${res.status} ${await res.text()}`);
  const items = (await res.json()) as { name: string; type: string }[];
  return items.filter(i => i.type === "file").map(i => i.name);
}

/** Creates a new file in one commit. Fails if the file already exists. */
export async function createFile(path: string, content: string, message: string): Promise<string> {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
    method:  "PUT",
    headers: { ...headers(), "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      branch:  BRANCH,
      content: Buffer.from(content, "utf8").toString("base64"),
      committer: { name: "Build With Aamir Bot", email: "aamirbashir.ahangar@gmail.com" },
    }),
  });
  if (!res.ok) throw new Error(`GitHub commit ${path} failed: ${res.status} ${await res.text()}`);
  const data = (await res.json()) as { commit: { html_url: string } };
  return data.commit.html_url;
}
