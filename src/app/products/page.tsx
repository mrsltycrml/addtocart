'use client'

import { useState, useEffect } from 'react'
import { getAllProducts } from '@/data/products'
import type { Product } from '@/lib/types'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    image_url: ''
  })

  useEffect(() => {
    (async () => {
      const freshProducts = await getAllProducts()
      setProducts(freshProducts)
    })()
  }, [])

  async function fetchProducts() {
    const freshProducts = await getAllProducts()
    setProducts(freshProducts)
  }

  async function addProduct(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await import('@/lib/supabase').then(({ supabase }) =>
      supabase.from('products').insert([newProduct])
    )
    if (error) {
      console.error('Error adding product:', error)
      return
    }
    setNewProduct({
      name: '',
      description: '',
      price: 0,
      image_url: ''
    })
    fetchProducts()
  }

  async function deleteProduct(id: string) {
    const { error } = await import('@/lib/supabase').then(({ supabase }) =>
      supabase.from('products').delete().eq('id', id)
    )
    if (error) {
      console.error('Error deleting product:', error)
      return
    }
    fetchProducts()
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Products Management</h1>
      
      {/* Add Product Form */}
      <div className="max-w-xl mx-auto mt-10">
        <div className="bg-background border border-primary/30 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-primary flex items-center gap-2 mb-6">
            <span className="inline-block bg-primary/10 rounded-full p-2">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
            </span>
            Add New Product
          </h2>
          <form onSubmit={addProduct} className="space-y-5">
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
            />
            <textarea
              placeholder="Description"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
            />
            <input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={newProduct.image_url}
              onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="w-full bg-primary text-white text-lg font-semibold py-3 rounded-lg hover:bg-primary/90 transition"
            >
              Add Product
            </button>
          </form>
        </div>
      </div>

      {/* Products List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border rounded p-4">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover mb-4"
              />
            ) : null}
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-600 mb-2">{product.description}</p>
            <p className="text-lg font-bold">${product.price}</p>
            <button
              onClick={() => deleteProduct(product.id)}
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
} 