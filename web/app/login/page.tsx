// web/app/login/page.tsx
// JQ.AI Web UI - Sign In Page

"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0c0a0a] text-[#f5f0eb] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-serif text-[#f5f0eb]">Sign In</h1>
          <p className="text-[#8f8a86] text-sm">Sign in to your JQ.AI account</p>
        </div>

        {/* Card */}
        <div className="bg-[#181514] border border-[#2a2826] rounded-2xl p-8 space-y-6">
          <form className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-[#8f8a86]">Email</label>
              <input
                type="email"
                className="w-full bg-[#0c0a0a] border border-[#2a2826] rounded-xl px-4 py-2 text-[#f5f0eb] focus:outline-none focus:border-[#d4a853] transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-[#8f8a86]">Password</label>
              <input
                type="password"
                className="w-full bg-[#0c0a0a] border border-[#2a2826] rounded-xl px-4 py-2 text-[#f5f0eb] focus:outline-none focus:border-[#d4a853] transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button className="w-full jq-button py-3 mt-4">Sign In</button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2a2826]"></div>
            </div>
            <div className="relative flex justify-center text-xs text-[#8f8a86] bg-[#181514] px-2">
              Or continue with
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full border border-[#2a2826] rounded-xl py-3 text-sm text-[#f5f0eb] hover:border-[#d4a853]/50 transition-colors">
              Google
            </button>
            <button className="w-full border border-[#2a2826] rounded-xl py-3 text-sm text-[#f5f0eb] hover:border-[#d4a853]/50 transition-colors">
              GitHub
            </button>
          </div>

          <div className="text-center text-sm text-[#8f8a86]">
            Don't have an account?{" "}
            <Link href="/signup" className="text-[#d4a853] hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
