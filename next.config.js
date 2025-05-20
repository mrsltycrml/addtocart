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
      'www.savenearn.com.ph',
      'savenearn.com.ph',
      'picsum.photos',
      'images.unsplash.com',
      'cdn.shopify.com',
      'lh3.googleusercontent.com',
      'i.imgur.com',
      'res.cloudinary.com',
      // Add more domains as needed
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig; 