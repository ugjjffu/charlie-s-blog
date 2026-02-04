/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow reading .md files from the filesystem at build time
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: "raw-loader",
    });
    return config;
  },
};

module.exports = nextConfig;
