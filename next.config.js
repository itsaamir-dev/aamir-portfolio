/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
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
