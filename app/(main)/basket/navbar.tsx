"use client";

import { SignIn, SignOut } from "@/ui/layout-buttons";
import { NavbarSegmented } from "@/ui/navbar/NavbarSegmented";
import { NavbarSimple } from "@/ui/navbar/NavbarSimple";
import { AppShell } from "@mantine/core";
import { SessionContext } from "next-auth/react";
import { useContext } from "react";

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
