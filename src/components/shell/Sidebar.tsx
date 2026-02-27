"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Campanhas", href: "/admin", icon: "grid" },
  { label: "DNA da Marca", href: "/admin/dna", icon: "fingerprint" },
  { label: "Assistente", href: "/admin/assistant", icon: "robot" },
  { label: "Assets", href: "/admin/assets", icon: "image" },
];

type NavIconProps = {
  type: "grid" | "fingerprint" | "robot" | "image";
  className?: string;
};

function NavIcon({ type, className }: NavIconProps) {
  switch (type) {
    case "grid":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );
    case "fingerprint":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 5a6 6 0 0 1 6 6" />
          <path d="M7 12a5 5 0 0 1 10 0" />
          <path d="M9 12v3" />
          <path d="M15 12v4" />
          <path d="M12 12v6" />
        </svg>
      );
    case "robot":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <rect x="4" y="7" width="16" height="12" rx="3" />
          <path d="M9 7V4" />
          <circle cx="9" cy="12" r="1" fill="currentColor" />
          <circle cx="15" cy="12" r="1" fill="currentColor" />
          <path d="M10 16h4" />
        </svg>
      );
    case "image":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m7 14 3-3 4 4 3-3 3 3" />
          <circle cx="9" cy="9" r="1" fill="currentColor" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin" || pathname === "/admin/";
    return pathname.startsWith(href);
  }

  return (
    <aside className="flex w-full flex-col gap-6 border-b border-[var(--border)] bg-[var(--bg-surface)] px-6 py-6 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
      <div>
        <div className="mb-8 flex items-center gap-3 text-lg font-extrabold text-[var(--text-main)]">
          <div
            className="h-9 w-9 rounded-[10px] shadow-[var(--shadow-brand)]"
            style={{ background: "var(--brand-gradient)" }}
          />
          Trax.OS
        </div>
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]">
          Navegação
        </div>
        <nav className="mt-3 flex flex-col gap-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const baseClasses =
              "relative flex items-center gap-3 rounded-lg px-3 py-2 pl-4 text-sm font-medium transition-colors";
            const stateClasses = active
              ? "bg-[var(--orange-light)] text-[var(--brand-orange)]"
              : "text-[var(--text-secondary)] hover:bg-[var(--bg-body)] hover:text-[var(--brand-orange)]";

            return (
              <Link key={item.label} href={item.href} className={`${baseClasses} ${stateClasses}`}>
                {active ? (
                  <span
                    className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full"
                    style={{ background: "var(--brand-gradient)" }}
                    aria-hidden="true"
                  />
                ) : null}
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--bg-body)]">
                  <NavIcon type={item.icon as NavIconProps["type"]} className="h-4 w-4" />
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-body)] p-4">
        <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
          <span className="font-semibold text-[var(--text-main)]">Sinal do Sistema</span>
          <span className="font-semibold text-[var(--success-text)]">Estável 98%</span>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[var(--border)]">
          <div className="h-full w-[98%] rounded-full bg-[var(--success-text)]" />
        </div>
      </div>
    </aside>
  );
}
