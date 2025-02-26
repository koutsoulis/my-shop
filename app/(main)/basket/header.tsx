"use client";

import { AppShell } from "@mantine/core";

export default function Header({ children }: { children: React.ReactNode }) {
  return <AppShell.Header>{children}</AppShell.Header>;
}
