/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@salon/shared-types"],
  // `pg` é usado só no server (Better Auth) — não deve ser empacotado pelo bundler.
  serverExternalPackages: ["pg", "pg-native"],
};

export default nextConfig;
