# Generated blog posts

One JSON file per post, written by the `/api/cron/generate-post` Vercel cron
(see `lib/blog-generator.ts`). Each file matches the `BlogPost` type in
`lib/data.ts` plus an ISO `publishedAt` field. Files are read at build time by
`lib/posts.ts` and merged with the posts in `lib/data.ts`.

To remove a post, delete its file. To fix a typo, edit the JSON and push.
