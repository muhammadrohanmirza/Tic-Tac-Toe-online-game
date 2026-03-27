/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  webpack: (config) => {
    config.externals.push("@neondatabase/serverless");
    return config;
  },
};

export default nextConfig;
