"use client";

import { useEffect, useState } from 'react';
import { getAllProducts } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { ProductDisplay } from '@/components/ProductDisplay';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import type { Product } from '@/lib/types';

function ProductDisplayFallback() {
  return (
    <div className="space-y-12">
      <div className="flex justify-center">
        <div className="flex w-full max-w-2xl items-center space-x-2 mb-8">
          <div className="relative flex-grow h-12 bg-muted rounded-md animate-pulse"></div>
          <div className="h-12 w-28 bg-muted rounded-md animate-pulse"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-[420px] bg-muted rounded-xl animate-pulse"></div>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const fetchedProducts = await getAllProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadProducts();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-accent/10 rounded-xl shadow-lg mb-16">
        <div className="container mx-auto px-4 text-center">
          <ShoppingBag className="mx-auto h-20 w-20 text-primary mb-6" />
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            Welcome to <span className="text-primary">IT Select</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Your ultimate destination for cutting-edge tech products. Explore our curated collection and elevate your digital experience.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="text-lg py-7 px-10" asChild>
              <Link href="#products">
                Explore Products <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg py-7 px-10">
              <Link href="/cart">View Cart</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="w-full py-12">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight text-primary">Our Latest Collection</h2>
            <p className="text-lg text-muted-foreground mt-2">Discover innovative tech to power your world.</p>
        </div>
        <Suspense fallback={<ProductDisplayFallback />}>
          <ProductDisplay initialProducts={products} />
        </Suspense>
      </section>
    </>
  );
}
