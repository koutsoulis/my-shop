import { signIn, signOut } from "@/auth";
import { Button } from "@mantine/core";

export function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        const res = await signIn();
      }}
    >
      <Button type="submit">Sign in</Button>
    </form>
  );
}

export function SignOut({ children }: { children: React.ReactNode }) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <p>{children}</p>
      <Button color="red" type="submit">
        Sign out
      </Button>
    </form>
  );
}
