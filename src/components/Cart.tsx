'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { CartItem, Product } from '@/lib/supabase'

export default function Cart() {
  const [cartItems, setCartItems] = useState<(CartItem & { product: Product })[]>([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    fetchCartItems()
  }, [])

  async function fetchCartItems() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(*)
      `)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error fetching cart items:', error)
      return
    }

    setCartItems(data || [])
    calculateTotal(data || [])
  }

  function calculateTotal(items: (CartItem & { product: Product })[]) {
    const sum = items.reduce((acc, item) => {
      return acc + (item.product.price * item.quantity)
    }, 0)
    setTotal(sum)
  }

  async function updateQuantity(itemId: string, newQuantity: number) {
    if (newQuantity < 1) return

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: newQuantity })
      .eq('id', itemId)

    if (error) {
      console.error('Error updating quantity:', error)
      return
    }

    fetchCartItems()
  }

  async function removeFromCart(itemId: string) {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId)

    if (error) {
      console.error('Error removing item from cart:', error)
      return
    }

    fetchCartItems()
  }

  async function checkout() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Create purchase history records
    const purchasePromises = cartItems.map(item => 
      supabase
        .from('purchase_history')
        .insert([{
          user_id: user.id,
          product_id: item.product_id,
          quantity: item.quantity,
          total_price: item.product.price * item.quantity,
          purchase_date: new Date().toISOString()
        }])
    )

    await Promise.all(purchasePromises)

    // Clear the cart
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id)

    if (error) {
      console.error('Error clearing cart:', error)
      return
    }

    fetchCartItems()
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
      
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between border p-4 rounded">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{item.product.name}</h3>
                    <p className="text-gray-600">${item.product.price}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2 py-1 border rounded"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 border rounded"
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-bold">Total:</span>
              <span className="text-xl font-bold">${total.toFixed(2)}</span>
            </div>
            
            <button
              onClick={checkout}
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  )
} 