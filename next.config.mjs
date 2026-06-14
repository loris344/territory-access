/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Linting is run separately; don't block production builds on lint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    // Remote expedition / hero images are served from Supabase storage and
    // rendered with plain <img> tags, but allow next/image too if ever used.
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
};

export default nextConfig;
