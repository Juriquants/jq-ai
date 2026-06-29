// web/app/dashboard/page.tsx
// JQ.AI Web UI - Premium Dashboard with Projects, Account, Settings

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  User,
  Settings,
  Key,
  Moon,
  Sun,
  LogOut,
  Save,
  Check,
  X,
  Eye,
  EyeOff,
} from "lucide-react";

// ----------------------------
// Types
// ----------------------------

interface Project {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

interface ApiKey {
  id: string;
  name: string;
  created_at: string;
  last_used: string | null;
}

// ----------------------------
// Main Dashboard Component
// ----------------------------

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"projects" | "account" | "settings">("projects");
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // Projects state
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [creating, setCreating] = useState(false);

  // Account state
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // API Keys state
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [creatingKey, setCreatingKey] = useState(false);
  const [revealedKey, setRevealedKey] = useState<string | null>(null);

  // Settings state
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [notifications, setNotifications] = useState(true);

  // ----------------------------
  // Auth & Initialization
  // ----------------------------

  useEffect(() => {
    const savedTheme = localStorage.getItem("jqai_theme") as "dark" | "light" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme("dark");
    }

    const token = localStorage.getItem("jqai_token");
    if (!token) {
      router.push("/login");
      return;
    }
    setToken(token);
    fetchProjects(token);
    fetchApiKeys(token);
    fetchUser(token);
    setLoading(false);
  }, []);

  const applyTheme = (theme: "dark" | "light") => {
    if (theme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
    localStorage.setItem("jqai_theme", theme);
  };

  // ----------------------------
  // API Calls
  // ----------------------------

  const fetchProjects = async (token: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProjects(data);
    } catch {
      // fallback
    }
  };

  const fetchUser = async (token: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setEmail(data.email);
    } catch {
      // fallback
    }
  };

  const fetchApiKeys = async (token: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api-keys`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setApiKeys(data);
    } catch {
      // fallback
    }
  };

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim() || !token) return;
    setCreating(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newProjectName }),
      });
      if (!res.ok) throw new Error();
      await fetchProjects(token);
      setNewProjectName("");
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      await fetchProjects(token);
    } catch (err) {
      console.error(err);
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMessage("Passwords do not match.");
      setPasswordSuccess(false);
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMessage("Password must be at least 6 characters.");
      setPasswordSuccess(false);
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      });
      if (!res.ok) throw new Error();
      setPasswordMessage("Password updated successfully.");
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordMessage("Failed to update password.");
      setPasswordSuccess(false);
    }
  };

  const createApiKey = async () => {
    if (!newKeyName.trim() || !token) return;
    setCreatingKey(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api-keys`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newKeyName }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setRevealedKey(data.key);
      await fetchApiKeys(token);
      setNewKeyName("");
    } catch (err) {
      console.error(err);
    } finally {
      setCreatingKey(false);
    }
  };

  const revokeApiKey = async (id: string) => {
    if (!confirm("Revoke this API key? This action cannot be undone.")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api-keys/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      await fetchApiKeys(token);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("jqai_token");
    router.push("/login");
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  // ----------------------------
  // UI Helpers
  // ----------------------------

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0a0a] text-[#f5f0eb] flex items-center justify-center">
        <div className="text-[#d4a853] animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0a0a] text-[#f5f0eb] flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#2a2826] flex flex-col h-screen fixed left-0 top-0 bg-[#0c0a0a] z-10 hidden md:flex">
        <div className="p-6 border-b border-[#2a2826]">
          <div className="flex items-center gap-2">
            <span className="text-[#d4a853] font-serif text-2xl font-bold">JQ</span>
            <span className="text-[#8f8a86] text-sm font-light tracking-wider">AI</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveTab("projects")}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm transition-colors ${
              activeTab === "projects"
                ? "bg-[#d4a853]/10 text-[#d4a853]"
                : "text-[#8f8a86] hover:text-[#f5f0eb] hover:bg-[#181514]"
            }`}
          >
            <FolderOpen size={18} /> Projects
          </button>
          <button
            onClick={() => setActiveTab("account")}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm transition-colors ${
              activeTab === "account"
                ? "bg-[#d4a853]/10 text-[#d4a853]"
                : "text-[#8f8a86] hover:text-[#f5f0eb] hover:bg-[#181514]"
            }`}
          >
            <User size={18} /> Account
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm transition-colors ${
              activeTab === "settings"
                ? "bg-[#d4a853]/10 text-[#d4a853]"
                : "text-[#8f8a86] hover:text-[#f5f0eb] hover:bg-[#181514]"
            }`}
          >
            <Settings size={18} /> Settings
          </button>
        </nav>
        <div className="p-4 border-t border-[#2a2826]">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-[#8f8a86] hover:text-[#f5f0eb] hover:bg-[#181514] transition-colors"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 md:p-10">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between mb-8 border-b border-[#2a2826] pb-4">
          <div className="flex items-center gap-2">
            <span className="text-[#d4a853] font-serif text-2xl font-bold">JQ</span>
            <span className="text-[#8f8a86] text-sm font-light tracking-wider">AI</span>
          </div>
          <button onClick={handleSignOut} className="jq-button-outline text-sm px-3 py-1.5">
            Sign Out
          </button>
        </div>

        <AnimatePresence mode="wait">
          {/* Projects Tab */}
          {activeTab === "projects" && (
            <motion.div
              key="projects"
              {...fadeUp}
              className="space-y-8"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-3xl md:text-4xl font-serif text-[#f5f0eb]">Your Projects</h1>
                <form onSubmit={createProject} className="flex gap-3 w-full sm:w-auto">
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="New project name"
                    className="bg-[#181514] border border-[#2a2826] rounded-xl px-4 py-2 text-[#f5f0eb] focus:outline-none focus:border-[#d4a853] transition-colors text-sm w-full sm:w-48"
                  />
                  <button
                    type="submit"
                    disabled={creating || !newProjectName.trim()}
                    className="jq-button text-sm px-4 py-2 disabled:opacity-50"
                  >
                    {creating ? "..." : <Plus size={16} />}
                  </button>
                </form>
              </div>

              {projects.length === 0 ? (
                <div className="text-[#8f8a86] text-center py-16 border border-[#2a2826] rounded-2xl">
                  <FolderOpen size={48} className="mx-auto text-[#2a2826] mb-4" />
                  <p className="text-lg">No projects yet</p>
                  <p className="text-sm mt-2">Create your first project above.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      {...fadeUp}
                      transition={{ delay: index * 0.05 }}
                      className="jq-card group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-serif text-[#f5f0eb] group-hover:text-[#d4a853] transition-colors">
                            {project.name}
                          </h3>
                          {project.description && (
                            <p className="text-sm text-[#8f8a86] mt-1">{project.description}</p>
                          )}
                          <p className="text-xs text-[#8f8a86] mt-2">
                            {new Date(project.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteProject(project.id)}
                          className="text-[#8f8a86] hover:text-[#f85149] transition-colors p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Account Tab */}
          {activeTab === "account" && (
            <motion.div key="account" {...fadeUp} className="space-y-10 max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-serif text-[#f5f0eb]">Account</h1>

              {/* Profile Section */}
              <section className="space-y-4">
                <h2 className="text-xl font-serif text-[#f5f0eb]">Profile</h2>
                <div className="jq-card">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#d4a853]/20 flex items-center justify-center text-[#d4a853] text-lg font-bold">
                      {email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm text-[#8f8a86]">Email</p>
                      <p className="font-medium text-[#f5f0eb]">{email}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Change Password */}
              <section className="space-y-4">
                <h2 className="text-xl font-serif text-[#f5f0eb]">Change Password</h2>
                <div className="jq-card space-y-4">
                  {passwordMessage && (
                    <div
                      className={`p-3 rounded-lg text-sm ${
                        passwordSuccess
                          ? "bg-[#3fb950]/10 border border-[#3fb950]/30 text-[#3fb950]"
                          : "bg-[#f85149]/10 border border-[#f85149]/30 text-[#f85149]"
                      }`}
                    >
                      {passwordMessage}
                    </div>
                  )}
                  <form onSubmit={changePassword} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-[#8f8a86]">Current Password</label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        className="w-full bg-[#0c0a0a] border border-[#2a2826] rounded-xl px-4 py-2 text-[#f5f0eb] focus:outline-none focus:border-[#d4a853] transition-colors"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-[#8f8a86]">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="w-full bg-[#0c0a0a] border border-[#2a2826] rounded-xl px-4 py-2 text-[#f5f0eb] focus:outline-none focus:border-[#d4a853] transition-colors"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-[#8f8a86]">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full bg-[#0c0a0a] border border-[#2a2826] rounded-xl px-4 py-2 text-[#f5f0eb] focus:outline-none focus:border-[#d4a853] transition-colors"
                        placeholder="••••••••"
                      />
                    </div>
                    <button type="submit" className="jq-button text-sm px-6 py-2">
                      <Save size={16} className="mr-2" /> Update Password
                    </button>
                  </form>
                </div>
              </section>

              {/* API Keys */}
              <section className="space-y-4">
                <h2 className="text-xl font-serif text-[#f5f0eb]">API Keys</h2>
                <div className="jq-card space-y-4">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="Key name"
                      className="flex-1 bg-[#0c0a0a] border border-[#2a2826] rounded-xl px-4 py-2 text-[#f5f0eb] focus:outline-none focus:border-[#d4a853] transition-colors text-sm"
                    />
                    <button
                      onClick={createApiKey}
                      disabled={creatingKey || !newKeyName.trim()}
                      className="jq-button text-sm px-4 py-2 disabled:opacity-50"
                    >
                      {creatingKey ? "..." : <Plus size={16} />}
                    </button>
                  </div>

                  {revealedKey && (
                    <div className="bg-[#0c0a0a] border border-[#d4a853]/30 rounded-xl p-4 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs text-[#8f8a86]">New API Key</p>
                        <p className="font-mono text-sm break-all text-[#d4a853]">{revealedKey}</p>
                        <p className="text-xs text-[#f85149] mt-1">Copy this key now. It will not be shown again.</p>
                      </div>
                      <button
                        onClick={() => setRevealedKey(null)}
                        className="text-[#8f8a86] hover:text-[#f5f0eb]"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}

                  {apiKeys.length === 0 ? (
                    <p className="text-sm text-[#8f8a86] text-center py-4">No API keys created yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {apiKeys.map((key) => (
                        <div key={key.id} className="flex items-center justify-between border-b border-[#2a2826] pb-3 last:border-0 last:pb-0">
                          <div>
                            <p className="text-sm font-medium text-[#f5f0eb]">{key.name}</p>
                            <p className="text-xs text-[#8f8a86]">
                              Created {new Date(key.created_at).toLocaleDateString()}
                              {key.last_used && ` · Last used ${new Date(key.last_used).toLocaleDateString()}`}
                            </p>
                          </div>
                          <button
                            onClick={() => revokeApiKey(key.id)}
                            className="text-[#8f8a86] hover:text-[#f85149] transition-colors text-sm"
                          >
                            Revoke
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <motion.div key="settings" {...fadeUp} className="space-y-10 max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-serif text-[#f5f0eb]">Settings</h1>

              {/* Theme */}
              <section className="space-y-4">
                <h2 className="text-xl font-serif text-[#f5f0eb]">Appearance</h2>
                <div className="jq-card flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#f5f0eb]">Theme</p>
                    <p className="text-sm text-[#8f8a86]">Switch between dark and light mode</p>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#d4a853]/10 text-[#d4a853] hover:bg-[#d4a853]/20 transition-colors"
                  >
                    {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
                    <span className="text-sm capitalize">{theme}</span>
                  </button>
                </div>
              </section>

              {/* Notifications */}
              <section className="space-y-4">
                <h2 className="text-xl font-serif text-[#f5f0eb]">Notifications</h2>
                <div className="jq-card flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#f5f0eb]">Email Notifications</p>
                    <p className="text-sm text-[#8f8a86]">Receive updates about your projects and account</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications}
                      onChange={() => setNotifications(!notifications)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#2a2826] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#d4a853]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#f5f0eb] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4a853]"></div>
                  </label>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
