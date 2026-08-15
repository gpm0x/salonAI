/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["shared-types"],
  serverExternalPackages: ["pg", "pg-native"],
};

export default nextConfig;
