"use client";
import React from "react";
import Image from "next/image";

const logos = [
  { name: "Starknet", src: "/starknet.jpg", alt: "Starknet Logo" },
  { name: "Vesu", src: "/vesu.jpg", alt: "Vesu Logo" },
  { name: "Atomiq", src: "/atomiq.jpg", alt: "Atomiq Logo" },
  { name: "Troves", src: "/troves.jpg", alt: "Troves Logo" },
  { name: "Xverse", src: "/xverse.jpg", alt: "Xverse Logo" },
];

export default function Logos() {
  return (
    <section className="relative py-32 bg-black">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="absolute top-0 left-0 right-0 h-px bg-white/10"></div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="text-xs text-white/40 font-light tracking-[0.3em] uppercase mb-4 block">
            Integrations
          </span>
          <h2 className="text-4xl md:text-5xl font-thin text-white mb-4">
            Built on <span className="text-purple-500">Trusted</span>{" "}
            Infrastructure
          </h2>
          <p className="text-base text-white/40 max-w-lg mx-auto font-light">
            Seamlessly connected to leading protocols across the ecosystem
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-16 lg:gap-24">
          {logos.map((logo, idx) => (
            <div key={idx} className="group relative">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={80}
                height={80}
                className="w-20 h-20 object-cover rounded-full grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
              />
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="text-xs text-white/30 font-light opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {logo.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 flex items-center justify-center gap-3">
          <span className="text-xs text-white/30 font-light tracking-wider">
            AND MORE
          </span>
          <div className="flex gap-1">
            <div className="w-1 h-1 rounded-full bg-white/20"></div>
            <div className="w-1 h-1 rounded-full bg-white/20"></div>
            <div className="w-1 h-1 rounded-full bg-white/20"></div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10"></div>
    </section>
  );
}
