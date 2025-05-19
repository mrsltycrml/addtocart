'use client';

import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartProvider';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';

export function CartIcon() {
  const { getItemCount } = useCart();
  const [itemCount, setItemCount] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      setItemCount(getItemCount());
    }
  }, [getItemCount, isClient, useCart().cartItems]); // Depend on cartItems to re-render

  if (!isClient) {
    return (
      <Link href="/cart" className="relative flex items-center p-2 rounded-md hover:bg-accent/50 transition-colors" aria-label="Shopping Cart">
        <ShoppingCart className="h-6 w-6 text-foreground" />
      </Link>
    );
  }

  return (
    <Link href="/cart" className="relative flex items-center p-2 rounded-md hover:bg-accent/50 transition-colors" aria-label={`Shopping Cart with ${itemCount} items`}>
      <ShoppingCart className="h-6 w-6 text-foreground" />
      {itemCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full p-0 text-xs"
        >
          {itemCount}
        </Badge>
      )}
    </Link>
  );
}
