// If you see a Next.js image domain error, add the domain here and restart your server.
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'ik.imagekit.io',
      'placehold.co',
      'ecommerce.datablitz.com.ph',
      'dynaquestpc.com',
      'www.amd.com',
      'storage-asset.msi.com',
      'm.media-amazon.com',
      'www.techstoreltd.com',
      // Add more domains as needed
    ],
  },
};

module.exports = nextConfig; 