import { auth } from "@/auth";
import { supabase } from "@/services/supabase-client";
import { Stack } from "@mantine/core";
import { OrderComponent } from "./OrderComponent";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  const userID = session?.user?.id;

  userID ?? redirect("/movies");

  const orderItems = userID
    ? await supabase
        .from("orders")
        .select(
          "id, order_timestamp, order_items(movie_opensearch_id, quantity)"
        )
        .eq("user_id", userID)
    : undefined;

  //   const orderIDToItems = new Map<
  //     number,
  //     {
  //       movie_opensearch_id: string;
  //       quantity: number;
  //     }[]
  //   >();

  //   orderItems?.data?.forEach(row => {
  //     orderIDToItems.set(row.id, row.order_items)
  //   })

  return (
    <Stack>
      {/* {orderItems?.data?.map((row) => {
        return <div>{JSON.stringify(row)}</div>;
      })} */}
      {orderItems?.data?.reverse().map((row) => (
        <OrderComponent
          id={row.id}
          timestamp={row.order_timestamp!}
          order_items={row.order_items}
        ></OrderComponent>
      ))}
    </Stack>
  );
}
