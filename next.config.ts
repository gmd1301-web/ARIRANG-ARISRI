import type { NextConfig } from 'next';

const isGithubPages = process.env.GITHUB_PAGES === 'true';
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const pagesBasePath = isGithubPages && repositoryName && !repositoryName.endsWith('.github.io') ? `/${repositoryName}` : '';
const nextConfig: NextConfig = {
  output: isGithubPages ? 'export' : undefined,
  trailingSlash: isGithubPages,
  basePath: pagesBasePath,
  assetPrefix: pagesBasePath,
};

export default nextConfig;

