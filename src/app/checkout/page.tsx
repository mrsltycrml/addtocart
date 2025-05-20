'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartProvider';
import { CreditCard, ShoppingBag, ArrowLeft, Package, Lock, Truck, UserCircle, MapPin, Mail, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Import useRouter
import { useToast } from '@/hooks/use-toast'; // Import useToast
import { getSupabaseClient } from '@/lib/supabase';
import { formatPrice } from '@/lib/utils';

const supabase = getSupabaseClient();

export default function CheckoutPage() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const router = useRouter(); // Initialize router
  const { toast } = useToast(); // Initialize toast
  const [total, setTotal] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      setTotal(getCartTotal());
      // Redirect to cart if cart is empty on client side
      if (cartItems.length === 0) {
        router.push('/cart');
        toast({
            title: "Your cart is empty!",
            description: "Add some items to your cart before checking out.",
            variant: "destructive"
        })
      }
    }
  }, [getCartTotal, isClient, cartItems, router, toast]);

  const handleCheckout = async (event: React.FormEvent) => {
    event.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "You must be signed in to complete your purchase.",
        variant: "destructive"
      });
      return;
    }

    // Insert each cart item into purchase_history
    const purchasePromises = cartItems.map(item =>
      supabase
        .from('purchase_history')
        .insert([{
          user_id: user.id,
          product_id: item.id,
          quantity: item.quantity,
          total_price: item.price * item.quantity,
          purchase_date: new Date().toISOString()
        }])
    );
    await Promise.all(purchasePromises);

    toast({
      title: "Order Placed Successfully!",
      description: "Thank you for your purchase. Your items are on their way.",
      variant: "default",
    });
    await clearCart();
    router.push('/purchase-history');
  };
  
  if (!isClient) {
    return (
        <div className="max-w-6xl mx-auto py-10">
            <div className="animate-pulse">
                <div className="h-10 w-1/4 bg-muted rounded mb-8"></div>
                <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="h-60 bg-muted rounded-xl"></div>
                        <div className="h-72 bg-muted rounded-xl"></div>
                    </div>
                    <div className="h-96 bg-muted rounded-xl"></div>
                </div>
            </div>
        </div>
    );
  }

  // No need for cartItems.length === 0 check here if redirecting above
  // but as a fallback or if redirect logic changes:
  if (cartItems.length === 0 && isClient) {
     return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-300px)] text-center p-6">
        <ShoppingBag className="w-24 h-24 text-muted-foreground mb-8" strokeWidth={1.5}/>
        <h1 className="text-3xl font-semibold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground text-lg mb-10">Please add items to your cart to proceed with checkout.</p>
        <Button asChild size="lg" className="text-lg py-3 px-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-5 w-5" /> Continue Shopping
          </Link>
        </Button>
      </div>
    );
  }


  return (
    <div className="max-w-6xl mx-auto py-10">
      <Button variant="outline" asChild className="mb-8 group text-base py-2.5 px-5">
        <Link href="/cart">
          <ArrowLeft className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" /> Back to Cart
        </Link>
      </Button>

      <h1 className="text-4xl font-bold text-primary mb-10 flex items-center">
        <CreditCard className="mr-4 h-10 w-10" strokeWidth={2} /> Secure Checkout
      </h1>

      <form onSubmit={handleCheckout}>
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-lg rounded-xl border-border/70">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2"><UserCircle className="text-primary"/>Contact & Shipping</CardTitle>
                <CardDescription>Where should we send your order?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                 <div>
                  <Label htmlFor="email" className="flex items-center gap-1 mb-1"><Mail className="w-4 h-4 text-muted-foreground" />Email Address</Label>
                  <Input id="email" name="email" type="email" placeholder="you@example.com" required />
                </div>
                <div>
                  <Label htmlFor="name" className="flex items-center gap-1 mb-1"><UserCircle className="w-4 h-4 text-muted-foreground" />Full Name</Label>
                  <Input id="name" name="name" placeholder="John M. Doe" required />
                </div>
                <div>
                  <Label htmlFor="address" className="flex items-center gap-1 mb-1"><MapPin className="w-4 h-4 text-muted-foreground" />Street Address</Label>
                  <Input id="address" name="address" placeholder="123 Tech Avenue, Suite 404" required />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city" className="mb-1 block">City</Label>
                    <Input id="city" name="city" placeholder="Binaryville" required />
                  </div>
                  <div>
                    <Label htmlFor="state" className="mb-1 block">State / Province</Label>
                    <Input id="state" name="state" placeholder="Circuitry" required />
                  </div>
                  <div>
                    <Label htmlFor="zip" className="mb-1 block">ZIP / Postal Code</Label>
                    <Input id="zip" name="zip" placeholder="90210" required />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg rounded-xl border-border/70">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2"><Lock className="text-primary"/>Payment Details</CardTitle>
                <CardDescription>Enter your payment information securely.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <Label htmlFor="cardName" className="mb-1 block">Name on Card</Label>
                  <Input id="cardName" name="cardName" placeholder="John M. Doe" required />
                </div>
                <div>
                  <Label htmlFor="cardNumber" className="mb-1 block">Card Number</Label>
                  <Input id="cardNumber" name="cardNumber" placeholder="•••• •••• •••• ••••" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry" className="mb-1 block">Expiry Date</Label>
                    <Input id="expiry" name="expiry" placeholder="MM/YY" required />
                  </div>
                  <div>
                    <Label htmlFor="cvc" className="mb-1 block">CVC/CVV</Label>
                    <Input id="cvc" name="cvc" placeholder="•••" required />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-xl rounded-xl border-border/70">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl flex items-center gap-2"><Package className="text-primary"/>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm py-2 border-b border-border/50 last:border-b-0">
                    <div className="flex items-center gap-3">
                        <Image src={item.imageUrl} alt={item.name} width={50} height={50} className="rounded-md object-cover border" data-ai-hint={item.dataAiHint || 'product image'} />
                        <div>
                            <p className="font-medium line-clamp-1">{item.name}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                    </div>
                    <span className="font-semibold">{formatPrice(Number(item.price * item.quantity))}</span>
                  </div>
                ))}
              </CardContent>
              <Separator className="my-4" />
              <CardContent className="space-y-3 pt-0">
                <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{formatPrice(Number(total))}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-green-500">FREE</span>
                </div>
                 <div className="flex justify-between text-muted-foreground">
                    <span>Taxes (Estimated)</span>
                    <span>{formatPrice(0)}</span> 
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between font-bold text-xl text-primary">
                  <span>Total Due</span>
                  <span>{formatPrice(Number(total))}</span>
                </div>
              </CardContent>
              <CardFooter className="p-5 border-t border-border/40">
                <Button type="submit" size="lg" className="w-full text-lg py-3.5">
                  <Lock className="mr-2 h-5 w-5" /> Place Secure Order
                </Button>
              </CardFooter>
            </Card>
             <div className="mt-6 text-center text-sm text-muted-foreground flex items-center justify-center gap-1.5">
                <Truck className="w-4 h-4"/> Free shipping on all orders. <ShieldCheck className="w-4 h-4"/> Secure payment.
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
