"use client";

import { useEffect, useState, useRef } from 'react';
import { getAllProducts } from '@/data/products';
import { ProductDisplay } from '@/components/ProductDisplay';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, ShoppingCart, Cpu, Package, Laptop, Headphones, Layers, ChevronRight } from 'lucide-react';
import type { Product } from '@/lib/types';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

function ProductDisplayFallback() {
  return (
    <div className="space-y-12">
      <div className="flex justify-center">
        <div className="flex w-full max-w-2xl items-center space-x-2 mb-8">
          <div className="relative flex-grow h-12 bg-muted rounded-md animate-pulse"></div>
          <div className="h-12 w-28 bg-muted rounded-md animate-pulse"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-[420px] bg-muted rounded-xl animate-pulse"></div>
        ))}
      </div>
    </div>
  );
}

// Featured category component with hover effects
function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  delay = 0 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string; 
  delay?: number;
}) {
  return (
    <motion.div
      variants={itemVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ delay }}
      className="flex flex-col items-center p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-primary/10 shadow-lg hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300 group"
    >
      <div className="p-3 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors duration-300">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">{title}</h3>
      <p className="text-center text-muted-foreground text-sm">{description}</p>
    </motion.div>
  );
}

// Animated background elements
function BackgroundElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
      <motion.div 
        className="absolute top-1/4 left-10 w-4 h-4 bg-primary/30 rounded-full"
        animate={{ 
          y: [0, 50, 0],
          opacity: [0.3, 0.8, 0.3]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-1/3 right-20 w-6 h-6 bg-blue-400/20 rounded-full"
        animate={{ 
          y: [0, -40, 0],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      <motion.div 
        className="absolute top-1/2 right-1/4 w-3 h-3 bg-indigo-500/30 rounded-full"
        animate={{ 
          x: [0, 30, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ 
          duration: 7, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
    </div>
  );
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ 
    target: ref,
    offset: ["start start", "end start"] 
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const fetchedProducts = await getAllProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadProducts();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <motion.section 
        ref={ref}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative min-h-[80vh] flex items-center overflow-hidden"
      >
        <BackgroundElements />
        
        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-start"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 flex items-center"
              >
                <span className="animate-pulse mr-2">●</span> Discover the Future of Tech
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="text-5xl md:text-6xl font-bold tracking-tight mb-6"
              >
                Welcome to <br/>
                <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
                  IT Select
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.7 }}
                className="text-xl text-muted-foreground mb-8 max-w-lg"
              >
                Your ultimate destination for cutting-edge tech products. Explore our curated collection and elevate your digital experience.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button size="lg" className="text-lg py-7 px-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 group" asChild>
                  <Link href="#products" className="flex items-center">
                    Explore Products 
                    <motion.div
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </motion.div>
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg py-7 px-10 border-primary/30 hover:bg-primary/5" asChild>
                  <Link href="/cart" className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    View Cart
                  </Link>
                </Button>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
                className="mt-12 flex items-center gap-6"
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`w-8 h-8 rounded-full border-2 border-background bg-primary/20`} />
                  ))}
                </div>
                <div className="text-sm">
                  <span className="text-primary font-bold">500+</span> satisfied customers
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div
              style={{ y, opacity }}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative flex justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-lg aspect-square">
                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary/50 to-indigo-500/50 blur-xl opacity-50 animate-pulse"></div>
                <div className="relative bg-card/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl overflow-hidden flex items-center justify-center border border-background/20">
                  <div className="relative w-full aspect-square">
                    <motion.div
                      animate={{ 
                        rotateY: [0, 360],
                      }}
                      transition={{ 
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <Image 
                        src="/3d-computer.svg" 
                        alt="3D Computer"
                        width={400}
                        height={400}
                        className="object-contain"
                        priority
                      />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Scroll indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          >
            <p className="text-muted-foreground text-sm mb-2">Scroll to explore</p>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronRight size={20} className="text-primary rotate-90" />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-24 container mx-auto px-4"
      >
        <motion.div 
          variants={fadeIn}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose <span className="text-primary">IT Select</span>?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Discover why our customers trust us for their technology needs</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard 
            icon={Package} 
            title="Premium Selection" 
            description="Curated high-quality tech products from trusted brands" 
            delay={0.2}
          />
          <FeatureCard 
            icon={Laptop} 
            title="Latest Technology" 
            description="Stay ahead with cutting-edge devices and innovations"
            delay={0.4}
          />
          <FeatureCard 
            icon={Headphones} 
            title="Expert Support" 
            description="Our team is here to help with any questions or issues"
            delay={0.6}
          />
          <FeatureCard 
            icon={Layers} 
            title="Seamless Experience" 
            description="Easy shopping and fast delivery to your doorstep"
            delay={0.8}
          />
        </div>
      </motion.section>

      {/* Products Section */}
      <motion.section 
        id="products" 
        className="w-full py-24 bg-gradient-to-b from-background via-muted/10 to-background"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            variants={fadeIn}
          >
            <motion.h2 
              className="text-4xl font-bold tracking-tight mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Our <span className="text-primary">Latest Collection</span>
            </motion.h2>
            <motion.p 
              className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Discover innovative tech to power your world and enhance your digital lifestyle.
            </motion.p>
          </motion.div>
          
          <Suspense fallback={<ProductDisplayFallback />}>
            <ProductDisplay initialProducts={products} />
          </Suspense>
        </div>
      </motion.section>
    </>
  );
}
