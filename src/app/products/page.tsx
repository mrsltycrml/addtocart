'use client'

import { useState, useEffect } from 'react'
import { getAllProducts } from '@/data/products'
import type { Product } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { PlusCircle, Trash2, Package, DollarSign, ImageIcon, CheckCircle, XCircle } from 'lucide-react'
import Image from 'next/image'
import { useToast } from '@/hooks/use-toast'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    image_url: '',
    category: 'Electronics' // Default category
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formVisible, setFormVisible] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      const freshProducts = await getAllProducts()
      setProducts(freshProducts)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast({
        title: 'Error',
        description: 'Failed to load products. Please try again.',
        variant: 'destructive'
      })
    }
  }

  async function addProduct(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const { getSupabaseClient } = await import('@/lib/supabase')
      const supabase = getSupabaseClient()
      
      // Validate form
      if (!newProduct.name || !newProduct.description || !newProduct.price) {
        throw new Error('Please fill in all required fields')
      }
      
      const { error } = await supabase.from('products').insert([newProduct])
      
      if (error) throw error
      
      toast({
        title: 'Success!',
        description: 'Product added successfully',
        variant: 'default',
      })
      
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        image_url: '',
        category: 'Electronics'
      })
      
      setFormVisible(false)
      fetchProducts()
    } catch (error: any) {
      toast({
        title: 'Error adding product',
        description: error.message || 'Something went wrong',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function deleteProduct(id: string, name: string) {
    try {
      const { getSupabaseClient } = await import('@/lib/supabase')
      const supabase = getSupabaseClient()
      const { error } = await supabase.from('products').delete().eq('id', id)
      
      if (error) throw error
      
      toast({
        title: 'Product deleted',
        description: `${name} has been removed`,
        variant: 'default'
      })
      
      fetchProducts()
    } catch (error: any) {
      toast({
        title: 'Error deleting product',
        description: error.message || 'Something went wrong',
        variant: 'destructive'
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-10 space-y-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-primary tracking-tight">Products Management</h1>
          <p className="text-muted-foreground mt-2">Manage your product inventory</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button 
            size="lg"
            className="gap-2 group"
            onClick={() => setFormVisible(!formVisible)}
          >
            {formVisible ? (
              <>
                <XCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                Close Form
              </>
            ) : (
              <>
                <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                Add Product
              </>
            )}
          </Button>
        </motion.div>
      </div>
      
      {/* Add Product Form */}
      <AnimatePresence>
        {formVisible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-xl mx-auto"
          >
            <Card className="backdrop-blur-sm bg-card/80 border-primary/20 shadow-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent pb-8">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Package className="w-6 h-6 text-primary" />
                  Add New Product
                </CardTitle>
              </CardHeader>
              
              <form onSubmit={addProduct}>
                <CardContent className="space-y-5 pt-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Product Name*</label>
                    <div className="relative">
                      <Input
                        required
                        type="text"
                        placeholder="Enter product name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="pl-10 bg-background/50 border-border/60 focus-visible:ring-primary"
                      />
                      <Package className="w-5 h-5 absolute left-3 top-2.5 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Description*</label>
                    <Textarea
                      required
                      placeholder="Describe your product"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      className="resize-none min-h-[120px] bg-background/50 border-border/60 focus-visible:ring-primary"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Price ($)*</label>
                      <div className="relative">
                        <Input
                          required
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={newProduct.price || ''}
                          onChange={(e) => setNewProduct({ 
                            ...newProduct, 
                            price: e.target.value === '' ? 0 : parseFloat(e.target.value) 
                          })}
                          className="pl-10 bg-background/50 border-border/60 focus-visible:ring-primary"
                        />
                        <DollarSign className="w-5 h-5 absolute left-3 top-2.5 text-muted-foreground" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Category</label>
                      <select
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="w-full h-10 px-3 py-2 rounded-md border border-border/60 bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="Electronics">Electronics</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Peripherals">Peripherals</option>
                        <option value="Computers">Computers</option>
                        <option value="Monitors">Monitors</option>
                        <option value="Audio">Audio</option>
                        <option value="Smart Home">Smart Home</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Image URL</label>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="https://example.com/image.jpg"
                        value={newProduct.image_url}
                        onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                        className="pl-10 bg-background/50 border-border/60 focus-visible:ring-primary"
                      />
                      <ImageIcon className="w-5 h-5 absolute left-3 top-2.5 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground">Paste a URL to your product image</p>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-end gap-3 py-6 bg-muted/20">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setFormVisible(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="relative overflow-hidden group"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-current border-r-transparent animate-spin rounded-full"></span>
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 transition-transform group-hover:scale-110" /> 
                        Add Product
                      </span>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Products Grid */}
      <div className="pt-8">
        <h2 className="text-2xl font-semibold mb-6">Product Inventory ({products.length})</h2>
        
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border rounded-xl bg-card/30">
            <Package className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-medium text-muted-foreground">No products yet</h3>
            <p className="text-muted-foreground mt-2 max-w-md">
              Get started by adding your first product using the form above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="group overflow-hidden border-border/40 hover:border-primary/40 transition-all duration-300 h-full flex flex-col">
                  <div className="relative aspect-[16/9] bg-muted/30 overflow-hidden">
                    {(product.imageUrl || product.image_url) ? (
                      <Image
                        src={product.imageUrl || product.image_url || ''}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-16 h-16 text-muted-foreground/30" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm text-primary text-xs font-medium py-1 px-2 rounded-full">
                      {product.category || 'Uncategorized'}
                    </div>
                  </div>
                  
                  <CardContent className="flex-grow p-5">
                    <h3 className="text-xl font-semibold text-foreground line-clamp-1 mb-2">{product.name}</h3>
                    <p className="text-muted-foreground line-clamp-2 mb-3 text-sm">{product.description}</p>
                    <p className="text-2xl font-bold text-primary">${Number(product.price).toFixed(2)}</p>
                  </CardContent>
                  
                  <CardFooter className="pt-0 pb-5 px-5">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full gap-2"
                      onClick={() => deleteProduct(product.id, product.name)}
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 