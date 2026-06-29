// web/app/page.tsx
// JQ.AI Web UI - Premium Homepage

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Terminal, Shield, Code, Database } from "lucide-react";

export default function Home() {
  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  return (
    <div className="min-h-screen bg-[#0c0a0a] text-[#f5f0eb] font-sans">
      {/* Navigation */}
      <nav className="jq-container py-6 flex items-center justify-between border-b border-[#2a2826]">
        <div className="flex items-center gap-2">
          <span className="text-[#d4a853] font-serif text-2xl font-bold">JQ</span>
          <span className="text-[#8f8a86] text-sm font-light tracking-wider">AI</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-[#8f8a86]">
          <a href="#" className="hover:text-[#d4a853] transition-colors">Chat</a>
          <a href="#" className="hover:text-[#d4a853] transition-colors">Skills</a>
          <a href="#" className="hover:text-[#d4a853] transition-colors">Projects</a>
          <Link href="/login" className="jq-button text-sm px-5 py-2">Sign In</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="jq-container py-24 space-y-16">
        <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-block px-4 py-1.5 rounded-full border border-[#d4a853]/30 text-[#d4a853] text-xs font-medium tracking-wider uppercase">
            JQ.AI Web UI
          </div>
          <h1 className="text-5xl md:text-7xl font-serif tracking-tight text-[#f5f0eb] leading-[1.1]">
            Legal intelligence <br />
            <span className="text-[#d4a853]">for the African continent.</span>
          </h1>
          <p className="text-lg text-[#8f8a86] max-w-2xl mx-auto font-light leading-relaxed">
            Self-hosted, open-source AI for legal teams. Bring your own keys. Run it where you want. Own your data.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button className="jq-button text-base px-8 py-3">Get Started</button>
            <button className="jq-button-outline text-base px-8 py-3">Documentation</button>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="jq-card space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#d4a853]/10 flex items-center justify-center text-[#d4a853]">
              <Terminal size={20} />
            </div>
            <h3 className="text-xl font-serif text-[#f5f0eb]">Local Inference</h3>
            <p className="text-sm text-[#8f8a86]">Run models on your own infrastructure. No data leaves your environment.</p>
          </div>
          <div className="jq-card space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#d4a853]/10 flex items-center justify-center text-[#d4a853]">
              <Shield size={20} />
            </div>
            <h3 className="text-xl font-serif text-[#f5f0eb]">Verifiable Citations</h3>
            <p className="text-sm text-[#8f8a86]">Every citation is verified against source documents at character precision.</p>
          </div>
          <div className="jq-card space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#d4a853]/10 flex items-center justify-center text-[#d4a853]">
              <Code size={20} />
            </div>
            <h3 className="text-xl font-serif text-[#f5f0eb]">Open Source Skills</h3>
            <p className="text-sm text-[#8f8a86]">Reusable legal skills written in the agentskills.io format, forkable by anyone.</p>
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="border-t border-[#2a2826] pt-8 text-center text-sm text-[#8f8a86]">
          <p>JQ.AI — Open-source legal intelligence. Apache 2.0.</p>
        </footer>
      </main>
    </div>
  );
}
