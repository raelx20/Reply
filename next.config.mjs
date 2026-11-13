/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // GitHub Pages project site — served at https://raelx20.github.io/Reply/
  basePath: process.env.GITHUB_PAGES === 'true' ? '/Reply' : undefined,
};

export default nextConfig;
