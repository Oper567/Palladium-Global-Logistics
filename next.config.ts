/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // 1. Fixes your terminal warning
    qualities: [25, 50, 75, 90, 100], 
    
    // 2. Production Security Guardrail: Allows Next.js to optimize images from these specific external servers
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io', // This is UploadThing's image server
      }
    ],
  },
};

export default nextConfig;