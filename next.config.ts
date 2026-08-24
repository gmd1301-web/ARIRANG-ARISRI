import type { NextConfig } from 'next';

const isGithubPages = process.env.GITHUB_PAGES === 'true';
const nextConfig: NextConfig = {
  output: isGithubPages ? 'export' : undefined,
  trailingSlash: isGithubPages,
};

export default nextConfig;
