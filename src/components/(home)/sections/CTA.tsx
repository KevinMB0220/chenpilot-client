"use client";
import React from "react";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function CTA() {
  const router = useRouter();
  const { isAuthenticated, isClient } = useAuth();

  return (
    <section className="relative py-40 bg-black">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="absolute top-0 left-0 right-0 h-px bg-white/10"></div>

      <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <div className="mb-8">
          <span className="text-xs text-white/40 font-light tracking-[0.3em] uppercase">
            Get Started Today
          </span>
        </div>

        <h2 className="text-6xl md:text-7xl font-thin tracking-tight mb-8">
          <span className="block text-white/90 mb-2">Ready to</span>
          <span className="block text-purple-500">Trade Smarter?</span>
        </h2>

        <p className="text-lg text-white/40 mb-16 max-w-xl mx-auto font-light leading-relaxed">
          Join the next generation of traders using AI to navigate DeFi
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={() =>
              router.push(isClient && isAuthenticated ? "/chat" : "/auth/login")
            }
            className="group px-10 py-4 text-base font-light rounded-full bg-white text-black hover:bg-white/90 transition-all duration-500"
          >
            <span className="flex items-center gap-3">
              Start Trading
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-500" />
            </span>
          </Button>

          <button className="px-10 py-4 text-base font-light rounded-full border border-white/10 text-white/60 hover:text-white/90 hover:border-white/20 transition-all duration-500">
            Watch Demo
          </button>
        </div>

        <div className="mt-16 flex items-center justify-center gap-8 text-sm text-white/30 font-light">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            <span>No credit card required</span>
          </div>
          <span className="w-px h-4 bg-white/10"></span>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            <span>Free to start</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10"></div>
    </section>
  );
}
