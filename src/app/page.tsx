'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store';
import { Button } from '@/components/ui/Button';
import { 
  ArrowRight
} from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      title: 'AI-Powered Agent',
      description: 'Natural language interface for complex DeFi operations',
    },
    {
      title: 'Cross-Chain Swaps',
      description: 'Seamless Bitcoin to Starknet asset swaps',
    },
    {
      title: 'Secure & Trustless',
      description: 'No counterparty risk with decentralized operations',
    },
    {
      title: 'Multi-Chain Support',
      description: 'Unified interface for Bitcoin and Starknet',
    },
  ];

  const capabilities = [
    'Swap 100k sats to STRK and lend it on Vesu',
    'Send 20 USDC from Starknet to Bitcoin Lightning',
    'Deploy a new Starknet account and fund it',
    'Create a contact for 0x123...abc',
    'What is my current wallet balance?',
    'Show me my recent transactions',
  ];

  const logos = [
    { name: 'Starknet', src: '/starknet.jpg', alt: 'Starknet Logo' },
    { name: 'Vesu', src: '/vesu.jpg', alt: 'Vesu Logo' },
    { name: 'Atomiq', src: '/atomiq.jpg', alt: 'Atomiq Logo' },
    { name: 'Troves', src: '/troves.jpg', alt: 'Troves Logo' },
    { name: 'Xverse', src: '/xverse.jpg', alt: 'Xverse Logo' },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Simple Background */}
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
            
            <nav className="hidden md:flex items-center space-x-8">
            
            </nav>

            <div className="flex items-center space-x-4">
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
              
              {isAuthenticated ? (
                <Button
                  onClick={() => router.push('/chat')}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Go to Chat
                </Button>
              ) : (
                <Button
                  onClick={() => router.push('/auth/login')}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Get Started
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-bold mb-8">
              <span className="text-purple-400">
                A Fast Blockchain.
              </span>
              <br />
              <span className="text-white">
                Scalable AI.
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              Our technology performing fast blockchain (120K TPS) and it has guaranteed AI-based data security. 
              Proof of Stake, its consensus algorithm enables unlimited speeds.
            </p>

            <div className="flex justify-center items-center">
              <Button
                onClick={() => router.push(isAuthenticated ? '/chat' : '/auth/login')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>


        {/* Features Section */}
        <section id="features" className="py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-purple-400">
                  Powerful Features
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Experience the future of DeFi with our cutting-edge AI technology
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                return (
                  <div
                    key={index}
                    className="group relative p-8 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-gray-700 transition-all duration-300 hover:transform hover:scale-105"
                  >
                    <h3 className="text-xl font-semibold mb-4 text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Partners/Logos Section */}
        <section className="py-20 bg-gray-900/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="text-gray-300">
                  Trusted by Leading
                </span>
                <br />
                <span className="text-purple-400">
                  DeFi Platforms
                </span>
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Integrated with the most innovative protocols in the ecosystem
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center justify-items-center">
              {logos.map((logo, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center"
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={160}
                    height={160}
                    className="w-32 h-32 object-cover rounded-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Capabilities Section */}
        <section id="capabilities" className="py-32 bg-gray-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-blue-400">
                  What You Can Do
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Just ask in natural language and watch the magic happen
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {capabilities.map((capability, index) => (
                <div
                  key={index}
                  className="group p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl hover:border-gray-700 transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <p className="text-gray-300 group-hover:text-white transition-colors">
                      {capability}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              <span className="text-purple-400">
                Ready to Experience
              </span>
              <br />
              <span className="text-white">the Future of DeFi?</span>
            </h2>
            
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Join thousands of users who are already using ChenPilot to simplify their DeFi operations
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => router.push(isAuthenticated ? '/chat' : '/auth/login')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl"
              >
                Start Chatting Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <span className="text-lg font-bold text-purple-400">
                ChenPilot
              </span>
            </div>
            
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>

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