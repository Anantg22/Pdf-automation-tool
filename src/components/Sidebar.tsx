'use client';

import { FileText, LayoutDashboard, Settings, LogOut, HelpCircle } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-[var(--sidebar-bg)] border-r border-[var(--border-color)] p-6 flex flex-col sticky top-0">
      {/* Logo */}
      <div className="mb-12">
        <h1 className="text-xl font-bold text-white tracking-tight">CertGen</h1>
        <p className="text-xs text-[var(--text-secondary)] mt-1">Certificate Platform</p>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col gap-2">
        <NavItem icon={LayoutDashboard} label="Dashboard" active />
        <NavItem icon={FileText} label="Templates" />
        <NavItem icon={Settings} label="Settings" />
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-[var(--border-color)] pt-4 flex flex-col gap-3">
        <NavItem icon={HelpCircle} label="Help & Support" isSmall />
        <NavItem icon={LogOut} label="Sign Out" isSmall />
      </div>
    </aside>
  );
}

function NavItem({ 
  icon: Icon, 
  label, 
  active = false,
  isSmall = false 
}: { 
  icon: any; 
  label: string; 
  active?: boolean;
  isSmall?: boolean;
}) {
  return (
    <button
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
        active
          ? 'bg-[var(--accent-primary)] text-white'
          : 'text-[var(--text-secondary)] hover:bg-[var(--card-bg)] hover:text-[var(--foreground)]'
      } ${isSmall ? 'text-sm' : ''}`}
    >
      <Icon size={isSmall ? 16 : 20} />
      <span className="font-medium">{label}</span>
    </button>
  );
}
