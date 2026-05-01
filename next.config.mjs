/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
  async redirects() {
    return [
      {
        source: "/features",
        destination: "/diagnosis",
        permanent: false,
      },
      {
        source: "/pricing",
        destination: "/contact",
        permanent: false,
      },
      {
        source: "/workspace/:path*",
        destination: "/diagnosis",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
