"use client";

import { AppShell } from "@mantine/core";
import { SessionProvider } from "next-auth/react";

export default function Main({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AppShell.Main>{children}</AppShell.Main>
    </SessionProvider>
  );
}
