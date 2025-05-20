'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useCart } from '@/context/CartProvider';
import { ShoppingCart, Eye, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    addToCart(product);
    toast({
      title: `${product.name} added to cart!`,
      description: "Check your cart to proceed.",
      action: (
        <Button variant="outline" size="sm" asChild>
          <Link href="/cart">View Cart</Link>
        </Button>
      )
    });
  };

  return (
    <Card className="group flex flex-col overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl h-full border-border/60 hover:border-primary/50">
      <Link href={`/products/${product.id}`} className="block" aria-label={`View details for ${product.name}`}>
        <CardHeader className="p-0 relative">
          <div className="relative w-full aspect-[16/10] bg-muted overflow-hidden rounded-t-xl">
            {(product.imageUrl || product.image_url) ? (
              <Image
                src={product.imageUrl || product.image_url || ''}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                data-ai-hint={product.dataAiHint}
                priority={product.id === '1' || product.id === '2'}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-400 text-lg">
                No Image
              </div>
            )}
          </div>
          <Badge variant="secondary" className="absolute top-3 right-3 capitalize">
            {product.category}
          </Badge>
        </CardHeader>
      </Link>
      
      <CardContent className="p-5 flex-grow flex flex-col">
        <Link href={`/products/${product.id}`} className="block mb-2">
          <CardTitle className="text-xl font-semibold hover:text-primary transition-colors line-clamp-2" title={product.name}>
            {product.name}
          </CardTitle>
        </Link>
        <CardDescription className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {product.description}
        </CardDescription>
        
        <div className="mt-auto">
          <p className="text-3xl font-extrabold text-primary mb-4">
            {formatPrice(Number(product.price))}
          </p>
        </div>
      </CardContent>

      <CardFooter className="p-5 border-t border-border/60 mt-auto">
        <div className="flex gap-3 w-full">
          <Button onClick={handleAddToCart} className="flex-1 text-base py-3 bg-primary hover:bg-primary/90 group/cart">
            <ShoppingCart className="mr-2 h-5 w-5 transition-transform duration-300 group-hover/cart:scale-110" /> Add to Cart
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
