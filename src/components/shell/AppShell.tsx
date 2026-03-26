import React from "react";

import Sidebar from "@/components/shell/Sidebar";
import Topbar from "@/components/shell/Topbar";

type AppShellProps = {
  children: React.ReactNode;
  title?: string;
};

export default function AppShell({ children, title = "Campanhas" }: AppShellProps) {
  return (
    <div className="h-screen w-full overflow-hidden bg-[var(--bg-body)] text-[var(--text-main)]">
      <div className="flex h-full w-full flex-col md:flex-row">
        <Sidebar />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
          <Topbar title={title} />
          <main className="min-h-0 flex-1 overflow-x-hidden px-6 pb-10 pt-6 lg:px-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
