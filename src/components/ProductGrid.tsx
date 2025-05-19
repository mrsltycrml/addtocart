import type { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';
import { AlertTriangle } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 text-muted-foreground bg-card rounded-xl shadow-md">
        <AlertTriangle className="w-16 h-16 text-primary mb-4" />
        <h2 className="text-2xl font-semibold mb-2">No Products Found</h2>
        <p className="text-lg">Sorry, no products match your current search or filter.</p>
        <p className="text-sm mt-1">Try adjusting your search terms.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
