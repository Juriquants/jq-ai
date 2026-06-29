// web/app/dashboard/page.tsx
// JQ.AI Web UI - Protected Dashboard

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("jqai_token");
    if (!token) {
      router.push("/login");
      return;
    }
    // For now, we just show a welcome message
    setUser("User");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0c0a0a] text-[#f5f0eb] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif text-[#f5f0eb]">Dashboard</h1>
        <p className="text-[#8f8a86] mt-2">Welcome back, {user}.</p>
        <button
          onClick={() => {
            localStorage.removeItem("jqai_token");
            router.push("/login");
          }}
          className="jq-button mt-6"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
