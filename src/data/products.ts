import type { Product } from '@/lib/types';
import { supabase } from '@/lib/supabase';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Quantum Laptop XG',
    description: 'Next-generation laptop with AI-powered processing and a stunning 16-inch display. Perfect for professionals and creatives.',
    price: 1499.99,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'laptop technology',
    category: 'Laptops',
  },
  {
    id: '2',
    name: 'Stealth Pro Keyboard',
    description: 'Mechanical keyboard with customizable RGB lighting and ultra-responsive keys for gaming and typing.',
    price: 129.50,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'keyboard gaming',
    category: 'Peripherals',
  },
  {
    id: '3',
    name: 'Aura Wireless Mouse',
    description: 'Ergonomic wireless mouse with precision tracking and long battery life. Designed for comfort and productivity.',
    price: 79.00,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'mouse computer',
    category: 'Peripherals',
  },
  {
    id: '4',
    name: 'Visionary 4K Monitor',
    description: '27-inch 4K UHD monitor with vibrant colors and crisp details. Ideal for graphic design and video editing.',
    price: 450.00,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'monitor screen',
    category: 'Monitors',
  },
  {
    id: '5',
    name: 'Nova Smart Hub',
    description: 'Centralize your smart home devices with this intuitive and powerful smart hub. Supports all major protocols.',
    price: 199.99,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'smart home',
    category: 'Smart Home',
  },
  {
    id: '6',
    name: 'Echo Sound System',
    description: 'Immersive 5.1 surround sound system for your home theater. Crystal clear audio for movies and music.',
    price: 399.00,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'speakers audio',
    category: 'Audio',
  },
  {
    id: '7',
    name: 'Guardian Security Cam',
    description: 'Smart security camera with night vision, motion detection, and two-way audio. Keep an eye on your home.',
    price: 99.99,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'security camera',
    category: 'Smart Home',
  },
  {
    id: '8',
    name: 'CyberWorkstation Pro',
    description: 'High-performance desktop workstation for demanding tasks like 3D rendering and data analysis. Customizable.',
    price: 2899.00,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'desktop computer',
    category: 'Desktops',
  },
];

export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(product => product.id === id);
};

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from('products').select('*');
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return data as Product[];
}
