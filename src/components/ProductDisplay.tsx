
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Product } from '@/lib/types';
import { SearchInput } from '@/components/SearchInput';
import { ProductGrid } from '@/components/ProductGrid';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

interface ProductDisplayProps {
  initialProducts: Product[];
}

export function ProductDisplay({ initialProducts }: ProductDisplayProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const initialSearchQuery = searchParams.get('q') || '';
  
  const [searchTerm, setSearchTerm] = useState(initialSearchQuery);
  // Products state is mainly for potential future client-side fetching/filtering beyond search
  const [products, setProducts] = useState<Product[]>(initialProducts);

  useEffect(() => {
    // Update products if initialProducts prop changes (e.g., on navigation or SWR revalidation)
    setProducts(initialProducts);
  }, [initialProducts]);

  // Effect to sync searchTerm state with URL query parameter 'q'
  useEffect(() => {
    const queryFromUrl = searchParams.get('q') || '';
    if (queryFromUrl !== searchTerm) {
      setSearchTerm(queryFromUrl);
    }
  }, [searchParams, searchTerm]);

  const handleSearch = useCallback((query: string) => {
    setSearchTerm(query);
    // The SearchInput component now handles URL updates for search term 'q'
    // This function primarily updates the local state for filtering
  }, []);

  const filteredProducts = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();
    if (!lowerCaseSearchTerm) {
      return products; // Return all products if search term is empty
    }
    return products.filter(
      product =>
        product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        product.category.toLowerCase().includes(lowerCaseSearchTerm) ||
        product.description.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [searchTerm, products]);

  return (
    <div className="space-y-10">
      <div className="flex justify-center">
        {/* Pass initialQuery and onSearch. SearchInput handles URL updates itself. */}
        <SearchInput onSearch={handleSearch} initialQuery={initialSearchQuery} />
      </div>
      <ProductGrid products={filteredProducts} />
    </div>
  );
}
