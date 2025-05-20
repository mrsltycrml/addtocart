'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const supabase = getSupabaseClient();

const signUpSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type SignUpFormData = z.infer<typeof signUpSchema>;
type SignInFormData = z.infer<typeof signInSchema>;

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        router.replace('/');
      }
    });
  }, [router]);

  const handleSignUp = async (data: SignUpFormData) => {
    setLoading(true);
    try {
      const { error: signUpError, data: signUpData } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { full_name: data.fullName },
        },
      });
      
      if (signUpError) throw signUpError;
      
      if (signUpData.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: signUpData.user.id,
              full_name: data.fullName,
            },
          ]);

        if (profileError) throw profileError;
      }
      
      toast({
        title: 'Success!',
        description: 'Check your email for the confirmation link.',
      });
      setIsLogin(true);
      signUpForm.reset();
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

  const handleSignIn = async (data: SignInFormData) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
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

        {isLogin ? (
          <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="w-full space-y-4">
            <div>
              <label className="text-gray-300 text-sm">Email Address</label>
              <Input
                type="email"
                placeholder="you@example.com"
                {...signInForm.register('email')}
                className="mt-1 p-2 rounded bg-[#181b20] text-white border border-gray-700"
              />
              {signInForm.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">{signInForm.formState.errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="text-gray-300 text-sm">Password</label>
              <Input
                type="password"
                placeholder="********"
                {...signInForm.register('password')}
                className="mt-1 p-2 rounded bg-[#181b20] text-white border border-gray-700"
              />
              {signInForm.formState.errors.password && (
                <p className="text-red-500 text-sm mt-1">{signInForm.formState.errors.password.message}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded mt-2 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <svg className="mr-2" width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M10 17l5-5-5-5v10z"/></svg>
                  Log In
                </>
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="w-full space-y-4">
            <div>
              <label className="text-gray-300 text-sm">Full Name</label>
              <Input
                type="text"
                placeholder="John Doe"
                {...signUpForm.register('fullName')}
                className="mt-1 p-2 rounded bg-[#181b20] text-white border border-gray-700"
              />
              {signUpForm.formState.errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{signUpForm.formState.errors.fullName.message}</p>
              )}
            </div>
            <div>
              <label className="text-gray-300 text-sm">Email Address</label>
              <Input
                type="email"
                placeholder="you@example.com"
                {...signUpForm.register('email')}
                className="mt-1 p-2 rounded bg-[#181b20] text-white border border-gray-700"
              />
              {signUpForm.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">{signUpForm.formState.errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="text-gray-300 text-sm">Password</label>
              <Input
                type="password"
                placeholder="********"
                {...signUpForm.register('password')}
                className="mt-1 p-2 rounded bg-[#181b20] text-white border border-gray-700"
              />
              {signUpForm.formState.errors.password && (
                <p className="text-red-500 text-sm mt-1">{signUpForm.formState.errors.password.message}</p>
              )}
            </div>
            <div>
              <label className="text-gray-300 text-sm">Confirm Password</label>
              <Input
                type="password"
                placeholder="********"
                {...signUpForm.register('confirmPassword')}
                className="mt-1 p-2 rounded bg-[#181b20] text-white border border-gray-700"
              />
              {signUpForm.formState.errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{signUpForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded mt-2 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <svg className="mr-2" width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm-7 9a7 7 0 0 1 14 0H5z"/></svg>
                  Sign Up
                </>
              )}
            </Button>
          </form>
        )}

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