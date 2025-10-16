"use client";
import React from "react";
import Header from "@/components/(home)/layout/header";
import Features from "@/components/auth/(login)/features";
import LoginForm from "@/components/auth/(login)/loginform";
import FloatingElements from "@/components/auth/(login)/floatingelements";
import AnimatedBackground from "@/components/auth/(login)/animatedbackground";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <AnimatedBackground />
      <Header />

      <div className="relative z-10 flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <Features />
          <LoginForm />
        </div>
      </div>

      <FloatingElements />
    </div>
  );
}
