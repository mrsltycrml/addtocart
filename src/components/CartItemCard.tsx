
'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { CartItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartProvider';
import { Minus, Plus, Trash2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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
} from "@/components/ui/alert-dialog"

interface CartItemCardProps {
  item: CartItem;
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { toast } = useToast();

  const handleQuantityChange = (newQuantity: number) => {
    const parsedQuantity = Math.max(0, newQuantity); // Ensure quantity is not negative

    if (parsedQuantity === 0) {
      // Trigger alert dialog for removal if quantity becomes 0
      // This case is handled by the remove button now for clarity
      return; 
    }
    updateQuantity(item.id, parsedQuantity);
  };

  const handleDirectRemove = () => {
    removeFromCart(item.id);
    toast({
      title: `${item.name} removed from cart.`,
      variant: "destructive",
    });
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-4 sm:p-6 border rounded-xl shadow-sm bg-card hover:shadow-md transition-shadow duration-300">
      <Link href={`/products/${item.id}`} className="shrink-0 block w-full sm:w-auto">
        <Image
          src={item.imageUrl}
          alt={item.name}
          width={100}
          height={100}
          className="rounded-lg object-cover aspect-square border border-border/50 mx-auto sm:mx-0"
          data-ai-hint={item.dataAiHint}
        />
      </Link>
      <div className="flex-grow text-center sm:text-left w-full sm:w-auto">
        <Link href={`/products/${item.id}`} className="hover:text-primary transition-colors">
          <h3 className="font-semibold text-lg sm:text-xl">{item.name}</h3>
        </Link>
        <p className="text-sm text-muted-foreground">Unit Price: ${item.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center gap-2 my-3 sm:my-0">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={item.quantity <= 1}
          aria-label="Decrease quantity"
          className="h-9 w-9 sm:h-10 sm:w-10"
        >
          <Minus className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        <Input
          type="number"
          value={item.quantity}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            if (!isNaN(val) && val > 0) {
              handleQuantityChange(val);
            } else if (e.target.value === '') {
              // Allow clearing input, but treat as 1 if blurred empty
            }
          }}
          onBlur={(e) => {
             if (e.target.value === '' || parseInt(e.target.value, 10) < 1) {
                handleQuantityChange(1); // Reset to 1 if input is invalid or empty on blur
             }
          }}
          min="1"
          className="w-16 h-9 sm:h-10 text-center text-base"
          aria-label={`Quantity for ${item.name}`}
        />
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleQuantityChange(item.quantity + 1)}
          aria-label="Increase quantity"
          className="h-9 w-9 sm:h-10 sm:w-10"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>
      <p className="font-bold text-lg sm:text-xl w-28 text-center sm:text-right text-primary">
        ${(item.price * item.quantity).toFixed(2)}
      </p>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80 hover:bg-destructive/10" aria-label={`Remove ${item.name} from cart`}>
            <Trash2 className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2"><AlertCircle className="text-destructive"/>Remove Item?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove "{item.name}" from your cart?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDirectRemove} className="bg-destructive hover:bg-destructive/90">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
