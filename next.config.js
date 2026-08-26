/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: '/', destination: '/deck.html' },
    ];
  },
};

module.exports = nextConfig;
