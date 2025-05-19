
'use client';

import { useCart } from '@/context/CartProvider';
import { Button } from '@/components/ui/button';
import { CartItemCard } from '@/components/CartItemCard';
import Link from 'next/link';
import { ShoppingCart, CreditCard, ArrowLeft, Trash2, AlertCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function CartPage() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [total, setTotal] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      setTotal(getCartTotal());
    }
  }, [getCartTotal, isClient, cartItems]);

  if (!isClient) {
     return (
      <div className="max-w-5xl mx-auto py-10">
        <div className="animate-pulse space-y-6">
          <div className="flex justify-between items-center">
            <div className="h-10 bg-muted rounded w-1/2"></div>
            <div className="h-10 bg-muted rounded w-28"></div>
          </div>
          <div className="h-32 bg-muted rounded-xl"></div>
          <div className="h-32 bg-muted rounded-xl"></div>
          <div className="md:ml-auto mt-6 md:w-1/3">
             <div className="h-64 bg-muted rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-300px)] text-center p-6">
        <ShoppingCart className="w-24 h-24 text-muted-foreground mb-8" strokeWidth={1.5}/>
        <h1 className="text-3xl font-semibold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground text-lg mb-10">Looks like you haven't added any treasures yet. Let's find something amazing!</p>
        <Button asChild size="lg" className="text-lg py-3 px-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-5 w-5" /> Start Shopping
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <h1 className="text-4xl font-bold text-primary flex items-center">
          <ShoppingCart className="mr-4 h-10 w-10" strokeWidth={2} /> Your Shopping Cart
        </h1>
        {cartItems.length > 0 && (
           <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-destructive hover:text-destructive hover:border-destructive/70 gap-2">
                <Trash2 className="h-5 w-5" /> Clear Cart
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2"><AlertCircle className="text-destructive"/>Clear Entire Cart?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to remove all items from your cart? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={clearCart} className="bg-destructive hover:bg-destructive/90">
                  Clear Cart
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
        <div className="md:col-span-2 space-y-5">
          {cartItems.map(item => (
            <CartItemCard key={item.id} item={item} />
          ))}
        </div>

        <div className="md:col-span-1">
          <Card className="shadow-xl rounded-xl border-border/70 sticky top-24">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-semibold">Order Summary</CardTitle>
              <CardDescription>Review your items before proceeding.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-lg">
                <span>Subtotal</span>
                <span className="font-medium">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground text-sm">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-muted-foreground text-sm">
                <span>Taxes</span>
                <span>Calculated at checkout</span>
              </div>
              <Separator className="my-4"/>
              <div className="flex justify-between text-2xl font-bold text-primary">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-3 p-5">
              <Button size="lg" className="w-full text-lg py-3.5 mt-2" asChild>
                <Link href="/checkout">
                  <CreditCard className="mr-2 h-5 w-5" /> Proceed to Checkout
                </Link>
              </Button>
               <Button variant="outline" size="lg" className="w-full text-base py-3" asChild>
                <Link href="/">
                  <ArrowLeft className="mr-2 h-5 w-5" /> Continue Shopping
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
