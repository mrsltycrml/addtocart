'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        router.replace('/');
      }
    });
  }, [router]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match.',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) throw error;
      toast({
        title: 'Success!',
        description: 'Check your email for the confirmation link.',
      });
      setIsLogin(true);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
      });
      router.replace('/');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#181b20]">
      <div className="bg-[#23272f] p-10 rounded-xl shadow-lg w-full max-w-md flex flex-col items-center">
        <div className="bg-[#232f4b] rounded-full p-4 mb-4">
          {isLogin ? (
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path fill="#3b82f6" d="M12.707 2.293a1 1 0 0 0-1.414 0l-9 9a1 1 0 0 0 1.414 1.414L4 12.414V20a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4h2v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414l-9-9z"/></svg>
          ) : (
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path fill="#3b82f6" d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm-7 9a7 7 0 0 1 14 0H5z"/></svg>
          )}
        </div>
        <h2 className="text-3xl font-bold mb-2 text-white">
          {isLogin ? 'Welcome Back!' : 'Create an Account'}
        </h2>
        <p className="mb-6 text-gray-400 text-center">
          {isLogin
            ? 'Log in to access your account and orders.'
            : 'Join IT Select to discover amazing tech products.'}
        </p>
        <form className="w-full flex flex-col gap-4" onSubmit={isLogin ? handleSignIn : handleSignUp}>
          {!isLogin && (
            <div>
              <label className="text-gray-300 text-sm">Full Name</label>
              <Input
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="mt-1 p-2 rounded bg-[#181b20] text-white border border-gray-700"
              />
            </div>
          )}
          <div>
            <label className="text-gray-300 text-sm">Email Address</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 p-2 rounded bg-[#181b20] text-white border border-gray-700"
            />
          </div>
          <div>
            <label className="text-gray-300 text-sm">Password</label>
            <Input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 p-2 rounded bg-[#181b20] text-white border border-gray-700"
            />
          </div>
          {!isLogin && (
            <div>
              <label className="text-gray-300 text-sm">Confirm Password</label>
              <Input
                type="password"
                placeholder="********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 p-2 rounded bg-[#181b20] text-white border border-gray-700"
              />
            </div>
          )}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded mt-2 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {isLogin ? (
              <>
                <svg className="mr-2" width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M10 17l5-5-5-5v10z"/></svg>
                Log In
              </>
            ) : (
              <>
                <svg className="mr-2" width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm-7 9a7 7 0 0 1 14 0H5z"/></svg>
                Sign Up
              </>
            )}
          </Button>
        </form>
        {isLogin ? (
          <div className="mt-4 text-gray-400 text-sm">
            Don&apos;t have an account?{' '}
            <button
              className="text-blue-400 hover:underline"
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>
        ) : (
          <div className="mt-4 text-gray-400 text-sm">
            Already have an account?{' '}
            <button
              className="text-blue-400 hover:underline"
              onClick={() => setIsLogin(true)}
            >
              Log In
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 