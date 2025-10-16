"use client";
import React from "react";
import { FloatingElements } from "@/components/auth/(register)/floatingelements";
import { RegisterForm } from "@/components/auth/(register)/registerForm";
import Header from "@/components/(home)/layout/header";
import { Benefits } from "@/components/auth/(register)/benefits";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <FloatingElements />
      <Header />

      <div className="relative z-10 flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <Benefits />
          <RegisterForm />
        </div>
      </div>


      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
    </div>
  );
}
