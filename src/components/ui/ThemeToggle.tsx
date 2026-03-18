"use client";

import { useTheme } from "@/context/ThemeProvider";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label="Alternar tema"
      style={{
        width: 40,
        height: 40,
        borderRadius: 10,
        border: "1.5px solid var(--border)",
        background: "var(--bg-surface-2)",
        color: "var(--text-secondary)",
        cursor: "pointer",
        display: "grid",
        placeItems: "center",
        transition: "all 0.2s",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "var(--primary-light)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--primary)";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--primary)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-surface-2)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
      }}
    >
      {theme === "dark" ? (
        <Sun size={18} strokeWidth={2} />
      ) : (
        <Moon size={18} strokeWidth={2} />
      )}
    </button>
  );
}
