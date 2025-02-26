import "@/app/globals.css";
import "@mantine/notifications/styles.css";
import { auth } from "@/auth";
import { TRPCProvider } from "@/trpc/client";
import { AppShell, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { enableMapSet } from "immer";
import { SessionProvider } from "next-auth/react";
import { SignIn, SignOut } from "../../ui/layout-buttons";
import Header from "./basket/header";
import Main from "./basket/main";
import NavBar from "./basket/navbar";
import { Notifications } from "@mantine/notifications";

export const metadata = {
  title: "Video club (fake)",
  description: "A fake store selling movies.",
};

enableMapSet();

async function LoggedAccountElement() {
  const session = await auth();
  const email = session?.user?.email;
  return <>{email ? <SignOut>{`Welcome ${email}`}</SignOut> : <SignIn />}</>;
}
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en">
      <body>
        {/* <SessionProvider session={session}> */}
        <TRPCProvider>
          <MantineProvider>
            <Notifications position="top-right" />
            <AppShell
              // header={{ height: 60 }}
              layout="alt"
              navbar={{
                width: 300,
                breakpoint: "sm",
              }}
              padding="md"
            >
              <NavBar loggedIn={!!session?.user}>
                <LoggedAccountElement />
              </NavBar>
              <Main>{children}</Main>
            </AppShell>
          </MantineProvider>
        </TRPCProvider>
        {/* </SessionProvider> */}
      </body>
    </html>
  );
}
