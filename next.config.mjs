/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "avatars.githubusercontent.com",
          },
          {
            protocol: "https",
            hostname: "lh3.googleusercontent.com",
          },
          {
            protocol: "https",
            hostname: "uploadthing.com",
          },
          {
            protocol: 'https',
            hostname: 'daama-app-document.s3.eu-north-1.amazonaws.com',
          },
        ],
      },
};

export default nextConfig;
