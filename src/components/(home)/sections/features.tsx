"use client";
import React from "react";

const features = [
  {
    title: "Conversational Trading",
    description: "Execute complex trades through natural dialogue",
    stat: "< 2s",
  },
  {
    title: "Cross-Chain",
    description: "Bridge assets seamlessly across networks",
    stat: "3 Chains",
  },
  {
    title: "Zero Trust",
    description: "Non-custodial architecture, you control everything",
    stat: "100%",
  },
  {
    title: "Always Learning",
    description: "AI that adapts to your trading patterns",
    stat: "24/7",
  },
];

export default function Features() {
  return (
    <section className="relative py-40 bg-black">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-24">
          <span className="text-xs text-white/40 font-light tracking-[0.3em] uppercase mb-4 block">
            Core Capabilities
          </span>
          <h2 className="text-5xl md:text-6xl font-thin text-white mb-6">
            Built for <span className="text-purple-500">Speed</span>
          </h2>
          <p className="text-lg text-white/40 max-w-xl mx-auto font-light">
            Everything you need to trade smarter, faster, and more efficiently
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group relative p-10 bg-black hover:bg-white/[0.02] transition-all duration-500"
            >
              <div className="absolute top-0 left-0 w-full h-px bg-white/10"></div>
              <div className="absolute bottom-0 left-0 w-full h-px bg-white/10"></div>
              <div className="absolute top-0 left-0 w-px h-full bg-white/10"></div>
              <div className="absolute top-0 right-0 w-px h-full bg-white/10"></div>

              <div className="text-3xl font-thin text-white/60 mb-6 group-hover:text-purple-500 transition-colors duration-500">
                {feature.stat}
              </div>

              <h3 className="text-lg font-light text-white mb-3">
                {feature.title}
              </h3>

              <p className="text-sm text-white/40 font-light leading-relaxed">
                {feature.description}
              </p>

              <div className="absolute bottom-0 left-0 w-0 h-px bg-purple-500 group-hover:w-full transition-all duration-700"></div>
            </div>
          ))}
        </div>

        <div className="mt-24 text-center">
          <div className="inline-flex items-center gap-8 px-8 py-4 border border-white/10">
            <div className="text-center">
              <div className="text-2xl font-thin text-white mb-1">0.1%</div>
              <div className="text-xs text-white/40 font-light">FEES</div>
            </div>
            <span className="w-px h-8 bg-white/10"></span>
            <div className="text-center">
              <div className="text-2xl font-thin text-white mb-1">Instant</div>
              <div className="text-xs text-white/40 font-light">EXECUTION</div>
            </div>
            <span className="w-px h-8 bg-white/10"></span>
            <div className="text-center">
              <div className="text-2xl font-thin text-white mb-1">Secure</div>
              <div className="text-xs text-white/40 font-light">ALWAYS</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
