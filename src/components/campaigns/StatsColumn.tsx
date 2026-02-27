import React from "react";

type StatsColumnProps = {
  children: React.ReactNode;
};

export default function StatsColumn({ children }: StatsColumnProps) {
  return <div className="flex flex-col gap-6">{children}</div>;
}
