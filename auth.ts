import NextAuth from "next-auth";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import type { Provider } from "next-auth/providers"

const providers: Provider[] = [
  // Credentials({
  //   credentials: { password: { label: "Password", type: "password" } },
  //   authorize(c) {
  //     if (c.password !== "password") return null
  //     return {
  //       id: "test",
  //       name: "Test User",
  //       email: "test@example.com",
  //     }
  //   },
  // }),
  Google,
  GitHub,
]

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  debug: true,
  providers,
  adapter: SupabaseAdapter({
    url: process.env.SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
});
