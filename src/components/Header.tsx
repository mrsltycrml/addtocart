'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PackageSearch, Menu, User } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { CartIcon } from '@/components/CartIcon';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const navLinks = (
  <>
    <Button variant="ghost" asChild>
      <Link href="/">Home</Link>
    </Button>
    <Button variant="ghost" asChild>
      <Link href="/products">Products</Link>
    </Button>
    <Button variant="ghost" asChild>
      <Link href="/cart">Cart</Link>
    </Button>
  </>
);

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for changes on auth state (signed in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out successfully",
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-20 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-10">
        <Link href="/" className="flex items-center gap-3" aria-label="IT Select Home">
          <PackageSearch className="h-9 w-9 text-primary" />
          <span className="text-3xl font-bold text-primary tracking-tight">IT Select</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2 sm:gap-4">
          {navLinks}
          <CartIcon />
          {user ? (
            <Button variant="ghost" onClick={handleSignOut}>
              Sign Out
            </Button>
          ) : (
            <Button variant="ghost" asChild>
              <Link href="/auth">
                <User className="mr-2 h-5 w-5" />
                Sign In
              </Link>
            </Button>
          )}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-7 w-7" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-6">
              <nav className="flex flex-col gap-6 mt-8">
                {navLinks}
                <CartIcon />
                {user ? (
                  <Button variant="ghost" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                ) : (
                  <Button variant="ghost" asChild>
                    <Link href="/auth">
                      <User className="mr-2 h-5 w-5" />
                      Sign In
                    </Link>
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
