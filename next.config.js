/** @type {import('next').NextConfig} */
const POSTS = ["./content/posts/**/*"];
const OG    = [...POSTS, "./assets/fonts/**/*"];

/** @type {Record<string, string>} Duplicate posts consolidated into the original. */
const consolidatedPosts = {
  "android-dependency-injection-hilt-koin-production-1791218810420": "android-dependency-injection-hilt-koin-production",
  "android-architecture-patterns-mvvm-clean-architecture-2025":     "android-architecture-patterns-beyond-mvvm",
  "custom-composables-jetpack-compose-reusable-ui":                 "android-custom-composables-reusable-ui-components",
  "multimodal-ai-android-app-audio-vision-text-integration":        "multimodal-ai-android-app-text-vision-integration",
  "ai-android-app-offline-inference-edge-deployment":               "on-device-ai-android-app-offline-inference",
};

const nextConfig = {
  experimental: {
    // Route handlers that read generated posts from disk at runtime.
    outputFileTracingIncludes: {
      "/api/cron/generate-post":      POSTS,
      "/api/cron/index-now":          POSTS,
      "/blog/[slug]/opengraph-image": OG,
      "/blog/[slug]/twitter-image":   OG,
    },
  },
  async redirects() {
    return [
      ...Object.entries(consolidatedPosts).map(([from, to]) => ({
        source:      `/blog/${from}`,
        destination: `/blog/${to}`,
        permanent:   true,
      })),
      {
        source:      "/:path*",
        has:         [{ type: "host", value: "itsaamir.dev" }],
        destination: "https://buildwithaamir.com/:path*",
        permanent:   true,
      },
      {
        source:      "/:path*",
        has:         [{ type: "host", value: "www.itsaamir.dev" }],
        destination: "https://buildwithaamir.com/:path*",
        permanent:   true,
      },
    ];
  },
};

module.exports = nextConfig;
