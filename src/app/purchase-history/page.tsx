'use client';

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { PurchaseHistory, Product } from '@/lib/supabase'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { History, ShoppingBag, ArrowLeft, PackageCheck, FileText, Download } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

type PurchaseWithProduct = PurchaseHistory & {
  product: Product
}

export default function PurchaseHistoryPage() {
  const [purchases, setPurchases] = useState<PurchaseWithProduct[]>([])

  useEffect(() => {
    fetchPurchaseHistory()
  }, [])

  async function fetchPurchaseHistory() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('purchase_history')
      .select(`
        *,
        product:products(*)
      `)
      .eq('user_id', user.id)
      .order('purchase_date', { ascending: false })

    if (error) {
      console.error('Error fetching purchase history:', error)
      return
    }

    setPurchases(data || [])
  }

  return (
    <div className="max-w-5xl mx-auto py-10">
      <Button variant="outline" asChild className="mb-8 group text-base py-2.5 px-5">
        <Link href="/">
          <ArrowLeft className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" /> Back to Shopping
        </Link>
      </Button>

      <div className="mb-10">
        <h1 className="text-4xl font-bold text-primary flex items-center">
          <History className="mr-4 h-10 w-10" strokeWidth={2} /> Purchase History
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">Review your past orders.</p>
      </div>
      
      {purchases.length === 0 ? (
        <Card className="shadow-lg rounded-xl border-border/70">
          <CardHeader className="items-center text-center py-10">
             <ShoppingBag className="w-20 h-20 text-muted-foreground mb-6" strokeWidth={1.5}/>
            <CardTitle className="text-2xl">No Purchases Yet</CardTitle>
            <CardDescription className="text-base">You haven't made any purchases. When you do, they'll appear here.</CardDescription>
          </CardHeader>
          <CardFooter className="justify-center pb-10">
            <Button asChild size="lg" className="text-lg py-3 px-6">
              <Link href="/">
                <ShoppingBag className="mr-2 h-5 w-5" /> Start Shopping
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-8">
          {purchases.map((purchase) => (
            <Card key={purchase.id} className="shadow-lg rounded-xl border-border/70 overflow-hidden">
              <CardHeader className="bg-muted/30 p-5 border-b">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
                        <PackageCheck className="text-primary h-7 w-7" />
                        Order ID: <span className="font-mono text-primary/90">{purchase.id}</span>
                    </CardTitle>
                    <CardDescription className="mt-1 text-base">
                        Placed on: {new Date(purchase.purchase_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </CardDescription>
                  </div>
                  <div className="text-left sm:text-right mt-2 sm:mt-0">
                    <p className="text-xl sm:text-2xl font-bold mt-1.5 text-primary">${purchase.total_price.toFixed(2)}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5">
                <h4 className="font-semibold mb-3 text-lg text-muted-foreground">Items in this order:</h4>
                <ul className="space-y-4">
                  <li className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-card rounded-lg border">
                    <div className="flex items-center gap-4">
                      <Link href={`/products/${purchase.product.id}`}>
                         <Image 
                           src={purchase.product.image_url} 
                           alt={purchase.product.name} 
                           width={70} 
                           height={70} 
                           className="rounded-md object-cover border border-border/50 hover:opacity-80 transition-opacity" 
                         />
                      </Link>
                      <div>
                         <Link href={`/products/${purchase.product.id}`} className="hover:text-primary">
                          <p className="font-semibold text-base sm:text-lg">{purchase.product.name}</p>
                        </Link>
                        {purchase.product.category && (
                          <p className="text-sm text-muted-foreground">Category: {purchase.product.category}</p>
                        )}
                        <p className="text-sm text-muted-foreground">Qty: {purchase.quantity} · ${purchase.product.price.toFixed(2)} each</p>
                      </div>
                    </div>
                    <p className="font-semibold text-base sm:text-lg text-primary mt-2 sm:mt-0 ml-auto sm:ml-0">
                      ${(purchase.product.price * purchase.quantity).toFixed(2)}
                    </p>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="p-5 border-t bg-muted/30 flex flex-col sm:flex-row justify-end gap-3">
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    <FileText className="mr-2 h-4 w-4" /> View Invoice
                </Button>
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    <Download className="mr-2 h-4 w-4" /> Download Details (PDF)
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
