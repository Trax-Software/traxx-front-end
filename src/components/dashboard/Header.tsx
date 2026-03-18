"use client";

import { Bell, Search, PlusCircle, ChevronRight, User } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle"; // keep existing ThemeToggle

export function Header() {
  const pathname = usePathname();

  // Mapeia pathname para breadcrumbs (mock simples)
  const paths = pathname.split("/").filter(Boolean);
  
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--bg-surface)] px-8 shadow-sm">
      {/* Esquerda: Breadcrumbs */}
      <div className="flex items-center space-x-2 text-sm text-[var(--text-secondary)]">
        <span className="font-semibold text-[var(--primary)]">Trax</span>
        {paths.map((path, idx) => (
            <div key={path} className="flex items-center space-x-2">
                <ChevronRight size={14} className="opacity-50" />
                <span className={`capitalize ${idx === paths.length - 1 ? "font-bold text-[var(--text-primary)]" : "opacity-80"}`}>
                {path.replace(/-/g, " ")}
                </span>
            </div>
        ))}
      </div>

      {/* Direita: Ações */}
      <div className="flex items-center space-x-6">
        
        {/* Barra de Pesquisa */}
        <div className="bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-full px-4 py-2 flex items-center space-x-2 w-64 focus-within:ring-2 focus-within:ring-[var(--primary-light)] focus-within:border-[var(--primary)] transition-all">
          <Search size={16} className="text-[var(--text-tertiary)]" />
          <input 
            type="text" 
            placeholder="Buscar... (CMD+K)" 
            className="bg-transparent border-none outline-none text-sm w-full text-[var(--text-primary)] placeholder-[var(--text-tertiary)]"
          />
        </div>

        {/* Notificações */}
        <button className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-full hover:bg-[var(--bg-surface-2)]">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[var(--brand-magenta)] rounded-full border-2 border-[var(--bg-surface)]"></span>
        </button>

        {/* Tema */}
        <ThemeToggle />

        {/* Criar Campanha */}
        <Link href="/admin/campaigns" className="btn-primary">
          <PlusCircle size={16} />
          Nova Campanha
        </Link>
        
        {/* Avatar Usuário Mocão */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[var(--brand-orange)] to-[var(--brand-magenta)] flex items-center justify-center text-white font-bold cursor-pointer">
          <User size={18} />
        </div>
      </div>
    </header>
  );
}
