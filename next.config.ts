/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io", // Whitelists UploadThing URLs
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", 
      }
    ],
  },
};

export default nextConfig;