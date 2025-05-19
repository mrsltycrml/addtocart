'use client';

import type { CartItem, Product } from '@/lib/types';
import type React from 'react';
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const localData = localStorage.getItem('it-select-cart');
      return localData ? JSON.parse(localData) : [];
    }
    return [];
  });

  useEffect(() => {
    const syncCart = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Fetch cart items from Supabase
        const { data, error } = await supabase
          .from('cart_items')
          .select('*, product:products(*)')
          .eq('user_id', user.id);
        if (!error && data) {
          setCartItems(data.map(item => ({
            ...item.product,
            quantity: item.quantity,
            id: item.product_id,
          })));
        }
      } else {
        // Fallback to localStorage for guests
        if (typeof window !== 'undefined') {
          const localData = localStorage.getItem('it-select-cart');
          setCartItems(localData ? JSON.parse(localData) : []);
        }
      }
    };
    syncCart();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('it-select-cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = async (product: Product, quantity: number = 1) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === product.id);
        if (existingItem) {
          return prevItems.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
          );
        }
        return [...prevItems, { ...product, quantity }];
      });
      return;
    }
    // Log what is being sent
    console.log('Adding to cart (Supabase):', { user_id: user.id, product_id: product.id, quantity });
    const { error } = await supabase
      .from('cart_items')
      .insert([{ user_id: user.id, product_id: product.id, quantity }]);
    if (error) {
      console.error('Supabase insert error:', error);
      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === product.id);
        if (existingItem) {
          return prevItems.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
          );
        }
        return [...prevItems, { ...product, quantity }];
      });
    } else {
      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === product.id);
        if (existingItem) {
          return prevItems.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
          );
        }
        return [...prevItems, { ...product, quantity }];
      });
    }
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item
      ).filter(item => item.quantity > 0) // Remove if quantity is 0
    );
  };

  const clearCart = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('cart_items').delete().eq('user_id', user.id);
    }
    setCartItems([]);
  };

  const getCartTotal = useMemo(() => () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  const getItemCount = useMemo(() => () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);
  
  const contextValue = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getItemCount,
  }), [cartItems, getCartTotal, getItemCount]);


  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
