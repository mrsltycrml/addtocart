"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user && window.location.pathname !== '/auth') {
        router.replace('/auth');
      }
    });
  }, [router]);
  return <>{children}</>;
} 