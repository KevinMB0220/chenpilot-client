"use client";
import React from "react";
import { Github, Twitter, FileText, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-black">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="absolute top-0 left-0 right-0 h-px bg-white/10"></div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
          <div className="md:col-span-1">
            <span className="text-2xl font-thin text-white tracking-wide">
              ChenPilot
            </span>
            <p className="text-sm text-white/40 font-light mt-4 leading-relaxed">
              Your intelligent agent for crypto trading across chains
            </p>
          </div>

          <div>
            <h3 className="text-xs text-white/60 font-light tracking-wider uppercase mb-6">
              Product
            </h3>
            <ul className="space-y-4">
              {["Features", "Pricing", "Integrations", "API"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-white/40 hover:text-white font-light transition-colors duration-300"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs text-white/60 font-light tracking-wider uppercase mb-6">
              Resources
            </h3>
            <ul className="space-y-4">
              {["Documentation", "Guides", "Support", "Status"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-white/40 hover:text-white font-light transition-colors duration-300"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs text-white/60 font-light tracking-wider uppercase mb-6">
              Company
            </h3>
            <ul className="space-y-4">
              {["About", "Blog", "Careers", "Contact"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-white/40 hover:text-white font-light transition-colors duration-300"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-8">
              <p className="text-xs text-white/30 font-light">
                © {currentYear} ChenPilot. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                {["Privacy", "Terms", "Security"].map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="text-xs text-white/30 hover:text-white/60 font-light transition-colors duration-300"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {[
                { icon: Github, href: "#", label: "GitHub" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: FileText, href: "#", label: "Docs" },
                { icon: Mail, href: "#", label: "Email" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-white/30 hover:text-white transition-colors duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
