/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  headers() {
    return [
      {
        source: "/:all*(svg|jpg|png|json)",
        locale: false,
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, stale-while-revalidate",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
