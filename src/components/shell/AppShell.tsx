import React from "react";

import Sidebar from "@/components/shell/Sidebar";
import Topbar from "@/components/shell/Topbar";

type AppShellProps = {
  children: React.ReactNode;
  title?: string;
};

export default function AppShell({ children, title = "Campanhas" }: AppShellProps) {
  return (
    <div className="min-h-screen w-full bg-[var(--bg-body)] text-[var(--text-main)]">
      <div className="flex min-h-screen w-full flex-col md:flex-row">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar title={title} />
          <main className="flex-1 px-6 pb-10 pt-6 lg:px-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
