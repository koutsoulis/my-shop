"use client";

import { trpc } from "@/trpc/client";
import { Button, Card, Group, Stack, Image, Text } from "@mantine/core";
import { IconReceipt, IconX } from "@tabler/icons-react";
import NextImage from "next/image";
import { useEffect, useState } from "react";

export function OrderComponent({
  id,
  timestamp,
  order_items,
}: {
  id: number;
  timestamp: string;
  order_items: {
    movie_opensearch_id: string;
    quantity: number;
  }[];
}) {
  // workaround because suppressHydrationWarning doesn't work: https://github.com/vercel/next.js/issues/58493
  // when fixed, replace with https://nextjs.org/docs/messages/react-hydration-error#solution-3-using-suppresshydrationwarning
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const receiptQuery = trpc.getOrderReceipt.useQuery(
    { orderID: id },
    { retry: 4, refetchOnWindowFocus: false }
  );

  const movieTitleByIDQuery = trpc.getMoviesByIDs.useQuery(
    {
      opensearch_movie_ids: order_items.map((item) => item.movie_opensearch_id),
    },
    { refetchOnWindowFocus: false }
  );

  const dtf = new Intl.DateTimeFormat(undefined, {
    dateStyle: "long",
    timeStyle: "long",
  });
  const localizedTimestamp = dtf.format(new Date(timestamp));

  return (
    <Card withBorder={true} key={"order_id_" + id.toString()}>
      <Stack>
        <Text>
          Creation time:{" "}
          {isClient && <time dateTime={timestamp}>{localizedTimestamp}</time>}
        </Text>
        <Group>
          <div>Order summary:</div>
          {order_items.map((item) => {
            const movieData = movieTitleByIDQuery.data?.get(
              item.movie_opensearch_id
            );
            return (
              <Group>
                <Card padding="xl" withBorder={true}>
                  <Card.Section>
                    <Image
                      component={NextImage}
                      src={movieData?.image_url ?? ""}
                      alt={"no image"}
                      //   fit="fill"
                      width={120}
                      height={160}
                      w={120}
                      h={160}
                    ></Image>
                  </Card.Section>
                  <Card.Section>
                    <Text w={120}>{movieData?.title}</Text>
                  </Card.Section>
                </Card>
                <div> X {item.quantity}</div>
              </Group>
            );
          })}
        </Group>
        <Button
          component="a"
          href={receiptQuery.data}
          loading={receiptQuery.isFetching}
        >
          {receiptQuery.isSuccess ? <IconReceipt /> : <IconX />}
        </Button>
      </Stack>
    </Card>
  );
}
