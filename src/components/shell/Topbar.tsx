"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type TopbarProps = {
  title: string;
  userName?: string;
};

function getUserInitials(name?: string | null, email?: string | null): string {
  const safeName = name?.trim();
  if (safeName) {
    const parts = safeName.split(/\s+/).filter(Boolean);
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase() || "U";
    }
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }

  const safeEmail = email?.trim();
  if (safeEmail) {
    const localPart = safeEmail.split("@")[0]?.replace(/[^a-zA-Z0-9]/g, "") ?? "";
    return localPart.slice(0, 2).toUpperCase() || "U";
  }

  return "U";
}

export default function Topbar({ title, userName }: TopbarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const topbarRef = useRef<HTMLElement | null>(null);
  const routeTitleMap: Array<{ prefix: string; title: string }> = [
    { prefix: "/admin/integrations", title: "Integrações" },
    { prefix: "/admin/dna", title: "DNA da Marca" },
    { prefix: "/admin/assistant", title: "Assistente" },
    { prefix: "/admin/assets", title: "Assets" },
    { prefix: "/admin", title: "Campanhas" },
  ];
  const resolvedUserName = user?.name ?? user?.email ?? userName ?? "Usuário";
  const userInitials = getUserInitials(user?.name, user?.email ?? userName);

  const resolvedTitle =
    routeTitleMap.find((item) => pathname.startsWith(item.prefix))?.title ?? title;

  useEffect(() => {
    const topbarElement = topbarRef.current;
    if (!topbarElement || typeof document === "undefined" || typeof window === "undefined") {
      return;
    }

    const setTopbarHeightVar = () => {
      document.documentElement.style.setProperty(
        "--topbar-height",
        `${topbarElement.offsetHeight}px`
      );
    };

    setTopbarHeightVar();

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(() => {
        setTopbarHeightVar();
      });
      observer.observe(topbarElement);
    }

    window.addEventListener("resize", setTopbarHeightVar);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", setTopbarHeightVar);
    };
  }, []);

  return (
    <header
      ref={topbarRef}
      className="sticky top-0 z-20 flex flex-col gap-3 bg-[var(--bg-body)] px-6 pt-6 lg:px-10 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--text-main)]">
          {resolvedTitle}
        </h1>
        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-1 text-xs font-semibold text-[var(--success-text)]">
          <span className="h-2 w-2 rounded-full bg-[var(--success-text)]" />
          Auto-salvo
        </span>
      </div>

      <div className="flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-1.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-body)] text-xs font-bold text-[var(--text-main)]">
          {userInitials}
        </span>
        <span className="text-sm font-semibold text-[var(--text-main)]">{resolvedUserName}</span>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--bg-body)] text-[var(--text-secondary)]">
          <svg viewBox="0 0 20 20" className="h-3 w-3" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M5 8l5 5 5-5" />
          </svg>
        </span>
      </div>
    </header>
  );
}
