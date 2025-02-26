import { Anchor, List, ListItem, Text } from "@mantine/core";
import { IconPointFilled } from "@tabler/icons-react";
import Image from "next/image";

export default async function Page() {
  return (
    <div>
      <Text>This is a toy project to try out front-end technologies.</Text>
      <Text>
        Click on the Movies button to start searching for movies. To add movies
        to the basket and test the checkout flow you need to first sign in.
      </Text>
      <Text>Made with:</Text>
      <List icon={<IconPointFilled />}>
        <ListItem
          icon={
            <Image src={"/React-icon.svg"} alt={""} width={25} height={25} />
          }
        >
          <Anchor href="https://react.dev/">React</Anchor>
        </ListItem>
        <ListItem
          icon={<Image src={"/next-js.svg"} alt={""} width={25} height={25} />}
        >
          <Anchor href="https://nextjs.org/">Next.js</Anchor>
        </ListItem>
        <ListItem
          icon={<Image src={"/logo-sm.webp"} alt={""} width={25} height={25} />}
        >
          <Anchor href="https://authjs.dev/"> Auth.js</Anchor>
        </ListItem>
        <ListItem
          icon={<Image src={"/tanstack.png"} alt={""} width={25} height={25} />}
        >
          <Anchor href="https://tanstack.com/query">TanStack Query</Anchor>
        </ListItem>
        <ListItem
          icon={<Image src={"/trpc.svg"} alt={""} width={25} height={25} />}
        >
          <Anchor href="https://trpc.io/">tRPC</Anchor>
        </ListItem>
        <ListItem
          icon={
            <Image
              src={"/supabase-logo-icon.svg"}
              alt={""}
              width={25}
              height={25}
            />
          }
        >
          <Anchor href="https://supabase.com/">
            Supabase to store sessions, users, baskets and orders.
          </Anchor>
        </ListItem>
        <ListItem
          icon={
            <Image
              src={"/opensearch_mark_default.svg"}
              alt={""}
              width={25}
              height={25}
            />
          }
        >
          <Anchor href="https://opensearch.org/">
            Opensearch (AWS fork of ElasticSearch) to store and query collection
            of movies.
          </Anchor>
        </ListItem>
        <ListItem
          icon={
            <Image src={"/mantine-logo.svg"} alt={""} width={25} height={25} />
          }
        >
          <Anchor href="https://mantine.dev/">
            Mantine for the React components.
          </Anchor>
        </ListItem>
        <ListItem
          icon={
            <Image
              src={"/Stripe_icon_-_square.svg"}
              alt={""}
              width={25}
              height={25}
            />
          }
        >
          <Anchor href="https://stripe.com/">
            Stripe in test mode for a mock checkout flow.
          </Anchor>
        </ListItem>
        {/* <ListItem></ListItem> */}
      </List>
    </div>
  );
}
