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
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Ensure dependencies are properly transpiled
  transpilePackages: ['framer-motion'],
  // Tell webpack not to process static resources
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
};

export default nextConfig; 