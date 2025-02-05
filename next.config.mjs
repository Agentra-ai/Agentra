/** @type {import('next').NextConfig} */
import crypto from "node:crypto"
globalThis.crypto ??= crypto.webcrypto

const nextConfig = {
  webpack: (config, { webpack }) => {
    config.externals.push("@node-rs/argon2", "@node-rs/bcrypt");
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
};

export default nextConfig;

