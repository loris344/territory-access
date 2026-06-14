/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export so the site can be served by GitHub Pages (no Node server).
  output: "export",
  // GitHub Pages serves directories, so emit /route/index.html for each page.
  trailingSlash: true,
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // next/image optimization is unavailable on a static host.
    unoptimized: true,
  },
};

export default nextConfig;
