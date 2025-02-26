import { AppShell, AppShellHeader, AppShellMain } from "@mantine/core";
import FilteredSearch from "./FilteredSearch";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

export default async function MoviesSearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authSession = await auth();
  return (
    // <AppShell header={{ height: 60 }}>
    <>
      <header className="sticky top-0 z-10 bg-white">
        <FilteredSearch session={authSession}></FilteredSearch>
      </header>
      <main>{children}</main>
      {/* <AppShellMain>{children}</AppShellMain> */}
    </>
  );
}
