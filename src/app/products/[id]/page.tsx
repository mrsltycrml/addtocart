'use client'; 

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { getProductById } from '@/data/products';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartProvider';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ShoppingCart, AlertCircle, Star, MessageCircle, ShieldCheck, Truck } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/lib/utils';

function ProductDetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto">
       <Skeleton className="h-10 w-40 mb-8 rounded-md" />
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <Skeleton className="aspect-square rounded-xl w-full" />
        <div className="space-y-6">
          <Skeleton className="h-10 w-3/4 rounded-md" />
          <Skeleton className="h-6 w-1/4 rounded-md" />
          <Skeleton className="h-12 w-1/3 rounded-md" />
          <Separator className="my-6" />
          <Skeleton className="h-6 w-1/4 rounded-md" />
          <Skeleton className="h-20 w-full rounded-md" />
          <Skeleton className="h-12 w-full rounded-md mt-6" />
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (typeof id === 'string') {
      (async () => {
        const foundProduct = await getProductById(id);
      setProduct(foundProduct);
      })();
    }
  }, [id]);

  if (product === undefined) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center p-6">
        <AlertCircle className="w-20 h-20 text-destructive mb-6" />
        <h1 className="text-3xl font-semibold mb-3">Product Not Found</h1>
        <p className="text-muted-foreground text-lg mb-8">Oops! The product you're looking for doesn't exist or may have been removed.</p>
        <Button size="lg" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-5 w-5" /> Explore Other Products
          </Link>
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
      title: `${product.name} (x${quantity}) added to cart!`,
      description: "Your item is waiting for you in the cart.",
      action: (
        <Button variant="outline" size="sm" asChild>
          <Link href="/cart">View Cart</Link>
        </Button>
      )
    });
  };

  return (
    <div className="max-w-5xl mx-auto">
      <Button variant="outline" onClick={() => router.back()} className="mb-8 group text-base py-2.5 px-5">
        <ArrowLeft className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" /> Back
      </Button>
      <Card className="overflow-hidden shadow-xl rounded-xl border-border/70">
        <div className="grid md:grid-cols-5 gap-0">
          <div className="md:col-span-3 relative w-full aspect-[4/3] md:aspect-auto bg-muted/50 p-4 md:p-0">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 60vw, 50vw"
              className="object-contain rounded-lg"
              data-ai-hint={product.dataAiHint}
            />
          </div>
          <div className="md:col-span-2 flex flex-col bg-card">
            <CardHeader className="p-6 md:p-8">
              <Badge variant="secondary" className="w-fit mb-2 capitalize">{product.category}</Badge>
              <CardTitle className="text-3xl lg:text-4xl font-bold tracking-tight">{product.name}</CardTitle>
              {/* Placeholder for star rating */}
              <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span>4.8 (120 reviews)</span> {/* Mock data */}
              </div>
            </CardHeader>
            <CardContent className="p-6 md:p-8 pt-0 space-y-5 flex-grow">
              <p className="text-4xl lg:text-5xl font-extrabold text-primary">
                {formatPrice(Number(product.price))}
              </p>
              <Separator />
              <div>
                <h3 className="text-xl font-semibold mb-2">Description</h3>
                <p className="text-foreground/85 leading-relaxed text-base">
                  {product.description}
                </p>
              </div>
              
              <div className="space-y-2 text-sm">
                 <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <ShieldCheck className="w-5 h-5"/>
                    <span>Official Product Guarantee</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5"/>
                    <span>Fast & Free Shipping</span>
                 </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-3">
                <span className="font-medium">Quantity:</span>
                <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </Button>
                <span className="text-lg font-semibold w-10 text-center">{quantity}</span>
                <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </Button>
              </div>

            </CardContent>
            <div className="p-6 md:p-8 border-t mt-auto bg-muted/30">
              <Button size="lg" onClick={handleAddToCart} className="w-full text-lg py-4">
                <ShoppingCart className="mr-2 h-6 w-6" /> Add to Cart
              </Button>
               <Button variant="outline" className="w-full text-base py-3 mt-3">
                <MessageCircle className="mr-2 h-5 w-5" /> Ask a Question
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
