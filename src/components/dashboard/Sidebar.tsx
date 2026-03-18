"use client";

import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, LogOut, Megaphone, Plug, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navLinks = [
  { href: "/admin", label: "Visão Geral", icon: LayoutDashboard, exact: true },
  { href: "/admin/campaigns", label: "Campanhas", icon: Megaphone },
  { href: "/admin/integrations", label: "Integrações", icon: Plug },
  { href: "/admin/settings", label: "Configurações", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const router = useRouter();

  function handleSignOut() {
    signOut();
    router.push("/login");
  }

  return (
    <aside className="w-[260px] min-h-screen flex flex-col p-5 shrink-0 border-r border-[var(--border)] bg-[var(--sidebar-bg)] relative transition-colors duration-300">
      
      {/* Top Brand Gradient Ribbon */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-brand-gradient" />

      {/* Logo */}
      <div className="pl-2 mb-10 mt-2">
        <Link href="/admin">
          <Image
            src="/brand/Logo_Trax_horizontal-laranja.png"
            alt="TRAX Soluções de Marketing"
            width={140}
            height={44}
            className="object-left object-contain"
            priority
          />
        </Link>
      </div>

      {/* Menu Section */}
      <div className="mb-2 pl-2">
        <span className="text-[10px] font-bold text-[var(--sidebar-text)] opacity-60 tracking-widest uppercase">
          Menu Principal
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1.5 flex-1">
        {navLinks.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`menu-link ${isActive ? "active" : ""}`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-[var(--brand-orange)]" : ""} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="h-px bg-white/5 my-4 mx-2" />

      {/* User Footer Profile & Logout */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--sidebar-hover)] transition cursor-pointer">
           <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FD8F06] to-[#990099] flex items-center justify-center text-white shrink-0 font-bold shadow-lg">
             TR
           </div>
           <div className="flex-1 min-w-0">
             <p className="text-sm font-semibold text-[var(--text-inverse)] truncate">Thiago Ribeiro</p>
             <p className="text-xs text-[var(--sidebar-text)] truncate">thiago@trax.com.br</p>
           </div>
        </div>

        <button
          onClick={handleSignOut}
          className="flex items-center justify-center gap-2 p-3 mt-1 w-full rounded-lg text-sm font-medium text-[var(--sidebar-text)] bg-white/5 hover:bg-red-500/10 hover:text-red-500 border border-transparent transition-all"
        >
          <LogOut size={16} />
          Encerrar Sessão
        </button>
      </div>
    </aside>
  );
}
