"use client";

import { NavbarSimple } from "@/ui/navbar/NavbarSimple";
import { AppShell } from "@mantine/core";

export default function NavBar({
  children,
  loggedIn,
}: {
  children: React.ReactNode;
  loggedIn: boolean;
}) {
  return (
    <AppShell.Navbar p="md">
      {children}
      <NavbarSimple loggedIn={loggedIn} />
    </AppShell.Navbar>
  );
}
