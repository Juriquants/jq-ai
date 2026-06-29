// web/app/page.tsx
// JQ.AI Web UI - Premium Entry Point

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0c0a0a] text-[#f5f0eb] font-sans">
      {/* Navigation */}
      <nav className="border-b border-[#2a2826] px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[#d4a853] font-serif text-2xl font-bold">JQ</span>
          <span className="text-[#8f8a86] text-sm font-light">AI</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-[#8f8a86]">
          <a href="#" className="hover:text-[#d4a853] transition-colors">Chat</a>
          <a href="#" className="hover:text-[#d4a853] transition-colors">Skills</a>
          <a href="#" className="hover:text-[#d4a853] transition-colors">Projects</a>
          <button className="bg-[#d4a853] text-[#0c0a0a] px-4 py-1.5 rounded-full text-sm font-medium hover:bg-[#b8923f] transition-colors">
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-8 py-24 text-center space-y-8">
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
          <button className="bg-[#d4a853] text-[#0c0a0a] px-8 py-3 rounded-full font-medium hover:bg-[#b8923f] transition-colors">
            Get Started
          </button>
          <button className="border border-[#2a2826] text-[#f5f0eb] px-8 py-3 rounded-full font-medium hover:border-[#d4a853]/50 transition-colors">
            Documentation
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#2a2826] px-8 py-6 text-center text-sm text-[#8f8a86]">
        <p>JQ.AI — Open-source legal intelligence.</p>
      </footer>
    </div>
  );
}
