'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch } from '@/store';
import { register as registerUser } from '@/store/slices/authSlice';
import { registerSchema } from '@/utils/validation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { GoogleSignInButton } from '@/components/auth/GoogleSignIn';
import { 
  Eye, 
  EyeOff, 
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface RegisterFormData {
  email: string;
  password: string;
  name?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // Debug: Log the form data to see what's being submitted
      console.log('Registration form data:', data);
      console.log('Data types:', {
        email: typeof data.email,
        password: typeof data.password,
        name: typeof data.name
      });

      // Ensure all required fields are present and are strings
      if (!data.email || typeof data.email !== 'string') {
        throw new Error('Email is required and must be a string');
      }
      if (!data.password || typeof data.password !== 'string') {
        throw new Error('Password is required and must be a string');
      }

      // Ensure name is a string if provided
      const cleanData = {
        email: String(data.email),
        password: String(data.password),
        name: data.name !== undefined && data.name !== null ? String(data.name) : undefined
      };

      // Log cleanData types for debugging
      Object.entries(cleanData).forEach(([key, value]) => {
        console.log(`${key}:`, value, 'type:', typeof value);
      });

      const result = await dispatch(registerUser(cleanData)).unwrap();
      toast.success('Account created successfully! Welcome to ChenPilot!');
      router.push('/chat');
    } catch (error: any) {
      // Normalize common Axios/thunk error shapes to user-friendly message
      const backendMessage = error?.message
        || error?.response?.data?.message
        || error?.payload
        || error?.error
        || 'Registration failed';
      toast.error(String(backendMessage));
    }
  };

  const benefits = [
    { title: 'AI Assistant', description: 'Get help with complex DeFi operations' },
    { title: 'Fast Transactions', description: '120K TPS blockchain performance' },
    { title: 'Secure Wallet', description: 'Your keys, your crypto' },
    { title: 'Multi-Chain', description: 'Bitcoin & Starknet support' },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0">
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-purple-400">
                ChenPilot
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <a href="#" className="p-2 text-gray-400 hover:text-white transition-colors">
                GitHub
              </a>
              <a href="#" className="p-2 text-gray-400 hover:text-white transition-colors">
                Twitter
              </a>
              <a href="#" className="p-2 text-gray-400 hover:text-white transition-colors">
                Docs
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Benefits */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="text-purple-400">
                  Join ChenPilot
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Create your account and start your journey into the future of DeFi with AI-powered assistance.
              </p>
            </div>

            <div className="space-y-4">
              {benefits.map((benefit, index) => {
                return (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl hover:border-gray-700 transition-all duration-300"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-6 bg-purple-900/50 border border-purple-800 rounded-2xl">
              <div className="flex items-center space-x-3 mb-3">
                <h3 className="text-lg font-semibold text-white">Free to Start</h3>
              </div>
              <p className="text-gray-300">
                No hidden fees, no monthly subscriptions. Start using ChenPilot completely free and upgrade when you need advanced features.
              </p>
            </div>
          </div>

          {/* Right Side - Register Form */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
                <p className="text-gray-400">Join the future of DeFi</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <Input
                      {...register('name')}
                      type="text"
                      id="name"
                      placeholder="Enter your full name"
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Input
                      {...register('email')}
                      type="email"
                      id="email"
                      placeholder="Enter your email"
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      placeholder="Create a strong password"
                      className="pr-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-white" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-white" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700 rounded bg-gray-800"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
                    I agree to the{' '}
                    <a href="#" className="text-purple-400 hover:text-purple-300">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-purple-400 hover:text-purple-300">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Creating account...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      Create Account
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </div>
                  )}
                </Button>
              </form>

              {/* Google Sign-in */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
                  </div>
                </div>

                <div className="mt-4">
                  <GoogleSignInButton
                    onSuccess={() => {
                      router.push('/chat');
                    }}
                    onError={(error) => {
                      console.error('Google Sign-in error:', error);
                    }}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-gray-400">
                  Already have an account?{' '}
                  <Link
                    href="/auth/login"
                    className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 animate-float">
        </div>
        
        <div className="absolute top-32 right-32 animate-float-delayed">
        </div>

        <div className="absolute bottom-20 left-1/3 animate-float-slow">
        </div>

      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}