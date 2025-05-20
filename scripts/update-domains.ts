import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { getSupabaseClient } from '@/lib/supabase';

async function updateNextConfig() {
  console.log('🔍 Scanning product images for domains...');

  // Get all products
  const supabase = getSupabaseClient();
  const { data: products, error } = await supabase.from('products').select('*');
  if (error) {
    console.error('❌ Error fetching products:', error.message);
    process.exit(1);
  }

  // Extract unique domains from image URLs
  const domains = new Set<string>();
  products.forEach(product => {
    try {
      if (product.image_url) {
        const url = new URL(product.image_url);
        domains.add(url.hostname);
      }
    } catch (error) {
      console.warn(`⚠️ Invalid URL for product ${product.id}: ${product.image_url}`);
    }
  });

  // Read existing next.config.js
  const configPath = path.join(process.cwd(), 'next.config.js');
  let configContent = '';

  try {
    configContent = fs.readFileSync(configPath, 'utf8');
  } catch (error) {
    console.error('❌ Could not read next.config.js');
    process.exit(1);
  }

  // Convert domains Set to array and add some common image hosting services
  const allDomains = [
    ...Array.from(domains),
    'images.unsplash.com',
    'res.cloudinary.com',
    'imgur.com',
    'i.imgur.com',
    'm.media-amazon.com',
    'ecommerce.datablitz.com.ph',
    'dynaquestpc.com',
    'www.amd.com',
    'www.syntech.co.za',
    'easypc.com.ph',
    'images-na.ssl-images-amazon.com',
    'en.colorful.cn',
    'www.dateks.lv',
    'storage-asset.msi.com',
    'shop.villman.com',
    'media.kingston.com',
    'www.makotekcomputers.com',
    'images.teamgroupinc.com',
    'www.itech.ph',
    'image-us.samsung.com',
    'www.asus.com',
    'gameone.ph',
    'netcodex.ph',
    'files.coolermaster.com',
    '1pc.co.il',
    'bluearm.ph',
    'www.pbtech.com'
  ];

  // Create new config content
  const newConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ${JSON.stringify(allDomains, null, 4)},
  },
  // Preserve existing config
  ${configContent.split('module.exports')[1].split('=')[1]}
};

module.exports = nextConfig;
`;

  // Write updated config
  try {
    fs.writeFileSync(configPath, newConfig);
    console.log('✅ Successfully updated next.config.js');
    console.log('\nDomains added:');
    allDomains.forEach(domain => console.log(`  - ${domain}`));
  } catch (error) {
    console.error('❌ Failed to write next.config.js:', error);
    process.exit(1);
  }
}

updateNextConfig(); 