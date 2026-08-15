/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["shared-types"],
  experimental: {
    serverComponentsExternalPackages: ["pg", "pg-native"],
  },
};

export default nextConfig;
